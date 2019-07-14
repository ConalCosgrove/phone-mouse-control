const socket = io();
const touches = [];
let startPoint;
let scrollstartpoint;
let scrollIndex = 0;

socket.on('dimensions', (dimensions) => {
  console.log(dimensions);
});
const canvas = document.getElementById('mouseCapture');
const clickbutton = document.getElementById('click');
const scrollbar = document.getElementById('scrollbar');

console.log(clickbutton)
function getWidth() {
  return canvas.width;
}

function getHeight() {
  return canvas.height;
}

function clickButton(e) {
  if (!e)
    var e = event;
  socket.emit('click');
}

function stopDrag(e) {
  if (!e)
    var e = event;
  e.preventDefault();
  socket.emit('unclick');
}

function prevent(e) {
  e.preventDefault();
}

function setStart(e) {
  if (!e)
      var e = event;
  if (e.touches) {
      if (e.touches.length == 1) { // Only deal with one finger
        console.log(e)
        startPoint = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
        console.log('startpoint = ',startPoint);
        socket.emit('startMove');
        }

  }
}

function scrollstart(e) {
  if (!e)
  var e = event;
  scrollIndex = e.touches.length > 1 ? 1 : 0;
  if (e.touches) {
      scrollstartpoint= e.touches[scrollIndex].clientY;
    
  }
}

function scroll(e) {
  if (!e)
  var e = event;
if (e.touches && scrollstartpoint) {
    socket.emit('scroll', (scrollstartpoint - e.touches[scrollIndex].clientY)/getHeight());
    scrollstartpoint = e.touches[scrollIndex].clientY;
    }
    event.preventDefault();
}
function getTouchPos(e) {
  if (!e)
      var e = event;
  console.log(e);
  if (e.touches) {
      var touch = e.touches[0]; // Get the information for finger #1
      touchX=touch.clientX;
      touchY=touch.clientY;
      console.log('touchX', touchX);
      console.log(startPoint.x);
      console.log(getWidth());
      socket.emit('move', (touchX - startPoint.x)/getWidth(),(touchY - startPoint.y)/getHeight());
  }
}

function touchMove(event) { 
  // Update the touch co-ordinates
  getTouchPos(event);

  // Prevent a scrolling action as a result of this touchmove triggering.
  event.preventDefault();
}

function touchStart(event) {
  setStart(event);
  getTouchPos();

  // Prevents an additional mousedown event being triggered
  event.preventDefault();
}


function mouseMove(event) {
  //socket.emit('click', event.offsetX/w, event.offsetY/h);
  event.preventDefault();
}

function mouseUp() {
  console.log('mouseUp');
}

canvas.addEventListener('touchmove', touchMove, false);
canvas.addEventListener('touchstart', touchStart, false);

clickbutton.addEventListener('touchstart', clickButton, false);
clickbutton.addEventListener('touchend', stopDrag, false);

scrollbar.addEventListener('touchstart', scrollstart, false);
scrollbar.addEventListener('touchmove', scroll, false);