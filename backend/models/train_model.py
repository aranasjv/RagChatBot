import pandas as pd
from datasets import Dataset
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM, 
    TrainingArguments, 
    Trainer,
    DataCollatorForSeq2Seq
)
import torch
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training


def load_and_preprocess_data(excel_path):
    """Load all sheets and all columns, combine each row as a conversation"""
    xl = pd.ExcelFile(excel_path)
    conversations = []

    for sheet_name in xl.sheet_names:
        df = xl.parse(sheet_name)
        
        for _, row in df.iterrows():
            row_data = [str(cell) for cell in row if pd.notna(cell)]
            if not row_data:
                continue
            conversation = " ### ".join(row_data)
            conversation = f"### Human: {conversation}\n### Assistant: [Answer]"
            conversations.append(conversation)

    print(f"Loaded {len(conversations)} conversations from {len(xl.sheet_names)} sheets.")
    return conversations

def create_dataset(conversations, tokenizer, max_length=512):
    """Create tokenized training dataset"""
    def tokenize_function(examples):
        tokenized = tokenizer(
            examples['text'],
            truncation=True,
            padding='max_length',
            max_length=max_length,
            return_tensors='pt'
        )
        tokenized['labels'] = tokenized['input_ids'].clone()
        return tokenized
    
    dataset = Dataset.from_dict({'text': conversations})
    tokenized_dataset = dataset.map(tokenize_function, batched=True)
    return tokenized_dataset

def train_model(excel_path, base_model_name="mistralai/Mistral-3B-v0.1", output_dir="./trained_model"):
    """Train the model on Excel data"""
    
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(base_model_name, use_auth_token=token)
    tokenizer.pad_token = tokenizer.eos_token
    
    model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        torch_dtype=torch.float16,
        device_map="auto",
        use_auth_token=token,
        load_in_4bit=True  # Use 4-bit quantization to save memory
    )
    
    # Prepare model for LoRA/bit training
    model = prepare_model_for_kbit_training(model)
    
    # Configure LoRA
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM"
    )
    
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()
    
    # Load and preprocess data
    conversations = load_and_preprocess_data(excel_path)
    train_dataset = create_dataset(conversations, tokenizer)
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=3,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=100,
        learning_rate=2e-4,
        fp16=True,
        logging_steps=10,
        save_steps=500,
        eval_steps=500,
        save_total_limit=2,
        prediction_loss_only=True,
        report_to=None
    )
    
    data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, padding=True)
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        data_collator=data_collator
    )
    
    trainer.train()
    trainer.save_model(output_dir)
    tokenizer.save_pretrained(output_dir)
    
    print(f"Model trained and saved to {output_dir}")
    return output_dir

if __name__ == "__main__":
    excel_path = r"C:\GitHub\Repo\RagChatBot\backend\docs\SBKPHServerList.xlsx"
    train_model(excel_path)
