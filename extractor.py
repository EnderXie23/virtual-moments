from bs4 import BeautifulSoup
import requests

url = "https://wiki.biligame.com/ys/%E8%8A%99%E5%AE%81%E5%A8%9C%E8%AF%AD%E9%9F%B3"
response = requests.get(url)
print("Status code: ", response.status_code)
soup = BeautifulSoup(response.text, "html.parser")

# Extract the content of the page
displays = soup.find_all("div", style = "display: table-cell;width:180px;vertical-align: middle;background:#8F98A6;padding:5px 10px;color:#fff;font-weight:bold")
voice_texts = soup.find_all("div", lang = 'en')

print(len(displays), "displays found.")
print(len(voice_texts), "voice texts found.")

with open("data/furina.txt", "w", encoding="utf-8") as file:
    for i in range(len(displays)):
        file.write(displays[i].text.strip() + "，你会说什么？\n" + voice_texts[2 * i].text.strip() + "\n")

print("Data extracted and saved.\n")