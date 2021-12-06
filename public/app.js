window.addEventListener('load', function () {

  //Open and connect socket
  let socket = io();
  //Listen for confirmation of connection
  socket.on('connect', function () {
      console.log("Connected");
  });

  /* --- Code to RECEIVE a socket message from the server --- */
  let chatBox = document.getElementById('chat-box-msgs');

  //Listen for messages named 'msg' from the server
  socket.on('msg', function (data) {
      console.log("Message arrived!");
      console.log(data);

      //Create a message string and page element
      let receivedMsg = data.name + ": " + data.msg;
      let msgEl = document.createElement('p');
      msgEl.innerHTML = receivedMsg;

      //Add the element with the message to the page
      chatBox.appendChild(msgEl);
      //Add a bit of auto scroll for the chat box
      chatBox.scrollTop = chatBox.scrollHeight;
  });

  /* --- Code to SEND a socket message to the Server --- */
  let nameInput = document.getElementById('name-input')
  let msgInput = document.getElementById('msg-input');
  let sendButton = document.getElementById('send-button');

  sendButton.addEventListener('click', function () {
      let curName = nameInput.value;
      let curMsg = msgInput.value;
      let msgObj = { "name": curName, "msg": curMsg };

      //Send the message object to the server
      socket.emit('msg', msgObj);
  });
});


let input;
let img;

function setup() {
input = createFileInput(handleFile);
console.log(input.elt);
input.elt.id="upload-button";
document.getElementById('file-upload-container').appendChild(input.elt);
// input.elt.pare
noCanvas();
}

function showImage() {
fetch('/image')
.then(response => response.json())
.then(data => {
  background(255);
  console.log(data.data);
  img = createImg(data.data);
  img.hide();
  image(img, 50, 50, width, height);
})
}


function handleFile(file) {
print(file.data); // this is the "string version" of the image
let imageData = {
  data: file.data
};
let imageJSON = JSON.stringify(imageData);
if (file.type === "image") {
  fetch("/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: imageJSON
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    });
} else {
  img = null;
}
}
