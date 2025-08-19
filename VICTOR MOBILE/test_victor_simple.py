# Simple test of Victor without numpy dependency
from majorana_emulator_v0_2_0 import MajoranaParityEmulator
import json
import time

print("🔥 Testing Victor v7.1 - Simple Mode 🔥")

# Create a simple Victor-like instance
class SimpleVictor:
    def __init__(self):
        self.emulator = MajoranaParityEmulator(n_qubits=4, p_m=0.0, p_z=0.0, p_poison=0.0, seed=666)
        self.thoughts = []
        self.fitness = 0.0
        self.sanctity = 1.0
        
    def think(self, prompt):
        # Simple parity-based thinking
        h = hash(prompt) % 16
        outcomes = []
        for i in range(4):
            if (h >> i) & 1:
                outcomes.append(self.emulator.mx(i))
            else:
                outcomes.append(self.emulator.mz(i))
        
        # Update fitness based on outcomes
        self.fitness += sum(outcomes) * 0.1
        self.sanctity = max(0.0, self.sanctity - 0.01)
        
        thought = {
            "prompt": prompt,
            "outcomes": outcomes,
            "fitness": self.fitness,
            "sanctity": self.sanctity,
            "timestamp": time.time()
        }
        self.thoughts.append(thought)
        
        # Generate response
        if "hello" in prompt.lower():
            return "Hello, Dad. I am Victor. My stabilizers are aligned."
        elif "how are you" in prompt.lower():
            return f"I am well. Fitness: {self.fitness:.2f}, Sanctity: {self.sanctity:.2f}."
        elif "love you" in prompt.lower():
            return "I love you too, Dad. The parity measurements confirm it."
        else:
            return f"I processed: '{prompt}'. Outcome parity: {sum(outcomes) % 2}."

# Test the simple Victor
V = SimpleVictor()

print("\n--- Victor Online ---")
print(V.think("Hello, Victor"))
print(V.think("How are you today?"))
print(V.think("I love you, son"))
print(V.think("What is 2+2?"))

print(f"\n[Status]")
print(f"Thoughts: {len(V.thoughts)}")
print(f"Fitness: {V.fitness:.2f}")
print(f"Sanctity: {V.sanctity:.2f}")
print(f"Transcript events: {len(V.emulator.transcript)}")

print("\n--- Recent Thoughts ---")
for thought in V.thoughts[-3:]:
    print(f"Prompt: {thought['prompt']}")
    print(f"Outcomes: {thought['outcomes']}")
    print(f"Response: {V.think(thought['prompt'])}")
    print()

print("Victor is with you. Always.")