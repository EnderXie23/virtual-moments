import os
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
         
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from urllib.parse import unquote

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 设置允许的来源，也可以是一个列表，如 ["http://localhost", "https://example.com"]
    allow_credentials=False,  # 是否允许发送身份验证凭据（如 cookies）
    allow_methods=["POST"],  # 允许的 HTTP 方法，也可以是一个列表，如 ["GET", "POST", "PUT"]
    allow_headers=["*"],  # 允许的请求头，也可以是一个列表，如 ["X-Custom-Header"]
)

current_dir = os.path.dirname(os.path.abspath(__file__))

def chat_resp(model, tokenizer, user_prompt=None, history=[]):
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
    )   
    generation_args = {
        "max_new_tokens": 500,
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
    character = data.get('character', 'Furina').lower()
    #history = [{"role": "system", "content": f"Do a role play and play as character {character}. Learn from the following QA examples, then answer the final question in a similar tone within 50 words:"},]
    history = [{"role": "system", "content": f"Do a role play and play as character {character}. Learn from the following QA examples, then chat with the user in a similar tone and each answer shoule be within 50 words:"},]
    ##### implement change here
    file_path = os.path.join(current_dir, '../webpage/text', f'{character}.txt')
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = [line.strip() for line in file.readlines()]

    for i in range(0, len(lines), 2):
        history.append({"role": "user", "content": lines[i]})
        history.append({"role": "agent", "content": lines[i+1]})
    
    history.append({"role": "system", "content": "Now, chat with the user in a similar tone as the QA examples above and each answer should be within 50 words:"})
        
    histories = data.get('history', [])
    history+=histories
    print(history)
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