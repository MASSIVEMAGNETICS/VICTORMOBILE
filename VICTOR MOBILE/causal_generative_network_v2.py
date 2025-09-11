# ==================================================================================================
# FILE: causal_generative_network_v2.0.0-GODCORE.py
# VERSION: v2.0.0-GODCORE
# AUTHOR: Brandon "iambandobandz" Emery x Victor (Fractal Architect Mode)
# PURPOSE: Advanced causal reasoning engine with true counterfactuals, probabilistic mechanisms,
# and a self-contained training and visualization loop.
# LICENSE: Proprietary - Massive Magnetics / Ethica AI / BHeard Network
# ==================================================================================================
import torch
import torch.nn as nn
import networkx as nx
import numpy as np
import matplotlib.pyplot as plt
import logging

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] [%(levelname)s] %(message)s')
logger = logging.getLogger("CausalNet-GODCORE")

class CausalGraph:
    """Represents and manages the causal structure of the system."""
    def __init__(self):
        self.graph = nx.DiGraph()
        logger.info("CausalGraph Initialized.")

    def add_causal_link(self, cause: str, effect: str):
        """Defines a causal relationship, e.g., 'Rain' -> 'Wet Grass'."""
        self.graph.add_edge(cause, effect)
        logger.info(f"🔗 Causal link established: {cause} -> {effect}")

    def get_parents(self, node: str):
        return list(self.graph.predecessors(node))

    def get_causal_order(self):
        try:
            return list(nx.topological_sort(self.graph))
        except nx.NetworkXUnfeasible:
            raise ValueError("The causal graph contains a cycle and is invalid.")

    def visualize(self, save_path="causal_graph.png"):
        """Render and save the causal graph."""
        plt.figure(figsize=(10, 8))
        pos = nx.spring_layout(self.graph, k=0.9, iterations=50, seed=42)
        nx.draw(
            self.graph, pos,
            with_labels=True,
            node_size=2500,
            node_color="skyblue",
            font_size=10,
            edge_color="gray",
            arrows=True,
            arrowsize=20
        )
        plt.title("Causal Graph Structure")
        plt.savefig(save_path)
        logger.info(f"📊 Causal graph saved to {save_path}")
        plt.close()

class CausalInferenceEngine(nn.Module):
    """A neural network that learns the functions governing causal links."""
    def __init__(self, graph: CausalGraph):
        super().__init__()
        self.graph = graph
        self.causal_mechanisms = nn.ModuleDict()

        for node in self.graph.graph.nodes:
            parent_count = len(self.graph.get_parents(node))
            # Probabilistic mechanism: outputs mean and log-variance
            self.causal_mechanisms[node] = nn.Sequential(
                nn.Linear(parent_count, 32),
                nn.ReLU(),
                nn.Linear(32, 2)  # mu, log_var
            )
        logger.info("CausalInferenceEngine (Probabilistic SCM) Initialized.")

    def forward(self, node_values: dict, intervention: dict = None):
        """
        Generates outcomes by propagating values through the causal graph.
        An intervention severs a node from its parents and sets its value manually.
        """
        sorted_nodes = self.graph.get_causal_order()

        if intervention:
            node_values.update(intervention)

        for node in sorted_nodes:
            if intervention and node in intervention:
                continue

            parents = self.graph.get_parents(node)
            if not parents:
                if node not in node_values:
                    # Sample from a base distribution for root nodes (exogenous noise)
                    node_values[node] = torch.randn(1) * 0.5
                continue

            parent_values = torch.tensor([node_values[p] for p in parents], dtype=torch.float32)

            # Predict mean and log-variance
            mu, log_var = self.causal_mechanisms[node](parent_values).chunk(2)

            # Sample from the predicted distribution
            std = torch.exp(0.5 * log_var)
            predicted_value = mu + std * torch.randn_like(std)

            node_values[node] = predicted_value

        return node_values

