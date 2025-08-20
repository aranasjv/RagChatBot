from llama_cpp import Llama
import sys

model_path = "C:/Users/sbk.dev/Desktop/RagChatBotV2/Model/capybarahermes-2.5-mistral-7b.Q4_K_S.gguf"
llm = Llama(model_path=model_path, n_ctx=4096, n_threads=8)

def run_llama(prompt: str):
    # Use create_completion instead of calling llm() directly
    output = llm.create_completion(
        prompt=prompt,
        max_tokens=1024,    # number of tokens to generate
        stop=None,          # you can define stop sequences if needed
        temperature=0.7
    )
    print(output['choices'][0]['text'])
    return output['choices'][0]['text']

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python llama_runner.py \"Your prompt here\"")
        sys.exit(1)

    query = " ".join(sys.argv[1:])
    run_llama(query)
