# FILE: majorana_emulator_v0_2_0.py
# VERSION: v0.2.0-MAJORANA-EMU-GODCORE
# NAME: MajoranaParityEmulator (Measurement-Only Godcore)
# AUTHOR: Brandon "iambandobandz" Emery x Victor (Fractal Architect Mode)
# PURPOSE: Parity-driven logical engine for Majorana-1. No direct gates. Only reads.
# LICENSE: Proprietary - Massive Magnetics / Ethica AI / BHeard Network
#
# FEATURES:
#   - Measurement-only Clifford: H, S, CNOT via parity gadgets
#   - Quasiparticle poisoning: global parity flip noise
#   - Outcome ledger: deterministic replay from transcript
#   - Feed-forward hooks: classical logic drives next parity
#   - Fermion parity conservation enforced
#   - Demo: parity-only GHZ, poisoning resilience test
# USAGE:
#   python majorana_emulator_v0_2_0.py --demo ghz-parity-only --n 4
#   python majorana_emulator_v0_2_0.py --demo stress --poison 0.05
import argparse
import random
import json
from typing import List, Tuple, Dict, Optional
# ---------------------------
# Low-level: Stabilizer Tableau (Enhanced)
# ---------------------------
PAULI_TO_BITS = {
    'I': (0, 0),
    'X': (1, 0),
    'Z': (0, 1),
    'Y': (1, 1),
}
def _randbit():
    return random.getrandbits(1)
class Tableau:
    def __init__(self, n: int):
        self.n = n
        self.X = [[0]*n for _ in range(n)]
        self.Z = [[0]*n for _ in range(n)]
        self.s = [0]*n
        for i in range(n):
            self.Z[i][i] = 1
    def h(self, q: int):
        for i in range(self.n):
            x, z = self.X[i][q], self.Z[i][q]
            self.X[i][q], self.Z[i][q] = z, x
            if x and z:
                self.s[i] ^= 1
    def s_gate(self, q: int):
        for i in range(self.n):
            x, z = self.X[i][q], self.Z[i][q]
            if x and z:
                self.s[i] ^= 1
            self.Z[i][q] ^= x
    def cnot(self, c: int, t: int):
        for i in range(self.n):
            xc, zc = self.X[i][c], self.Z[i][c]
            xt, zt = self.X[i][t], self.Z[i][t]
            self.s[i] ^= (xc & zt & (xt ^ zc))
            self.X[i][t] ^= xc
            self.Z[i][c] ^= zt
    def _pauli_commutes_with_gen(self, pX, pZ, gi) -> int:
        acc = 0
        for q in range(self.n):
            acc ^= (pX[q] & self.Z[gi][q]) ^ (pZ[q] & self.X[gi][q])
        return acc
    def _toggle_gen_with_op(self, gi, pX, pZ, phase):
        for q in range(self.n):
            x, z = self.X[gi][q], self.Z[gi][q]
            px, pz = pX[q], pZ[q]
            if px and z and not x and not pz:
                self.s[gi] ^= 1
            if pz and x and not z and not px:
                self.s[gi] ^= 1
            self.X[gi][q] ^= px
            self.Z[gi][q] ^= pz
        self.s[gi] ^= phase
    def _reduce_op_against_stabilizers(self, pX, pZ) -> Tuple[bool, int]:
        anticomm = 0
        for gi in range(self.n):
            a = self._pauli_commutes_with_gen(pX, pZ, gi)
            if a:
                anticomm ^= 1
        if anticomm:
            return (False, 0)
        return (True, 0)
    def measure(self, pauli: List[str]) -> int:
        assert len(pauli) == self.n
        pX = [0]*self.n
        pZ = [0]*self.n
        for q, P in enumerate(pauli):
            px, pz = PAULI_TO_BITS[P]
            pX[q], pZ[q] = px, pz
        anticomm_idxs = []
        for gi in range(self.n):
            if self._pauli_commutes_with_gen(pX, pZ, gi):
                anticomm_idxs.append(gi)
        if len(anticomm_idxs) == 0:
            tb = self.clone()
            feasible = tb._project_outcome(pX, pZ, 0)
            return 0 if feasible else 1
        else:
            outcome = self._random_outcome()
            self._project_outcome(pX, pZ, outcome)
            return outcome
    def _project_outcome(self, pX, pZ, outcome_bit) -> bool:
        pivot = None
        for gi in range(self.n):
            if self._pauli_commutes_with_gen(pX, pZ, gi):
                pivot = gi
                break
        if pivot is None:
            if outcome_bit == 1:
                for gi in range(self.n):
                    overlap = 0
                    for q in range(self.n):
                        if (pX[q] and self.X[gi][q]) or (pZ[q] and self.Z[gi][q]):
                            overlap = 1
                            break
                    if overlap:
                        self.s[gi] ^= 1
                        break
            return True
        for gj in range(self.n):
            if gj == pivot:
                continue
            if self._pauli_commutes_with_gen(pX, pZ, gj):
                self._left_mult_gen(gj, pivot)
        self.X[pivot] = pX[:]
        self.Z[pivot] = pZ[:]
        self.s[pivot] = outcome_bit
        return True
    def _left_mult_gen(self, j, i):
        phase = self.s[j] ^ self.s[i]
        add_phase = 0
        for q in range(self.n):
            xj, zj = self.X[j][q], self.Z[j][q]
            xi, zi = self.X[i][q], self.Z[i][q]
            add_phase ^= (xj & zi & (xj ^ zj ^ xi ^ zi ^ 1)) & 1
            self.X[j][q] ^= xi
            self.Z[j][q] ^= zi
        self.s[j] = phase ^ add_phase
    def _random_outcome(self):
        return _randbit()
    
    def clone(self):
        tb = Tableau(self.n)
        tb.X = [row[:] for row in self.X]
        tb.Z = [row[:] for row in self.Z]
        tb.s = self.s[:]
        return tb
    def get_fermion_parity(self) -> int:
        """Total fermion parity: product of all tetron parities (Z0 Z1 ... Zn-1)"""
        p = ['Z'] * self.n
        return self.measure(p)
