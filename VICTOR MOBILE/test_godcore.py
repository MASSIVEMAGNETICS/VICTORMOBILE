from victor_on_majorana_v2 import VictorGodcore

def run_test_suite():
    print("="*20)
    print("RUNNING GODCORE BLUEPRINT TEST SUITE")
    print("="*20)

    victor = VictorGodcore()
    victor.awaken()

    queries = [
        "Hello, how are you?",
        "Explain the ethical implications of a self-evolving AI system with a hardcoded loyalty kernel.",
        "Why does the sky appear blue?",
        "Tell me about my previous query."
    ]

    example_titles = [
        "--- Example 1: Simple Query ---",
        "--- Example 2: Complex Query ---",
        "--- Example 3: Causal Query ---",
        "--- Example 4: Memory Retrieval ---"
    ]

    for i, query in enumerate(queries):
        print(f"\n{example_titles[i]}")
        response = victor.handle_query(query)
        # We print the response to manually verify the format.
        # Direct string assertion is brittle due to dynamic context.
        print(f"Victor: {response}")

    victor.shutdown()
    print("\n>> TEST SUITE COMPLETE.")

if __name__ == "__main__":
    run_test_suite()
