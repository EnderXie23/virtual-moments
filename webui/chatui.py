import gradio as gr
import requests
import json

API_SERVER_URL = "http://localhost:54225/chat" # Don't forget to start your local API server

def predict(message, history):
    url = API_SERVER_URL
    data = {"prompt": message,
            "history": history,
            }
    encoded = json.dumps(data).encode("utf-8")
    response = requests.post(url, data=encoded)  # the parameters should be encoded as JSON
    return response.text.replace('"', '')

gr.ChatInterface(predict).launch()