const messages = document.getElementById("messages");
const input = document.getElementById("input");

let chatHistory = [];

const responses = [
    "That's an interesting question.",
    "Can you explain that a little more?",
    "I understand.",
    "Tell me more.",
    "That's really cool!",
    "I'm always learning new things.",
    "Thanks for asking!",
    "I can definitely help with that.",
    "Let's work through it together.",
    "Here's what I think..."
];

function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className = "message " + sender;

    message.innerHTML = formatMessage(text);

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;

    chatHistory.push({
        sender,
        text
    });

    saveChat();

}

function formatMessage(text){

    text=text
        .replace(/\n/g,"<br>")
        .replace(/\*\*(.*?)\*\*/g,"<b>$1</b>")
        .replace(/\*(.*?)\*/g,"<i>$1</i>")
        .replace(/`(.*?)`/g,"<code>$1</code>");

    return text;

}

function fakeAI(message){

    const msg = message.toLowerCase();

    if(msg.includes("hello"))
        return "👋 Hello! Nice to meet you.";

    if(msg.includes("hi"))
        return "Hi! What can I help you with today?";

    if(msg.includes("how are you"))
        return "I'm doing great! Thanks for asking.";

    if(msg.includes("your name"))
        return "I'm NovaChat AI.";

    if(msg.includes("time"))
        return "Current time: " + new Date().toLocaleTimeString();

    if(msg.includes("date"))
        return "Today is " + new Date().toDateString();

    if(msg.includes("joke"))
        return "Why do programmers love dark mode? Because light attracts bugs 😂";

    if(msg.includes("weather"))
        return "I can't check live weather yet, but once connected to an API I'll be able to.";

    if(msg.includes("github"))
        return "GitHub is an excellent place to host your code.";

    if(msg.includes("html"))
        return "HTML builds the structure of websites.";

    if(msg.includes("css"))
        return "CSS makes websites look awesome.";

    if(msg.includes("javascript"))
        return "JavaScript brings websites to life.";

    return responses[Math.floor(Math.random()*responses.length)];

}

function typingAnimation(callback){

    const typing=document.createElement("div");

    typing.className="message bot typing";

    typing.id="typing";

    typing.innerHTML="AI is typing...";

    messages.appendChild(typing);

    messages.scrollTop=messages.scrollHeight;

    setTimeout(()=>{

        typing.remove();

        callback();

    },1000);

}

function sendMessage(){

    const text=input.value.trim();

    if(text==="") return;

    addMessage(text,"user");

    input.value="";

    typingAnimation(()=>{

        const reply=fakeAI(text);

        addMessage(reply,"bot");

    });

}

input.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        sendMessage();

    }

});

function newChat(){

    messages.innerHTML="";

    chatHistory=[];

    saveChat();

    addMessage("👋 New chat started.","bot");

}

function saveChat(){

    localStorage.setItem(
        "novaChatHistory",
        JSON.stringify(chatHistory)
    );

}

function loadChat(){

    const data=localStorage.getItem("novaChatHistory");

    if(!data){

        addMessage("Hello! I'm NovaChat AI.","bot");

        return;

    }

    chatHistory=JSON.parse(data);

    chatHistory.forEach(msg=>{

        const div=document.createElement("div");

        div.className="message "+msg.sender;

        div.innerHTML=formatMessage(msg.text);

        messages.appendChild(div);

    });

    messages.scrollTop=messages.scrollHeight;

}

function clearHistory(){

    localStorage.removeItem("novaChatHistory");

    newChat();

}

function toggleTheme(){

    document.body.classList.toggle("light");

}

window.onload=loadChat;
