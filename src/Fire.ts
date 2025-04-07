import p5 from 'p5'
import { fireArr  } from './sketch.js';
import { MainObj } from './Object.js';
import { map } from './sketch.js';

export enum FlameColor {
  Empty,
  Blue, 
  Red
}

export class Fire extends MainObj {
  private color: FlameColor;
  private size: number;
  #isTook: boolean;

  constructor(gridX: number, gridY: number, color: FlameColor) {
    super(gridX, gridY);
    this.color = color; // 1 for blue, 2 for red
    this.size = 45;
    this.#isTook = false;
  }

  public getXY(): number[] {
    return Array(this.gridX, this.gridY);
  }

  public set isTook(value: boolean){
    this.#isTook = value;
  }

  public show(p: p5): void {
    if (!this.isTook) {
      let colorStr: string = this.color == FlameColor.Blue ? "#A2D2FF" : "#C1121F";
      p.fill(colorStr);
      p.circle(this.x, this.y, this.size);
    }
  }
}

export function initFire() {
  for (let i = 0; i < 5 ; i++) {
    for (let j = 1; j < 4 ; j++) {
      if (map.getVal(i, j) != FlameColor.Empty) {
        const fire = new Fire(i, j, map.getVal(i, j)); // Add 1 for x coordinate because of alignment at drawing
        fireArr.push(fire);
      }
    }
  }
}
