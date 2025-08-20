from llama_cpp import Llama
import sys
import json

# Path to your GGUF model
model_path = "C:/Users/sbk.dev/Desktop/RagChatBotV2/Model/capybarahermes-2.5-mistral-7b.Q4_K_S.gguf"

# Initialize LLaMA model
llm = Llama(
    model_path=model_path,
    n_ctx=4096,
    n_threads=8
)

def clean_output(text: str) -> str:
    cleaned = text.lstrip("?\n ").strip()

    for prefix in ["Bot:", "Assistant:", "AI:", "Me:", "User:"]:
        if cleaned.startswith(prefix):
            cleaned = cleaned[len(prefix):].strip()

    # If the first paragraph looks like a restated question, drop it
    lines = cleaned.split("\n")
    if lines and "I am working on a project" in lines[0]:
        cleaned = "\n".join(lines[1:]).strip()

    while "\n\n\n" in cleaned:
        cleaned = cleaned.replace("\n\n\n", "\n\n")

    return cleaned


def run_llama(prompt: str, as_json: bool = False):
    """
    Run inference on the LLaMA model with the given prompt.
    If as_json is True, return a JSON payload instead of plain text.
    """
    output = llm.create_completion(
        prompt=prompt,
        max_tokens=1024,
        stop=["User:", "Me:"],   # stop tokens to prevent role switching
        temperature=0.7
    )

    raw = output['choices'][0]['text']
    cleaned = clean_output(raw)

    if as_json:
        response = {
            "answer": cleaned,
            "raw": raw.strip()
        }
        print(json.dumps(response, ensure_ascii=False))
        return response

    print(cleaned)
    return cleaned


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python llama_runner.py \"Your prompt here\"")
        sys.exit(1)

    query = " ".join(sys.argv[1:])
    run_llama(query)
