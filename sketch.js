const canvasWidth = 1575; // Scale 1:2.67
const canvasHeight = 1200;

function setup() {
    window.canvas = createCanvas(canvasWidth, canvasHeight); 
    window.canvas.parent("canvas");
}

const wallWidth = 37.45;
const verticalLineGap = 281;
const horizontalLineGap = 250;
const highLookoutWidth = 150;
function draw() {
  background('#1b263b');
  
  stroke('#e0e1dd');
  strokeWeight(5);
  fill('#778da9')
  // Vertical lines
  for (var i = 0 ; i < 7 ; i++) {
    line(wallWidth + (i*horizontalLineGap), 0, wallWidth + (i*horizontalLineGap), canvasHeight);
    // Lookout rectangle
    if (i !== 0 && i !== 6) rect(wallWidth + (i*horizontalLineGap) - highLookoutWidth/2, height - wallWidth, highLookoutWidth, wallWidth)
  }
  // Horizontal lines
  for (var i = 0 ; i < 5 ; i++) {
    line(0, wallWidth + (i*verticalLineGap), canvasWidth, wallWidth + (i*verticalLineGap));
  }

  const startWidth = 225;
  fill('#e0e1dd')
  // start position
  square(width/2 - startWidth/2, 0, startWidth);
}

class Robot {
  constructor() {
    this.x = wallWidth + 3*horizontalLineGap; 
    this.y = wallWidth;
  }
};
