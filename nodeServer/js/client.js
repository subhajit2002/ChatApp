const socket = io(); // Make sure to replace 'localhost:8000' with the correct URL of your Socket.io server

const form = document.getElementById("send-container");
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('../ting_iphone.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault()//it will not reload the page.
    const message = messageInput.value;
    append(`You: ${message}`,'right');
    socket.emit('send',message);
    messageInput.value="";
})

const names = prompt("Enter your name to join");
socket.emit('new-user-joined', names);
//append(`${names} joined the chat`, 'left');


socket.on('user-joined', names => {
    append(`${names} joined the chat`, 'right');
});

socket.on('receive',data=>{
    append(`${data.name}: ${data.message}`,'left')
})

socket.on('left',name=>{
    append(`${name} left the chat`,'right');
})