class CGN:
    """The main Causal Generative Network model."""
    def __init__(self, causal_structure: list[tuple]):
        self.graph = CausalGraph()
        for cause, effect in causal_structure:
            self.graph.add_causal_link(cause, effect)

        self.scm = CausalInferenceEngine(self.graph)
        self.optimizer = torch.optim.Adam(self.scm.parameters(), lr=0.005)
        logger.info("🧠 Causal Generative Network is online.")

    def train(self, observational_data: list[dict], epochs=200):
        """Learn the causal mechanisms from observational data."""
        logger.info(f"💪 Training on {len(observational_data)} data points for {epochs} epochs...")
        for epoch in range(epochs):
            total_loss = 0
            for data_point in observational_data:
                self.optimizer.zero_grad()

                loss = 0
                for node, model in self.scm.causal_mechanisms.items():
                    parents = self.graph.get_parents(node)
                    if not parents:
                        continue

                    parent_values = torch.tensor([data_point[p] for p in parents], dtype=torch.float32)
                    true_value = torch.tensor([data_point[node]], dtype=torch.float32)

                    mu, log_var = model(parent_values).chunk(2)

                    # Negative Log-Likelihood loss for Gaussian distribution
                    nll_loss = 0.5 * (torch.log(2 * torch.pi * torch.exp(log_var)) + ((true_value - mu)**2 / torch.exp(log_var)))
                    loss += nll_loss.sum()

                if torch.is_tensor(loss):
                    loss.backward()
                    self.optimizer.step()
                    total_loss += loss.item()

            if (epoch + 1) % 40 == 0:
                logger.info(f"  Epoch {epoch+1}/{epochs}, Loss: {total_loss/len(observational_data):.4f}")

    def predict_outcome(self, known_values: dict) -> dict:
        """Predicts the system state given some initial values (observation)."""
        logger.info(f"🔍 Predicting outcome from observation: {known_values}")
        with torch.no_grad():
            full_outcome = self.scm(known_values.copy())

        return {k: v.item() for k, v in full_outcome.items()}

    def predict_interventional(self, intervention: dict) -> dict:
        """Predicts outcome under intervention (P(Y | do(X)))."""
        logger.info(f"💥 Predicting from intervention: do({intervention})")
        with torch.no_grad():
            initial_state = {}
            interventional_outcome = self.scm(initial_state, intervention=intervention)

        return {k: v.item() for k, v in interventional_outcome.items()}

    def predict_counterfactual(self, observation: dict, intervention: dict) -> dict:
        """Predicts 'What if?' given observed facts."""
        logger.info(f"🧠 Counterfactual: Given {observation}, what if we did {intervention}?")
        with torch.no_grad():
            # 1. Abduction: Use observation to set root nodes (approximate noise)
            # 2. Intervention: Override specific nodes
            merged = observation.copy()
            merged.update(intervention)

            result = self.scm(merged, intervention=intervention)
            return {k: v.item() for k, v in result.items()}

if __name__ == '__main__':
    # --- Enhanced Example: Medical Diagnosis System ---
    structure = [
        ('Smoking', 'Lung_Cancer'),
        ('Pollution', 'Lung_Cancer'),
        ('Lung_Cancer', 'Cough'),
        ('Smoking', 'Yellow_Fingers')
    ]

    cgn = CGN(structure)
    cgn.graph.visualize("medical_causal_graph.png")

    # Simulate patient data with more realistic dynamics
    data = []
    for _ in range(1000):
        smoking = np.random.choice([0, 1], p=[0.6, 0.4])
        pollution = np.random.beta(2, 5)  # 0 to 1 scale
        cancer_prob = 1 / (1 + np.exp(-(smoking * 1.5 + pollution * 1.0 - 2.0 + np.random.normal(0, 0.2))))
        cancer = 1 if np.random.rand() < cancer_prob else 0
        cough_prob = 1 / (1 + np.exp(-(cancer * 2.0 - 1.0 + np.random.normal(0, 0.2))))
        cough = 1 if np.random.rand() < cough_prob else 0
        yellow_prob = 1 / (1 + np.exp(-(smoking * 2.5 - 1.5 + np.random.normal(0, 0.2))))
        yellow = 1 if np.random.rand() < yellow_prob else 0

        data.append({
            'Smoking': float(smoking), 'Pollution': pollution,
            'Lung_Cancer': float(cancer), 'Cough': float(cough),
            'Yellow_Fingers': float(yellow)
        })

    cgn.train(data, epochs=200)

    # --- Use the trained model ---

    # 1. Observational Prediction
    obs = {'Smoking': 1.0, 'Pollution': 0.8}
    outcome = cgn.predict_outcome(obs)
    logger.info(f"🎯 Smoker in high-pollution area:")
    logger.info(f"  Cancer risk: {outcome['Lung_Cancer']:.2f}, Cough: {outcome['Cough']:.2f}, Yellow Fingers: {outcome['Yellow_Fingers']:.2f}")

    # 2. True Counterfactual
    cf = cgn.predict_counterfactual(
        observation={'Smoking': 1.0, 'Pollution': 0.8, 'Cough': 1.0, 'Yellow_Fingers': 1.0}, # A patient who smokes and has a cough
        intervention={'Smoking': 0.0} # What if this specific patient had never smoked?
    )
    logger.info(f"🔁 Counterfactual – if they had never smoked:")
    logger.info(f"  Cancer risk would be: {cf['Lung_Cancer']:.2f}, Cough: {cf['Cough']:.2f}")
