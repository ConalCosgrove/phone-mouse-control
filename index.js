const express = require('express');
const robot = require('robotjs');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { getIpAddress } = require('./getIp');
const port = 8080;
const ip = getIpAddress();
const screenSize = robot.getScreenSize();
const { width, height } = screenSize;
const scrollCoefficient = 200;
let startX, startY;
let pos = robot.getMousePos();
let last = {x: 0, y: 0};
let clicked = false;
const debouncing = 5;

io.on('connection', (socket) => {
  socket.emit('dimensions',robot.getScreenSize());
  socket.on('startMove', () => {
    console.log('startMove')
    startX = robot.getMousePos().x;
    startY = robot.getMousePos().y
  });
  socket.on('move', (x,y) => {
    pos.x = startX + (x * width);
    pos.y = startY + (y * height);
  });
  socket.on('click', () => {
    clicked = true;
    robot.mouseToggle('down','left');
  });

  socket.on('unclick', () => {
    clicked = false;
    robot.mouseToggle('up', 'left');
  });

  socket.on('scroll', (distance) => {
    robot.scrollMouse(0, distance * scrollCoefficient);
  });
});

setInterval(() => {
  if (Math.abs(pos.x - last.x) > debouncing || Math.abs(pos.y - last.y) > debouncing){
    if (clicked) {
      robot.dragMouse(pos.x, pos.y);
    }else {
      robot.moveMouse(pos.x,pos.y);
    }
    
    last.x = pos.x;
    last.y = pos.y;
  }
  
}, 25);

app.use(express.static('static'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

http.listen(8080, '0.0.0.0', () => {
  console.log(`Listening on ${ip}:${port}`);
});