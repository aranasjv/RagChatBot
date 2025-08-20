import subprocess
import os

def convert_to_gguf(hf_model_path, output_gguf_path, outtype="f16"):
    """
    Convert a Hugging Face model to GGUF format using llama.cpp's convert_hf_to_gguf.py script.

    Args:
        hf_model_path (str): Path to the trained Hugging Face model directory.
        output_gguf_path (str): Path where the GGUF model will be saved.
        outtype (str): Data type for weights. Options: "f16", "f32". Default: "f16".
    Returns:
        bool: True if conversion succeeded, False otherwise.
    """
    # Update this path to where you cloned llama.cpp
    convert_script = "./llama.cpp/convert_hf_to_gguf.py"

    if not os.path.exists(convert_script):
        print(f"Conversion script not found: {convert_script}")
        return False

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_gguf_path), exist_ok=True)

    cmd = [
        "python", convert_script,
        hf_model_path,
        "--outtype", outtype,
        "--outfile", output_gguf_path
    ]

    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print("✅ Conversion successful!")
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Conversion failed: {e}")
        print(e.stderr)
        return False

if __name__ == "__main__":
    # Path to your trained Hugging Face model
    hf_model_path = "./trained_model"  

    # Output GGUF file
    output_gguf_path = "./custom_trained_model.gguf"

    success = convert_to_gguf(hf_model_path, output_gguf_path)
    if success:
        print(f"Model converted to GGUF: {output_gguf_path}")
