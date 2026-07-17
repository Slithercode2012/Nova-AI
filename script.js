const messages = document.getElementById("messages");
const input = document.getElementById("input");

let chatHistory = [];

function formatMessage(text) {
    return text
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function addMessage(text, sender) {

    const div = document.createElement("div");

    div.className = "message " + sender;

    div.innerHTML = formatMessage(text);

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

    chatHistory.push({
        sender,
        text
    });

    localStorage.setItem(
        "novaHistory",
        JSON.stringify(chatHistory)
    );

}

function loadChat(){

    const data = localStorage.getItem("novaHistory");

    if(!data){

        addMessage(
            "👋 Hello! I'm NovaChat AI. Ask me anything!",
            "bot"
        );

        return;

    }

    chatHistory = JSON.parse(data);

    chatHistory.forEach(msg=>{

        const div = document.createElement("div");

        div.className = "message " + msg.sender;

        div.innerHTML = formatMessage(msg.text);

        messages.appendChild(div);

    });

}

function newChat(){

    messages.innerHTML = "";

    chatHistory = [];

    localStorage.removeItem("novaHistory");

    addMessage(
        "👋 New chat started.",
        "bot"
    );

}

async function askAI(message){

    try{

        const response = await fetch(
            "http://localhost:3000/chat",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    message
                })

            }
        );

        const data = await response.json();

        return data.reply;

    }

    catch(error){

        console.error(error);

        return "⚠ Unable to connect to the AI server.";

    }

}

function typing(){

    const div = document.createElement("div");

    div.className = "message bot typing";

    div.id = "typing";

    div.innerHTML = "NovaChat is typing...";

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

}

function removeTyping(){

    const t = document.getElementById("typing");

    if(t){

        t.remove();

    }

}

async function sendMessage(){

    const text = input.value.trim();

    if(text==="") return;

    addMessage(text,"user");

    input.value="";

    typing();

    const reply = await askAI(text);

    removeTyping();

    addMessage(reply,"bot");

}

input.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        sendMessage();

    }

});

window.onload = loadChat;
