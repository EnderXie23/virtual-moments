
API_SERVER_URL = "http://localhost:54225/chat/" 

const cfPairs=[
    {character:"Furina",file:"../../webpage/photos/furina.png"},
    {character:"Iron Man", file:"../../webpage/photos/iron.png"},
    {character:"Jack Sparrow", file:"../../webpage/photos/jack.png"},
    {character:"Tighnari", file:"../../webpage/photos/tighnari.png"},
]

var curfriend=cfPairs[0]

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
     return;}
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

function handleKeyPress(event) {
    if (event.key === "Enter") {
        getInput(); 
    }
}


for(let i=0;i<cfPairs.length;i++){
    
    document.getElementById(cfPairs[i].character).onclick=function(){
        curfriend=cfPairs[i];
        this.classList.add("active");

        var chatbox=document.getElementById("rightchatBox");
        while (chatbox.firstChild) {
            chatbox.removeChild(chatbox.firstChild);
        }

        hist=[];

        for(let j=0;j<cfPairs.length;j++){
            if(j!=i){
                document.getElementById(cfPairs[j].character).classList.remove("active");
            }
        }

        var curimg=document.getElementById("curimg");
        curimg.setAttribute("src",cfPairs[i].file);

        var curname=document.getElementById("curname");
        curname.innerHTML=cfPairs[i].character + "<span>online</span>";
    }
}
