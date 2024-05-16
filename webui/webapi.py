import os
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
         
from fastapi import FastAPI, Request
from pydantic import BaseModel
import uvicorn

from urllib.parse import unquote

app = FastAPI()

def chat_resp(model, tokenizer, user_prompt=None, history=[]):
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
    )   
    generation_args = {
        "max_new_tokens": 100,
        "return_full_text": False,
        "temperature": 0.6,
        "do_sample": True,
    }
    messages = history
    if user_prompt:
        prompt_msg = [{"role": "user", "content": user_prompt}]
        messages.extend(prompt_msg)
    output = pipe(messages, **generation_args)
    return output

@app.post("/chat/")
async def chat(data: dict):
    prompt = data.get('prompt', '')
    history = [{"role": "system", "content": f"Do a role play and play as character {character}. Learn from the following QA examples, then answer the final question in a similar tone:"},]
    character = data.get('character', 'Furina').lower()

    with open(f"/root/myvm/webpage/text/{character}.txt", 'r', encoding='utf-8') as file:
        lines = [line.strip() for line in file.readlines()]

    for i in range(0, len(lines), 2):
        history.append({"role": "user", "content": lines[i]})
        history.append({"role": "agent", "content": lines[i+1]})
    
    histories = data.get('history', [])
    for i in range(0, len(histories)):
        history.append({"role": "user", "content": histories[i][0]})
        history.append({"role": "agent", "content": histories[i][1]})

    resp = chat_resp(model, tokenizer, prompt, history)
    return resp[0]['generated_text'].replace('"', '')
    
if __name__ == '__main__':
    model_path = '/ssdshare/Phi-3-mini-128k-instruct/'
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(model_path, 
                                             device_map="cuda:0", 
                                             torch_dtype="auto", 
                                             trust_remote_code=True)
    uvicorn.run(app, host='0.0.0.0', port=54225, workers=1)