# FILE: zpc_tt_runtime_v1_1_0_ZPC_GODCORE.py
# VERSION: v1.1.0-ZPC-GODCORE
# NAME: ZPC Tensor-Train Runtime (Factorizer + Seeded-Core + Tiled Matmul)
# AUTHOR: Brandon "iambandobandz" Emery x Victor (Fractal Architect Mode)
# PURPOSE: Factorize dense weights into TT cores, pack them, reconstruct via deterministic
#          seed or stored cores, and run tiled CPU matmul with an LRU tile cache.
# LICENSE: Proprietary - Massive Magnetics / Ethica AI / BHeard Network

from __future__ import annotations
import json
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Optional  # only for Optional[str] in CLI args if you extend; core uses built-ins
import numpy as np

# =========================
# Small utils
# =========================
def _prod(xs: list[int] | tuple[int, ...]) -> int:
    p = 1
    for x in xs:
        p *= int(x)
    return int(p)

def _svd_truncate(A: np.ndarray, rank: int) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    U, S, Vt = np.linalg.svd(A, full_matrices=False)
    r = min(rank, U.shape[1])
    return U[:, :r], S[:r], Vt[:r, :]

def _seeded_rng(global_seed: int, layer_id: int, core_idx: int, shape: tuple[int, ...]) -> np.ndarray:
    """Deterministic per-core RNG with PCG64DXSM (stable across platforms)."""
    seed = (np.uint64(global_seed)
            ^ (np.uint64(layer_id) * np.uint64(0x9E3779B185EBCA87))
            ^ np.uint64(core_idx))
    rg = np.random.Generator(np.random.PCG64DXSM(seed))
    return rg.standard_normal(shape, dtype=np.float32) * 0.02

# =========================
# TT representation
# =========================
@dataclass
class TTCores:
    ranks: list[int]               # len = d+1, r0 = rd = 1
    shapes: list[tuple[int, ...]]  # length d; each (n_k,)
    cores: list[np.ndarray]        # each core: [r_{k-1}, n_k, r_k], float32

def tt_factorize_dense(W: np.ndarray,
                       in_shape: tuple[int, ...],
                       out_shape: tuple[int, ...],
                       max_rank: int) -> TTCores:
    """
    TT-SVD factorization for a 2D matrix reshaped to a d-way tensor.
    W: (m, n) with m = prod(in_shape), n = prod(out_shape)
    Returns TT cores with ranks capped by max_rank.
    """
    m, n = W.shape
    assert _prod(in_shape) == m, f"in_shape product { _prod(in_shape) } != m { m }"
    assert _prod(out_shape) == n, f"out_shape product { _prod(out_shape) } != n { n }"

    modes = list(in_shape) + list(out_shape)
    d = len(modes)
    X = W.reshape(*modes)

    ranks: list[int] = [1]
    cores: list[np.ndarray] = []
    unfolding = X
    r_prev = 1

    for k in range(d - 1):
        n_k = modes[k]
        left = unfolding.reshape(r_prev * n_k, -1)
        U, S, Vt = _svd_truncate(left, max_rank)
        r_k = U.shape[1]
        Gk = U.reshape(r_prev, n_k, r_k).astype(np.float32)
        cores.append(Gk)
        unfolding = (np.diag(S).astype(np.float32) @ Vt.astype(np.float32)).reshape(r_k, *modes[k + 1:])
        r_prev = r_k
        ranks.append(r_k)

    G_last = unfolding.reshape(r_prev, modes[-1], 1).astype(np.float32)
    cores.append(G_last)
    ranks.append(1)

    shapes = [ (int(nk),) for nk in modes ]
    return TTCores(ranks=ranks, shapes=shapes, cores=cores)

def _contract_tt_full(cores: list[np.ndarray]) -> np.ndarray:
    """Contract all TT cores to a dense tensor (debug/validation)."""
    T = cores[0]                     # [1, n0, r1]
    T = np.moveaxis(T, 1, 0)         # [n0, 1, r1]
    for k in range(1, len(cores)):
        G = cores[k]                 # [r_k, n_k, r_{k+1}]
        T = T.reshape(-1, G.shape[0]) @ G.reshape(G.shape[0], -1)
        T = T.reshape(-1, G.shape[1], G.shape[2])
    T = T[..., 0]                    # drop last rank=1 -> [n0, n1, ..., n_{d-1}]
    return T

