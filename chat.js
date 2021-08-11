const socket = io()
const userElement = document.getElementById("users");
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
  
let typingTimer;                //timer identifier
let doneTypingInterval = 1000;  //time in ms (2 seconds)
  
const name = prompt('What is your name?')
const room = prompt("Enter room:")
  
  
socket.emit('new-user', {name,room});
appendMessage('You joined', 1)
  
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`,0)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`,0)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`,0)
})

socket.on("current-users",(users,room)=>{
  userElement.innerHTML = "Current users in room are:\t";
  for(var key in users){
    if(users[key].room === room)
    appendUser(users[key].name);
  }
})

function appendUser(name){
  userElement.innerHTML+=name+",\t";
  userElement.style.textAlign = "center";
}

messageForm.addEventListener('submit', e => {
  //prevents page from reloading every time submit is clicked
  e.preventDefault()
  const message = messageInput.value
  if(message!=""){
    appendMessage(`You: ${message}`,1)
    socket.emit('send-chat-message', message)
    //the input field is set to blank after user send a message
    messageInput.value = ''
  }
  else{
    alert("Enter text!");
  }
})

function appendMessage(message,n) {
  const messageElement = document.createElement('div')
  //add class to add styles
  messageElement.classList.add("message-element");
  
  messageElement.innerText = message
  if(n===1){
    //aligns our sent message to our side, i.e., right
    messageElement.style.alignSelf = "flex-end"
    messageElement.style.backgroundColor = "rgb(230, 227, 227)";
  }

  messageContainer.append(messageElement)
  // below statement scrolls down the div when a new message is added
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function printTyping(){
  socket.emit("user-typing");
}
socket.on("show-typing",()=>{
  showTyping();
})
function showTyping(){
  userElement.innerHTML = "typing...";
}
messageInput.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
    
});

//user is "finished typing," do something
function doneTyping () {
    socket.emit("show-users");
}