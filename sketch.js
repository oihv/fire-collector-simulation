const canvasWidth = 1575; // Scale 1:2.67
const canvasHeight = 1200;

function setup() {
    window.canvas = createCanvas(canvasWidth, canvasHeight); 
    window.canvas.parent("canvas");
}

function draw() {
  background('#1b263b');
  
  stroke('#e0e1dd');
  strokeWeight(5);
  const wallWidth = 37.45;
  const verticalWidth = 281;
  const horizontalWidth = 250;
  // Vertical lines
  for (var i = 0 ; i < 7 ; i++) {
    line(wallWidth + (i*horizontalWidth), 0, wallWidth + (i*horizontalWidth), canvasHeight);
  }
  // Horizontal lines
  for (var i = 0 ; i < 5 ; i++) {
    line(0, wallWidth + (i*verticalWidth), canvasWidth, wallWidth + (i*verticalWidth));
  }

  const startWidth = 225;
  fill('#e0e1dd')
  // start position
  square(width/2 - startWidth/2, 0, startWidth);
}