def tt_reconstruct(TT: TTCores) -> np.ndarray:
    return _contract_tt_full(TT.cores)

# =========================
# Seeded Generator params
# =========================
@dataclass
class SGCoreParams:
    mode: str                     # "store" (quantized core) or "affine" (seeded RNG a*r+b)
    a: float | None = None
    b: float | None = None
    qmin: float | None = None
    qmax: float | None = None
    key: str | None = None        # data key inside NPZ for qdata

@dataclass
class LayerPack:
    layer_id: int
    in_shape: tuple[int, ...]
    out_shape: tuple[int, ...]
    ranks: list[int]
    core_shapes: list[tuple[int, int, int]]   # per-core shapes
    sg_params: list[SGCoreParams]             # per-core params

@dataclass
class ZPCPack:
    global_seed: int
    layers: list[LayerPack]

# =========================
# Quantization helpers (u8)
# =========================
def _quantize_u8(x: np.ndarray) -> tuple[np.ndarray, float, float]:
    xmin = float(x.min())
    xmax = float(x.max())
    if xmax == xmin:
        return np.zeros_like(x, dtype=np.uint8), xmin, xmax
    q = np.clip(np.round((x - xmin) * 255.0 / (xmax - xmin)), 0, 255).astype(np.uint8)
    return q, xmin, xmax

def _dequantize_u8(q: np.ndarray, xmin: float, xmax: float) -> np.ndarray:
    if xmax == xmin:
        return np.full(q.shape, xmin, dtype=np.float32)
    return (q.astype(np.float32) * (xmax - xmin) / 255.0) + xmin

# =========================
# Packing & Synthesis
# =========================
def pack_layer_from_tt(layer_id: int,
                       TT: TTCores,
                       in_shape: tuple[int, ...],
                       out_shape: tuple[int, ...],
                       mode: str = "store") -> tuple[LayerPack, dict[str, np.ndarray]]:
    """
    Convert TT cores to a packable LayerPack.
    - mode="store": quantize and store each core (loss ~8-bit granularity).
    - mode="affine": no core storage; synthesize via RNG with per-core (a,b).
    Returns (LayerPack, blob_dict) where blob_dict contains core arrays for store-mode.
    """
    assert mode in ("store", "affine")
    core_shapes: list[tuple[int,int,int]] = []
    sg_params: list[SGCoreParams] = []
    blob: dict[str, np.ndarray] = {}

    for k, G in enumerate(TT.cores):
        shape = tuple(int(s) for s in G.shape)
        core_shapes.append(shape)
        if mode == "store":
            q, qmin, qmax = _quantize_u8(G)
            key = f"layer{layer_id}_core{k}_q"
            blob[key] = q
            sg_params.append(SGCoreParams(mode="store", qmin=qmin, qmax=qmax, key=key))
        else:
            # Cheap affine fit: match mean/std of RNG to G
            rng = _seeded_rng(0, layer_id, k, shape)
            g_mean, g_std = float(G.mean()), float(G.std() + 1e-8)
            r_mean, r_std = float(rng.mean()), float(rng.std() + 1e-8)
            a = g_std / r_std
            b = g_mean - a * r_mean
            sg_params.append(SGCoreParams(mode="affine", a=a, b=b))

    L = LayerPack(layer_id=layer_id,
                  in_shape=tuple(int(x) for x in in_shape),
                  out_shape=tuple(int(x) for x in out_shape),
                  ranks=list(int(r) for r in TT.ranks),
                  core_shapes=core_shapes,
                  sg_params=sg_params)
    return L, blob

def synth_core(pack: ZPCPack,
               npz_blob: dict[str, np.ndarray],
               layer: LayerPack,
               core_idx: int) -> np.ndarray:
    p = layer.sg_params[core_idx]
    shape = layer.core_shapes[core_idx]
    if p.mode == "store":
        q = npz_blob[p.key]  # type: ignore[arg-type]
        return _dequantize_u8(q, p.qmin, p.qmax).astype(np.float32)  # type: ignore[arg-type]
    elif p.mode == "affine":
        rng = _seeded_rng(pack.global_seed, layer.layer_id, core_idx, shape)
        return (p.a * rng + p.b).astype(np.float32)  # type: ignore[operator]
    else:
        raise ValueError("Unknown sg mode")

