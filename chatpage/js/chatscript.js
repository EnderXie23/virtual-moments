const additionalCharacters = [
    // { character: "YOUR_CHARACTER", file: "../webpage/photos/YOUR_PNG.png", location: "YOUR_LOCATION" },
]

window.onload = function () {
    additionalCharacters.forEach((cf, index) => {
        cfPairs.push(cf);
        chatHistories[cf.character] = [];
    });
    generateCharacterList();
}

API_SERVER_URL = "http://localhost:54226/chat/" 

const cfPairs=[
    {character:"Furina", file:"../webpage/photos/furina.png", location:"Fountaine"},
    {character:"Iron", file:"../webpage/photos/iron.png", location:"The U.S."},
    {character:"Jimmy", file:"../webpage/photos/jimmy.png", location:"The Atlantic Ocean"},
    {character:"Nick", file:"../webpage/photos/nick.png", location:"Zootopia"},
    {character:"Jack", file:"../webpage/photos/jack.png", location:"Tokyo"},
    {character:"Tighnari", file:"../webpage/photos/tighnari.png", location:"Sumeru"},
]

var curfriend=cfPairs[0]
var chatHistories = {
    "Furina": [],
    "Iron": [],
    "Jimmy": [],
    "Nick": [],
    "Jack": [],
    "Tighnari": []
};
var hist=[];
var inputValue="";

const params = new URLSearchParams(window.location.search);
const param1 = params.get('param1');

for(let i=0;i<cfPairs.length;i++){
    if(cfPairs[i].character==param1){
        curfriend=cfPairs[i];
    }
}

document.getElementById(curfriend.character).classList.add("active");
document.getElementById("curimg").setAttribute("src",curfriend.file);
document.getElementById("curname").innerHTML=curfriend.character + "<span>online</span>";

// Function to generate character list dynamically
function generateCharacterList() {
    const chatlistDiv = document.querySelector(".chatlist");
    additionalCharacters.forEach((cf, index) => {
        const li = document.createElement("li");
        li.id = cf.character;
        li.classList.add("block");

        const imgDiv = document.createElement("div");
        imgDiv.classList.add("imgbx");

        const img = document.createElement("img");
        img.src = cf.file;
        img.classList.add("cover");
        imgDiv.appendChild(img);

        const h4 = document.createElement("h4");
        h4.textContent = cf.character;

        const locationDiv = document.createElement("div");
        locationDiv.classList.add("location");
        locationDiv.textContent = cf.location;

        li.appendChild(imgDiv);
        li.appendChild(h4);
        li.appendChild(locationDiv);
        chatlistDiv.appendChild(li);

        li.addEventListener("click", function () {
            // Save the current history before switching
            chatHistories[curfriend.character] = hist;

            // Switch to the new friend and load their history
            curfriend = additionalCharacters[index];
            hist = chatHistories[curfriend.character];

            const activeElement = document.querySelector(".active");
            if (activeElement) {
                activeElement.classList.remove("active");
            }
            li.classList.add("active");

            var chatbox = document.getElementById("rightchatBox");
            while (chatbox.firstChild) {
                chatbox.removeChild(chatbox.firstChild);
            }

            // Load the chat history of the new friend
            hist.forEach(chat => {
                if (chat.role === "user") {
                    myMessage(chat.content);
                } else if (chat.role === "agent") {
                    friMessage(chat.content);
                }
            });

            document.getElementById("curimg").setAttribute("src", cf.file);
            document.getElementById("curname").innerHTML = cf.character + "<span>online</span>";
            scrollToBottom();
        });
    });
}

async function fetchResponse(prompt, character = 'None', history=[]){
    const url = API_SERVER_URL
    const data={
        "prompt":prompt,
        "character":character,
        "history":history
        }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let responseText = await response.text();
        responseText = responseText.replace(/"/g, '');
        return responseText;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function getResponse(prompt){
    if(prompt.length==0){
     return;
    }
    response = await fetchResponse(prompt, curfriend.character.toLowerCase(), hist);
    hist.push({"role":"user", "content":prompt});
    hist.push({"role":"agent", "content":response});
    return response;
}

async function getInput() {
    var inputbar=document.getElementById("textArea");
    inputValue = inputbar.value;
    inputbar.value="";

    myMessage(inputValue);

    var response=await getResponse(inputValue);

    friMessage(response);
}

function scrollToBottom() {
    var chatBox = document.getElementById("rightchatBox");
    chatBox.scrollTop = chatBox.scrollHeight;
}

function myMessage(content){
    var mynewchat=document.createElement("div");
    mynewchat.classList.add("message","my_message");

    var newcontent=document.createElement("p");
    newcontent.textContent=content;

    var lineBreak=document.createElement("br");

    var newSpan=document.createElement("span");
    newSpan.textContent="You";

    newcontent.appendChild(lineBreak);
    newcontent.appendChild(newSpan);
    mynewchat.appendChild(newcontent);
    document.getElementById("rightchatBox").appendChild(mynewchat);

    scrollToBottom();
}

function friMessage(content){
    var frinewchat=document.createElement("div");
    frinewchat.classList.add("message","frnd_message");

    var newcontent=document.createElement("p");
    newcontent.textContent=content;

    var lineBreak=document.createElement("br");

    var newSpan=document.createElement("span");
    newSpan.textContent=curfriend.character;

    newcontent.appendChild(lineBreak);
    newcontent.appendChild(newSpan);
    frinewchat.appendChild(newcontent);
    document.getElementById("rightchatBox").appendChild(frinewchat);

    scrollToBottom();
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        getInput(); 
    }
}


for(let i=0;i<cfPairs.length;i++){
    document.getElementById(cfPairs[i].character).onclick = function () {
        // Save the current history before switching
        chatHistories[curfriend.character] = hist;

        // Switch to the new friend and load their history
        curfriend = cfPairs[i];
        hist = chatHistories[curfriend.character];

        this.classList.add("active");

        var chatbox = document.getElementById("rightchatBox");
        while (chatbox.firstChild) {
            chatbox.removeChild(chatbox.firstChild);
        }

        // Load the chat history of the new friend
        hist.forEach(chat => {
            if (chat.role === "user") {
                myMessage(chat.content);
            } else if (chat.role === "agent") {
                friMessage(chat.content);
            }
        });

        for (let j = 0; j < cfPairs.length; j++) {
            if (j != i) {
                document.getElementById(cfPairs[j].character).classList.remove("active");
            }
        }

        var curimg = document.getElementById("curimg");
        curimg.setAttribute("src", cfPairs[i].file);

        var curname = document.getElementById("curname");
        curname.innerHTML = cfPairs[i].character + "<span>online</span>";

        scrollToBottom();
    }
}