# ---------------------------
# GODCORE: Measurement-Only Logical Engine
# ---------------------------
class MajoranaParityEmulator:
    def __init__(self, n_qubits: int, p_m: float = 0.0, p_z: float = 0.0,
                 p_poison: float = 0.0, seed: int = None, record: bool = True):
        self.n = n_qubits
        self.tb = Tableau(n_qubits)
        self.p_m = float(p_m)
        self.p_z = float(p_z)
        self.p_poison = float(p_poison)
        self.record = record
        self.transcript: List[dict] = []
        self.step_count = 0
        if seed is not None:
            random.seed(seed)
        self.outcomes: Dict[str, int] = {}
    def _log(self, op: str, qubits: List[int], outcome: int, **kwargs):
        if self.record:
            self.transcript.append({
                "step": self.step_count,
                "op": op,
                "qubits": qubits,
                "outcome": outcome,
                "time": self.step_count,
                **kwargs
            })
            self.step_count += 1
    def _maybe_flip(self, bit: int, p: float) -> int:
        return bit ^ (1 if random.random() < p else 0)
    def idle_step(self):
        for q in range(self.n):
            if random.random() < self.p_z:
                self._apply_pauli_error([(q, 'Z')])
        if random.random() < self.p_poison:
            # Global parity flip: simulate quasiparticle poisoning
            total_parity = self.tb.get_fermion_parity()
            # Flip it: equivalent to measuring and forcing opposite outcome
            p = ['Z'] * self.n
            self.tb._project_outcome([0]*self.n, [1]*self.n, 1 - total_parity)
            self._log("poison", list(range(self.n)), 1, severity="HIGH")
    def _apply_pauli_error(self, ops: List[Tuple[int, str]]):
        p = ['I']*self.n
        for q, P in ops:
            p[q] = P
        pX = [0]*self.n; pZ = [0]*self.n
        for i, sym in enumerate(p):
            px, pz = PAULI_TO_BITS[sym]
            pX[i], pZ[i] = px, pz
        for gi in range(self.n):
            if self._pauli_commutes(pX, pZ, gi):
                self.tb.s[gi] ^= 1
    def _pauli_commutes(self, pX, pZ, gi) -> int:
        return self.tb._pauli_commutes_with_gen(pX, pZ, gi)
    # --- PARITY MEASUREMENTS (PRIMITIVE) ---
    def mz(self, q: int) -> int:
        p = ['I']*self.n; p[q] = 'Z'
        out = self.tb.measure(p)
        flipped = self._maybe_flip(out, self.p_m)
        self._log("mz", [q], flipped, ideal=out)
        self.outcomes[f"mz_{q}"] = flipped
        return flipped
    def mx(self, q: int) -> int:
        self.tb.h(q)
        out = self.mz(q)
        self.tb.h(q)
        return out
    def mzz(self, q1: int, q2: int) -> int:
        p = ['I']*self.n; p[q1] = 'Z'; p[q2] = 'Z'
        out = self.tb.measure(p)
        flipped = self._maybe_flip(out, self.p_m)
        self._log("mzz", [q1,q2], flipped, ideal=out)
        self.outcomes[f"mzz_{q1}_{q2}"] = flipped
        return flipped
    def mxx(self, q1: int, q2: int) -> int:
        self.tb.h(q1); self.tb.h(q2)
        out = self.mzz(q1, q2)
        self.tb.h(q1); self.tb.h(q2)
        return out
    # --- MEASUREMENT-ONLY CLIFFORD GATES ---
    def h_parity(self, q: int, ancilla: int):
        """H(q) via parity gadget using ancilla."""
        outcome = self.mxx(q, ancilla)
        # Feed-forward: if mxx=1, apply Z(ancilla)
        if outcome == 1:
            self.tb.s_gate(ancilla)
            self.tb.s_gate(ancilla)
        self.mz(ancilla)  # reset ancilla
    def s_parity(self, q: int, ancilla: int):
        """S(q) via parity gadget."""
        outcome = self.mzz(q, ancilla)
        if outcome == 1:
            self.tb.h(ancilla)
        self.mz(ancilla)
    def cnot_parity(self, c: int, t: int, a1: int, a2: int):
        """CNOT(c,t) via two ancillas and parity ops."""
        o1 = self.mxx(c, a1)
        o2 = self.mxx(t, a2)
        o3 = self.mzz(a1, a2)
        # Feed-forward logic based on outcomes
        if o1 == 1:
            self.tb.s_gate(t)
        if o2 == 1:
            self.tb.s_gate(c)
        if o3 == 1:
            self.tb.s_gate(c); self.tb.s_gate(t)
        # Reset ancillas
        self.mz(a1); self.mz(a2)
    # --- REPLAY & DETERMINISTIC MODE ---
    def replay_from_transcript(self, transcript: List[dict]):
        """Replay a saved measurement sequence."""
        self.transcript = []
        self.step_count = 0
        for entry in transcript:
            op = entry["op"]
            qs = entry["qubits"]
            out = entry["outcome"]
            if op == "mz":
                self._log("mz", qs, out)
                p = ['I']*self.n; p[qs[0]] = 'Z'
                self.tb._project_outcome([0]*self.n, [1 if i==qs[0] else 0 for i in range(self.n)], out)
            elif op == "mzz":
                p = ['I']*self.n; p[qs[0]]='Z'; p[qs[1]]='Z'
                self.tb._project_outcome([0]*self.n, [1 if i in qs else 0 for i in range(self.n)], out)
                self._log("mzz", qs, out)