# =========================
# Pack I/O
# =========================
def save_pack(pack: ZPCPack, blob: dict[str, np.ndarray], out_stem: Path | str):
    out = Path(out_stem)
    meta = {
        "global_seed": int(pack.global_seed),
        "layers": []
    }
    for L in pack.layers:
        meta["layers"].append({
            "layer_id": int(L.layer_id),
            "in_shape": list(map(int, L.in_shape)),
            "out_shape": list(map(int, L.out_shape)),
            "ranks": list(map(int, L.ranks)),
            "core_shapes": [ list(map(int, s)) for s in L.core_shapes ],
            "sg_params": [
                (
                    {"mode": "store", "qmin": float(p.qmin), "qmax": float(p.qmax), "key": p.key}
                    if p.mode == "store" else
                    {"mode": "affine", "a": float(p.a), "b": float(p.b)}
                )
                for p in L.sg_params
            ]
        })
    with open(out.with_suffix(".json"), "w") as f:
        json.dump(meta, f)
    np.savez_compressed(out.with_suffix(".npz"), **blob)

def load_pack(in_stem: Path | str) -> tuple[ZPCPack, dict[str, np.ndarray]]:
    stem = Path(in_stem)
    meta = json.loads(stem.with_suffix(".json").read_text())
    npz = np.load(stem.with_suffix(".npz"))
    layers: list[LayerPack] = []
    for Lm in meta["layers"]:
        sg_params: list[SGCoreParams] = []
        for sp in Lm["sg_params"]:
            if sp["mode"] == "store":
                sg_params.append(SGCoreParams(mode="store", qmin=sp["qmin"], qmax=sp["qmax"], key=sp["key"]))
            else:
                sg_params.append(SGCoreParams(mode="affine", a=sp["a"], b=sp["b"]))
        layers.append(LayerPack(
            layer_id=Lm["layer_id"],
            in_shape=tuple(Lm["in_shape"]),
            out_shape=tuple(Lm["out_shape"]),
            ranks=list(Lm["ranks"]),
            core_shapes=[ tuple(s) for s in Lm["core_shapes"] ],
            sg_params=sg_params
        ))
    return ZPCPack(global_seed=int(meta["global_seed"]), layers=layers), dict(npz.items())

# =========================
# Tile cache + runtime
# =========================
class TileCache:
    def __init__(self, max_bytes: int = 2_000_000_000):
        self.max_bytes = int(max_bytes)
        self._store: dict[tuple[int,int,int,int], np.ndarray] = {}
        self._order: list[tuple[int,int,int,int]] = []
        self.bytes = 0

    def get(self, key: tuple[int,int,int,int]) -> np.ndarray | None:
        return self._store.get(key, None)

    def put(self, key: tuple[int,int,int,int], arr: np.ndarray):
        sz = int(arr.nbytes)
        self._store[key] = arr
        self._order.append(key)
        self.bytes += sz
        while self.bytes > self.max_bytes and self._order:
            victim = self._order.pop(0)
            v = self._store.pop(victim, None)
            if v is not None:
                self.bytes -= int(v.nbytes)

