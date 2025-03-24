const canvasWidth = 1575; // Scale 1:2.67
const canvasHeight = 1200;
const wallWidth = 37.45;
const verticalLineGap = 281;
const horizontalLineGap = 250;
const highLookoutWidth = 150;
const startWidth = 225;
var bot;

function setup() {
  window.canvas = createCanvas(canvasWidth, canvasHeight);
  window.canvas.parent("canvas");

  angleMode(DEGREES);

  bot = new Robot(wallWidth, horizontalLineGap);
}

function draw() {
  drawArena();
  bot.update();
  bot.show();
}

function keyPressed() {
  if (keyCode === 65) { // a 
    bot.dir(-1, 0);
  }
  else if (keyCode === 68) { // d
    bot.dir(1, 0);
  }
  else if (keyCode === 87) { // w
    bot.dir(0, -1);
  }
  else if (keyCode === 83) { // s
    bot.dir(0, 1);
  }
}

function drawArena() {
  background('#1b263b');

  stroke('#e0e1dd');
  strokeWeight(5);
  fill('#415A77')
  // Vertical lines
  for (var i = 0; i < 7; i++) {
    line(wallWidth + (i * horizontalLineGap), 0, wallWidth + (i * horizontalLineGap), canvasHeight);
    // Lookout rectangle
    if (i !== 0 && i !== 6) rect(wallWidth + (i * horizontalLineGap) - highLookoutWidth / 2, height - wallWidth, highLookoutWidth, wallWidth)
  }
  // Horizontal lines
  for (var i = 0; i < 5; i++) {
    line(0, wallWidth + (i * verticalLineGap), canvasWidth, wallWidth + (i * verticalLineGap));
  }

  // start position
  noStroke();
  fill('#e0e1dd')
  square(width / 2 - startWidth / 2, 0, startWidth);
}

