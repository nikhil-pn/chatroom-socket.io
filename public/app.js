const socket = io();

let userList = document.getElementById("active_users_list");
let roomList = document.getElementById("active_rooms_list");
let message = document.getElementById("messageInput");
let sendMessageBtn = document.getElementById("send_message_btn");
let roomInput = document.getElementById("roomInput");
let createRoomBtn = document.getElementById("room_addroom_add_icon_holder");
let chatDisplay = document.getElementById("chat");

let currentRoom = "globalChat";
let myUsername = "";

socket.on("connect", (username) => {
  myUsername = prompt("Enter name");
  socket.emit("createUser", myUsername);
});

socket.on("updateChat", (username, data) => {
  if (username === "INFO") {
    chatDisplay.innerHTML += `<div class='announcement'><span>${data}</span></div>`;
    //   } else {
    //     chatDisplay.innerHTML += `<div > <h2>${data} </h2> </div>`;
    //   }
  } else {
    //styled chat version
    chatDisplay.innerHTML += `<div class="message_holder ${
      username === myUsername ? "me" : ""
    }">
                                          <div class="pic"></div>
                                          <div class="message_box">
                                            <div id="message" class="message">
                                              <span class="message_name">${username}</span>
                                              <span class="message_text">${data}</span>
                                            </div>
                                          </div>
                                        </div>`;
  }
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

sendMessageBtn.addEventListener("click", () => {
  socket.emit("message", message.value);
  message.value = "";
});

socket.on("updateUsers", (usernames) => {
  userList.innerHTML = "";
  console.log("username returned from server", usernames);
  for (let user in usernames) {
    userList.innerHTML += `<div class="user_card">
        <div class="pic"></div>
        <span>${user}</span>
      </div>`;
  }
});

socket.on("updateRooms", (rooms, newRoom) => {
  roomList.innerHTML = "";

  for (var index in rooms) {
    roomList.innerHTML += `<div class="room_card" id="${rooms[index].name}"
                                    onclick="changeRoom('${rooms[index].name}')">
                                    <div class="room_item_content">
                                        <div class="pic"></div>
                                        <div class="roomInfo">
                                        <span class="room_name">#${rooms[index].name}</span>
                                        <span class="room_author">${rooms[index].creator}</span>
                                        </div>
                                    </div>
                                </div>`;
  }

  document.getElementById(currentRoom).classList.add("active_item");
});

function changeRoom(room) {
  if (room !== currentRoom) {
    socket.emit("updateRooms", room);
    document.getElementById(currentRoom).classList.remove("active_item");
    currentRoom = room;
    document.getElementById(currentRoom).classList.add("active_item");
  }
}
