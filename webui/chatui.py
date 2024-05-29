import gradio as gr
import requests
import json
import threading

API_SERVER_URL = "http://localhost:54225/chat" # Don't forget to start your local API server

def predict(message, history, character):
    url = API_SERVER_URL
    data = {"prompt": message,
            "history": history,
            "character": character
            }
    encoded = json.dumps(data).encode("utf-8")
    response = requests.post(url, data=encoded)  # the parameters should be encoded as JSON
    response_text = response.text.replace('"', '')
    return response_text

def predict_furina(message, history):
    return predict(message, history, "Furina")

def predict_tighnari(message, history):
    return predict(message, history, "Tighnari")

def predict_iron(message, history):
    return predict(message, history, "Iron")

def predict_jack(message, history):
    return predict(message, history, "Jack")

def launch_interface(interface, port):
    interface.launch(server_port=port)

# Create Gradio interfaces for each person
interface_furina = gr.ChatInterface(predict_furina)
interface_tighnari = gr.ChatInterface(predict_tighnari)
# interface_iron = gr.ChatInterface(predict_iron)
# interface_jack = gr.ChatInterface(predict_jack)

# Launch each interface in a separate thread
thread_furina = threading.Thread(target=launch_interface, args=(interface_furina, 7861))
thread_tighnari = threading.Thread(target=launch_interface, args=(interface_tighnari, 7862))
# thread_iron = threading.Thread(target=launch_interface, args=(interface_iron, 7863))
# thread_jack = threading.Thread(target=launch_interface, args=(interface_jack, 7864))

thread_furina.start()
thread_tighnari.start()
# thread_iron.start()
# thread_jack.start()

thread_furina.join()
thread_tighnari.join()
# thread_iron.join()
# thread_jack.join()
