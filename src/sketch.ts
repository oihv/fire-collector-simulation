import p5 from 'p5'
import { Robot } from './Robot.js';
import { Map } from './map.js';
import { Fire, initFire } from './Fire.js'

const canvasWidth: number = 1575; // Scale 1:2.67
const canvasHeight: number = 1200;
export const wallWidth: number = 37.45;
export const verticalLineGap: number = 281;
export const horizontalLineGap: number = 250;
const highLookoutWidth: number = 150;
const startWidth: number = 225;
var bot: Robot;
export var fireArr: Fire[] = [];
export var map: Map;

const s = (p: p5) => {
  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);

    p.angleMode(p.DEGREES);

    bot = new Robot();
    map = new Map();
    map.populateFire();
    initFire();
  };

  p.draw = () => {
    drawArena(p);
    bot.update();
    bot.show(p);
    for (const fire of fireArr) {
      fire.show(p);
    }
  };

  p.keyPressed = () => {
    if (p.keyCode === 65) { // a 
      bot.dir(-1, 0);
    }
    else if (p.keyCode === 68) { // d
      bot.dir(1, 0);
    }
    else if (p.keyCode === 87) { // w
      bot.dir(0, -1);
    }
    else if (p.keyCode === 83) { // s
      bot.dir(0, 1);
    }
  };
};

function drawArena(p: p5) {
  p.background('#1b263b');

  p.stroke('#e0e1dd');
  p.strokeWeight(5);
  p.fill('#415A77')
  // Vertical lines
  for (var i = 0; i < 7; i++) {
    p.line(wallWidth + (i * horizontalLineGap), 0, wallWidth + (i * horizontalLineGap), canvasHeight);
    // Lookout rectangle
    if (i !== 0 && i !== 6) p.rect(wallWidth + (i * horizontalLineGap) - highLookoutWidth / 2, p.height - wallWidth, highLookoutWidth, wallWidth)
  }
  // Horizontal lines
  for (var i = 0; i < 5; i++) {
    p.line(0, wallWidth + (i * verticalLineGap), canvasWidth, wallWidth + (i * verticalLineGap));
  }

  // start position
  p.noStroke();
  p.fill('#e0e1dd')
  p.square(p.width / 2 - startWidth / 2, 0, startWidth);
}

const canvasElement = document.getElementById('canvas');
if (canvasElement) {
  let myp5: p5 = new p5(s, canvasElement);
} else {
  console.error("Canvas element with ID 'canvas' not found.");
}
