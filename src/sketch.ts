import p5 from 'p5'
import { Robot, BotOrientation } from './Robot.js';
import { Map } from './map.js';
import { Fire, initFire } from './Fire.js'
import { initWasm } from './script.js';
import { checkHighScore, initSimulation, resetSimulation, simulate } from './Simulation.js'; 
import { Stats } from './Stats.js';

const canvasWidth: number = 1900; // Scale 1:2.67
export const arenaWidth: number = 1575; // Scale 1:2.67
const canvasHeight: number = 1200;
export const wallWidth: number = 37.45;
export const verticalLineGap: number = 281;
export const horizontalLineGap: number = 250;
export const highLookoutWidth: number = 150;
const startWidth: number = 225;
export var bot: Robot;
export var fireArr: Fire[] = [];
export var map: Map;
export let stats: Stats;

const s = (p: p5) => {
  p.preload = async () => {
    await initWasm();
    p.createCanvas(canvasWidth, canvasHeight);

    p.angleMode(p.DEGREES);
  }
  p.setup = async () => {
    bot = new Robot();
    map = new Map();
    stats = new Stats();
    map.populateRandomFire();
    initFire();
    simulate();
  };

  p.draw = () => {
    drawArena(p);
    bot.update();
    // bot.halt === false ? bot.automateMove() : undefined; // Automate robot moves based on C output
    bot.show(p);
    for (const fire of fireArr) { // Draw fire
      fire.show(p);
    }
    map.showLookout(p);
    stats.show(p);
    checkHighScore();
  };

  p.keyPressed = () => {
    stats.incrementMoves();
    switch (p.keyCode) {
      case 65: // a 
        bot.dir(-1, 0);
        break;
      case 68: // d
        bot.dir(1, 0);
        break;
      case 87: // w
        bot.dir(0, -1);
        break;
      case 83: // s
        bot.dir(0, 1);
        break;

      case 48: // 0
        bot.checkLookoutCollision(0);
        break;
      case 49: // 1
        bot.checkLookoutCollision(1);
        break;
      case 50: // 2
        bot.checkLookoutCollision(2);
        break;
      case 51: // 3
        bot.checkLookoutCollision(3);
        break;

      case 37: // left
        bot.rotate(BotOrientation.Left)
        break;
      case 38: // up
        bot.rotate(BotOrientation.Top)
        break;
      case 39: // right
        bot.rotate(BotOrientation.Right)
        break;
      case 40: // bottom
        bot.rotate(BotOrientation.Bottom)
        break;
      case 82:
        resetSimulation();
        initSimulation();
        stats.resetAll();
        break;
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
    p.line(0, wallWidth + (i * verticalLineGap), arenaWidth, wallWidth + (i * verticalLineGap));
  }

  // start position
  p.noStroke();
  p.fill('#e0e1dd')
  p.square(arenaWidth / 2 - startWidth / 2, 0, startWidth);
}

const canvasElement = document.getElementById('canvas');
if (canvasElement) {
  new p5(s, canvasElement);
} else {
  console.error("Canvas element with ID 'canvas' not found.");
}
