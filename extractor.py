from bs4 import BeautifulSoup
import requests

url = "https://genshin-impact.fandom.com/wiki/Furina/Voice-Overs"
response = requests.get(url)
print("Status code: ", response.status_code)
soup = BeautifulSoup(response.text, "html.parser")

# Extract the content of the page
# displays = soup.find_all("div", style = "display: table-cell;width:180px;vertical-align: middle;background:#8F98A6;padding:5px 10px;color:#fff;font-weight:bold")
# voice_texts = soup.find_all("div", lang = 'en')
displays = soup.find_all("th", class_ = "hidden")
voice_texts = soup.find_all("span", lang = "en")

print(len(displays), "displays found.")
print(len(voice_texts), "voice texts found.")

with open("data/furina.txt", "w", encoding="utf-8") as file:
    for i in range(0, len(displays), 3):
        file.write(voice_texts[i].text.strip() + ".\n" + voice_texts[i + 2].text.strip() + "\n")

print("Data extracted and saved.\n")