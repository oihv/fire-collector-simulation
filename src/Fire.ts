import p5 from 'p5'
import { fireArr  } from './sketch.js';
import { MainObj } from './Object.js';

export class Fire extends MainObj {
  color: string;
  size: number;
  constructor(gridX: number, gridY: number, color: string) {
    super(gridX, gridY);
    this.color = color;
    this.size = 30;
  }

  show(p: p5) {
    p.fill(this.color);
    p.circle(this.x, this.y, this.size);
  }
}

export function randomizeFireLocation() {
  for (var i = 0; i < 4 ; i++) {
    const fire = new Fire(Math.floor(Math.random() * 5 + 1), Math.floor(Math.random() * 3 + 1), '#a2d2ff');
    fireArr.push(fire);
    console.log(`Fire created at (${fire.x}, ${fire.y})`);
  }
  for (var i = 0; i < 4 ; i++) {
    fireArr.push(new Fire(Math.floor(Math.random() * 5 + 1), Math.floor(Math.random() * 3 + 1), '#c1121f'));
  }
}

function setFireLocation() {
  for (var i = 0; i < 4; i++) {
    
  }
}