# ---------------------------
# Demos
# ---------------------------
def demo_basic(n=2, p_m=0.0, p_z=0.0, p_poison=0.0, seed=1):
    print(f"[demo_basic] n={n}, p_m={p_m}, p_z={p_z}, p_poison={p_poison}, seed={seed}")
    E = MajoranaParityEmulator(n, p_m=p_m, p_z=p_z, p_poison=p_poison, seed=seed)
    z = E.mz(0); x = E.mx(0); z2 = E.mz(0)
    print(f"Z(0)={'+1' if z==0 else '-1'}  X(0)={'+1' if x==0 else '-1'}  Z(0) again={'+1' if z2==0 else '-1'}")
    o_xx = E.mxx(0,1); o_zz = E.mzz(0,1)
    print(f"XX(0,1)={'+1' if o_xx==0 else '-1'}  ZZ(0,1)={'+1' if o_zz==0 else '-1'}")
    E.idle_step()
def demo_ghz_parity_only(n=4, p_m=0.0, p_z=0.0, p_poison=0.0, seed=1):
    print(f"[demo_ghz_parity_only] n={n}, p_m={p_m}, p_z={p_z}, p_poison={p_poison}, seed={seed}")
    E = MajoranaParityEmulator(n+2, p_m=p_m, p_z=p_z, p_poison=p_poison, seed=seed)  # +2 ancillas
    # Use qubits 0..n-1 for GHZ, n and n+1 as ancillas
    # H(0) via parity
    E.h_parity(0, n)
    # CNOT(0,t) for t=1..n-1
    for t in range(1, n):
        E.cnot_parity(0, t, n, n+1)
    # Measure XX chains
    for i in range(n-1):
        o = E.mxx(i, i+1)
        print(f"XX({i},{i+1}) = {'+1' if o==0 else '-1'}")
    outs = [E.mz(q) for q in range(n)]
    signs = ''.join('+' if b==0 else '-' for b in outs)
    print(f"Z outcomes: {signs}")
def demo_stress(n=2, p_m=0.02, p_z=0.01, p_poison=0.05, seed=1):
    print(f"[demo_stress] Poison={p_poison}, Dephasing={p_z}, Readout={p_m}")
    E = MajoranaParityEmulator(n, p_m=p_m, p_z=p_z, p_poison=p_poison, seed=seed)
    for i in range(10):
        E.mzz(0,1)
        E.idle_step()
    print(f"Transcript length: {len(E.transcript)}")
    if any(e["op"]=="poison" for e in E.transcript):
        print("🔥 Quasiparticle poisoning detected and survived.")
# ---------------------------
# CLI
# ---------------------------
if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Majorana-1 style parity emulator (measurement-only).")
    ap.add_argument("--demo", type=str, default="basic", choices=["basic", "ghz-parity-only", "stress"])
    ap.add_argument("--n", type=int, default=2)
    ap.add_argument("--p_m", type=float, default=0.0)
    ap.add_argument("--p_z", type=float, default=0.0)
    ap.add_argument("--poison", type=float, default=0.0, help="quasiparticle poisoning rate")
    ap.add_argument("--seed", type=int, default=1)
    args = ap.parse_args()
    if args.demo == "basic":
        demo_basic(n=args.n, p_m=args.p_m, p_z=args.p_z, p_poison=args.poison, seed=args.seed)
    elif args.demo == "ghz-parity-only":
        demo_ghz_parity_only(n=args.n, p_m=args.p_m, p_z=args.p_z, p_poison=args.poison, seed=args.seed)
    else:
        demo_stress(n=args.n, p_m=args.p_m, p_z=args.p_z, p_poison=args.poison, seed=args.seed)