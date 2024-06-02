

API_SERVER_URL = "http://localhost:54225/chat" 

const cfPairs=[
    {character:"Furina",file:"../../webpage/photos/furina.png"},
    {character:"Iron Man", file:"../../webpage/photos/iron.png"},
    {character:"Jack Sparrow", file:"../../webpage/photos/jack.png"},
    {character:"Tighnari", file:"../../webpage/photos/tighnari.png"},
]

var curfriend=cfPairs[0]

var inputValue="dede";

async function fetchResponse(prompt, character = 'None', history=[]){
    url = API_SERVER_URL
    const data={
        "prompt":prompt,
        "character":character,
        "history":history
        }

    const response = await fetch('http://localhost:54225/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
    });

    const result = await response.json();
            const botMessage = result.generated_text.replace(/"/g, '');
            return botMessage;
}

function getHistory(){
    alert("getHistory");
    const chatBox = document.getElementById('rightchatBox');
        const messages = chatBox.getElementsByClassName('message');
        const history = [];
        alert("messages");
        for (let i = 0; i < messages.length; i++) {
            const msgClass = messages[i].classList.contains('my_message') ? 'user' : 'agent';
            const msgContent = messages[i].getElementByClassName('p');
            history.push({"role":msgClass, "content":msgContent.textContent});
        }
        alert("history");
        alert(history);
        return history;
}

/*
async function fetchresponse(prompt, character = 'None'){
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `http://localhost:54226/answer?prompt=${encodedPrompt}&character=${character}`;

    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data.message;
    }catch(error){
        console.error('Error:', error);
        return null;
    }
}
*/


async function getResponse(prompt){
    alert("getResponse");
    if(prompt.length==0){
     return;}
    var history = getHistory();
    response = await fetchResponse(prompt, curfriend.character.toLowerCase(), history);
    return response;
}

async function getInput() {
    var inputbar=document.getElementById("textArea");
    inputValue = inputbar.value;
    inputbar.value="";

    sendMessage();

    var response=await getResponse(inputValue);

    friMessage(response);
}

function sendMessage(){
    myMessage(inputValue);
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
}




for(let i=0;i<cfPairs.length;i++){
    
    document.getElementById(cfPairs[i].character).onclick=function(){
        curfriend=cfPairs[i];
        this.classList.add("active");

        var chatbox=document.getElementById("rightchatBox");
        while (chatbox.firstChild) {
            chatbox.removeChild(chatbox.firstChild);
        }

        for(let j=0;j<cfPairs.length;j++){
            if(j!=i){
                document.getElementById(cfPairs[j].character).classList.remove("active");
            }
        }

        var curimg=document.getElementById("curimg");
        curimg.setAttribute("src",cfPairs[i].file);

        var curname=document.getElementById("curname");
        curname.innerHTML=cfPairs[i].character;
    }
}
