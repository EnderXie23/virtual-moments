import os
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
from pydantic import BaseModel
import uvicorn
import torch

from urllib.parse import unquote

app = FastAPI()

current_dir = os.path.dirname(os.path.abspath(__file__))

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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

@app.get("/answer/")
async def answer(prompt: str, character: str):
    prompt = unquote(prompt)
    if character != 'None':
        character = character.lower()
        history = [{"role": "system", "content": f"Do a role play and play as character {character}. Learn from the following QA examples, then answer the final question in a similar tone:"},]
        file_path=os.path.join(current_dir, 'text', f'{character}.txt')
        with open(file_path, 'r', encoding='utf-8') as file:
            lines = [line.strip() for line in file.readlines()]

        for i in range(0, len(lines), 2):
            history.append({"role": "user", "content": lines[i]})
            history.append({"role": "agent", "content": lines[i+1]})
        resp = chat_resp(model, tokenizer, prompt, history)
    else:
        resp = chat_resp(model, tokenizer, prompt)
    return {"message": resp[0]['generated_text'].replace('"', '')}

@app.post("/post/")
async def chat(data: dict):
    prompt = data.get('comment', '')
    comments = data.get('history', [])
    player = data.get('sender', '').lower()
    history = [{"role": "system", "content": f"Do a role play and play as character {player}. Learn from the following QA examples, then answer the final question in a similar tone:"},]
############implement change here
    file_path=os.path.join(current_dir, 'text', f'{player}.txt')
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = [line.strip() for line in file.readlines()]

    for i in range(0, len(lines), 2):
        history.append({"role": "user", "content": lines[i]})
        history.append({"role": "agent", "content": lines[i+1]})

    for i in range(0, len(comments)):
        sender = comments[i].split(':')[0].lower()
        sender = 'user' if sender == 'ender' else 'agent'
        history.append({"role": sender, "content": comments[i].split(':')[1]})

    resp = chat_resp(model, tokenizer, prompt, history)
    return {"message": resp[0]['generated_text'].replace('"', '')}
    
if __name__ == '__main__':
    model_path = '/ssdshare/Phi-3-mini-128k-instruct/'
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(model_path, 
                                             device_map="cuda:0", 
                                             torch_dtype="auto", 
                                             trust_remote_code=True)
    uvicorn.run(app, host='0.0.0.0', port=54226, workers=1)

