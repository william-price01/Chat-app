

const chatForm = document.getElementById('chat-form');
// get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const userList = document.getElementById('users');

const roomName = document.getElementById('room-name');


const socket = io();
const chatMessages = document.querySelector('.chat-messages');

// Join chatroom
socket.emit('joinRoom', { username, room});

// get room and users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputRoomUsers(users);
})

socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  ///scroll down
chatMessages.scrollTop = chatMessages.scrollHeight

})

//message submit

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  //get message
  const msg = e.target.elements.msg.value;

 socket.emit('chatMessage', msg);
//clear input
 e.target.elements.msg.value = '';
e.target.elements.msg.focus();
})





//outputs message to page

outputMessage = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta"> ${message.username} <span>${message.time}</span></p>
  <p class="text">
      ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// add room name to dom

outputRoomName = (room) => {
roomName.innerText = room;
}
// add users to DOM
outputRoomUsers = (users) => {
userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
`;
}