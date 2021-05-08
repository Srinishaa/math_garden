const BACKGROUND_COLOR = '#000000';
const LINE_COLOR = '#FFFFFF';
const LINE_WIDTH = 15;
var canvas, context, curX = 0,
  curY = 0,
  prevX = 0,
  prevY = 0,
  isPainting;

function draw() {
  context.beginPath();
  context.moveTo(prevX, prevY);
  context.lineTo(curX, curY);
  context.closePath();
  context.stroke();
}

function prepareCanvas() {
  // console.log('Preparing Canvas');
  canvas = document.getElementById('my-canvas');
  context = canvas.getContext('2d');
  context.fillStyle = BACKGROUND_COLOR;
  context.strokeStyle = LINE_COLOR;
  context.lineWidth = LINE_WIDTH;
  context.lineJoin = 'round';
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  document.addEventListener('mousedown', function(event) {
    // console.log('Mouse pressed');
    isPainting = true;
    curY = event.clientY - canvas.offsetTop;
    curX = event.clientX - canvas.offsetLeft;
  })

  document.addEventListener('mouseup', function(event) {
    // console.log('Mouse released');
    isPainting = false;
  })

  canvas.addEventListener('mouseleave', function(event) {
    isPainting = false;
  })

  document.addEventListener('mousemove', function(event) {
    if (isPainting) {
      prevX = curX;
      curX = event.clientX - canvas.offsetLeft;
      prevY = curY;
      curY = event.clientY - canvas.offsetTop;
      draw();
    }
  })

  canvas.addEventListener('touchstart', function(event) {
    isPainting = true;
    curX = event.touches[0].clientX - canvas.offsetLeft;
    curY = event.touches[0].clientY - canvas.offsetTop;
  })
  canvas.addEventListener('touchmove', function(event) {
    if (isPainting) {
      prevX = curX;
      curX = event.touches[0].clientX - canvas.offsetLeft;
      prevY = curY;
      curY = event.touches[0].clientY - canvas.offsetTop;
      draw();
    }
  })
  canvas.addEventListener('touchend', function() {
    isPainting = false;
  })
  canvas.addEventListener('touchcancel', function() {
    isPainting = false;
  })
}

function clearCanvas() {
  curX = 0;
  curY = 0;
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}
