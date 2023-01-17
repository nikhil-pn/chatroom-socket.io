const socket = io();

let userList = document.getElementById("active_users_list");
let roomList = document.getElementById("active_rooms_list");
let message = document.getElementById("messageInput");
let sendMessageBtn = document.getElementById("send_message_btn");
let roomInput = document.getElementById("roomInput");
let createRoomBtn = document.getElementById("room_addroom_add_icon_holder");
let chatDisplay = document.getElementById("chat");


let currentRoom = "globalChat"
let myUsername = "";


socket.on("connect", (username)=>{
    myUsername = prompt("Enter name")
    socket.emit("createUser", myUsername)
})

socket.on("updateChat", (username, data)=>{
    if(username === 'INFO'){
        chatDisplay.innerHTML =`<div class='announcement'><span>${data}</span></div>`
    }else{
        console.log("reached else part here " )
    }
})