class ZPCRuntime:
    """
    Prototype runtime. For clarity/simplicity, we currently:
      - Synthesize all cores once per layer call
      - Contract to full W once (Din x Dout) per layer call (TODO: per-tile contraction)
      - Run tiled matmul on columns/rows with cache hooks (future: cache per-tile W blocks)
    This is intentionally straightforward for your Dell; next step is true per-tile TT contraction.
    """
    def __init__(self, pack: ZPCPack, npz_blob: dict[str, np.ndarray],
                 tile_bytes: int = 256*1024):
        self.pack = pack
        self.blob = npz_blob
        self.tile_bytes = int(tile_bytes)
        self.cache = TileCache(max_bytes=2_000_000_000)

    def _layer_dense_weight(self, layer: LayerPack) -> np.ndarray:
        # Synthesize cores, contract to dense, then reshape to (Din, Dout)
        cores = [synth_core(self.pack, self.blob, layer, k) for k in range(len(layer.core_shapes))]
        T = _contract_tt_full(cores)
        m = _prod(layer.in_shape)
        n = _prod(layer.out_shape)
        return T.reshape(m, n)

    def matmul(self, layer: LayerPack, X: np.ndarray) -> np.ndarray:
        """
        X: [B, Din], returns Y = X @ W  (note: dense W is Din x Dout)
        Tiling strategy: column tiles, optionally row tiles if tile_bytes is tight.
        """
        B, Din = X.shape
        assert Din == _prod(layer.in_shape), "X dim mismatch to layer in_shape"
        Dout = _prod(layer.out_shape)
        Y = np.zeros((B, Dout), dtype=np.float32)

        bytes_per_float = 4
        # One output column tile = Din * cols * 4 bytes
        cols_per_tile = max(1, self.tile_bytes // (Din * bytes_per_float))

        # (Cache key could store W tiles in future; for now cache full W)
        key_full = (layer.layer_id, Din, Dout, -1)
        W_full = self.cache.get(key_full)
        if W_full is None:
            W_full = self._layer_dense_weight(layer)
            self.cache.put(key_full, W_full)

        for j in range(0, Dout, cols_per_tile):
            jj = slice(j, min(j + cols_per_tile, Dout))
            Y[:, jj] = X @ W_full[:, jj]
        return Y

# =========================
# Self-test / Demo
# =========================
def _demo():
    np.random.seed(0)
    # Keep shapes modest for i5-7200U; scale up after it runs clean
    in_shape  = (16, 16, 8)    # Din = 2048
    out_shape = (16, 32)       # Dout = 512
    Din, Dout = _prod(in_shape), _prod(out_shape)

    # Fake layer weights
    W = (np.random.randn(Din, Dout).astype(np.float32) * 0.1)

    print(f"[demo] W shape = {W.shape} (Din={Din}, Dout={Dout})")

    # Note: max_rank is a critical parameter. A small rank like 24 gives a small
    # compressed model, but can lead to high reconstruction error, as seen in this
    # demo. A larger rank (e.g., 1024) gives much better accuracy but a larger model.
    # The optimal value depends on the specific weights and the desired trade-off.
    max_rank = 24
    t0 = time.time()
    TT = tt_factorize_dense(W, in_shape, out_shape, max_rank=max_rank)
    t1 = time.time()
    print(f"[demo] TT factorized in {t1 - t0:.3f}s, ranks={TT.ranks} (max_rank={max_rank})")

    # Full reconstruction check (before quantization)
    T_full = tt_reconstruct(TT)
    W_hat = T_full.reshape(Din, Dout)
    rel_err = np.linalg.norm(W - W_hat) / (np.linalg.norm(W) + 1e-12)
    print(f"[demo] Full recon relative error (pre-quantization): {rel_err:.6e}")

    # Pack (store mode = quantized cores) and save
    L0, blob = pack_layer_from_tt(layer_id=0, TT=TT,
                                  in_shape=in_shape, out_shape=out_shape,
                                  mode="store")
    zpc = ZPCPack(global_seed=42, layers=[L0])
    out_stem = Path("demo_zpc_pack")
    save_pack(zpc, blob, out_stem)
    print(f"[demo] Saved pack: {out_stem.with_suffix('.json').name}, {out_stem.with_suffix('.npz').name}")

    # Load + runtime
    zpc2, blob2 = load_pack(out_stem)
    rt = ZPCRuntime(zpc2, blob2, tile_bytes=256*1024)

    # Matmul consistency
    B = 4
    X = np.random.randn(B, Din).astype(np.float32)

    t2 = time.time()
    Y_dense = X @ W
    t3 = time.time()
    Y_rt = rt.matmul(zpc2.layers[0], X)
    t4 = time.time()

    diff = np.linalg.norm(Y_dense - Y_rt) / (np.linalg.norm(Y_dense) + 1e-12)
    print(f"[demo] Matmul relative diff (post-quantization): {diff:.6e}")
    print(f"[demo] Dense time: {t3 - t2:.4f}s | ZPC-RT time: {t4 - t3:.4f}s")

    # Optional: seed-only approximation mode demo (uncomment)
    # L0_aff, blob_aff = pack_layer_from_tt(layer_id=0, TT=TT,
    #                                       in_shape=in_shape, out_shape=out_shape,
    #                                       mode="affine")
    # zpc_aff = ZPCPack(global_seed=1337, layers=[L0_aff])
    # rt_aff = ZPCRuntime(zpc_aff, blob_aff, tile_bytes=256*1024)
    # Y_aff = rt_aff.matmul(zpc_aff.layers[0], X)
    # diff_aff = np.linalg.norm(Y_dense - Y_aff) / (np.linalg.norm(Y_dense)+1e-12)
    # print(f"[demo] Seed-only affine diff: {diff_aff:.6e}")

if __name__ == "__main__":
    _demo()
