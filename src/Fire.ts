import p5 from 'p5'
import { fireArr  } from './sketch.js';
import { MainObj } from './Object.js';
import { map, bot } from './sketch.js';

export enum FlameColor {
  Empty,
  Blue, 
  Red
}

export class Fire extends MainObj {
  private color: FlameColor;
  private size: number;
  #isCollected: boolean;
  #stackIndex: number;

  constructor(gridX: number, gridY: number, color: FlameColor) {
    super(gridX, gridY);
    this.color = color; // 1 for blue, 2 for red
    this.size = 45;
    this.#isCollected = false;
    this.#stackIndex = 0;
  }

  public getXY(): number[] {
    return Array(this.gridX, this.gridY);
  }

  public set isCollected(value: boolean){
    this.#isCollected = value;
  }

  public set stackIndex(value: number){
    this.#stackIndex = value;
  }

  public get stackIndex(): number{
    return this.#stackIndex;
  }

  public show(p: p5): void {
    let colorStr: string = this.color == FlameColor.Blue ? "#A2D2FF" : "#C1121F";
    p.fill(colorStr);
    if (!this.#isCollected) { // Show on the map
      p.circle(this.x, this.y, this.size);
    }
    else { // Show on top of the robot
      let botX: number, botY: number;
      [botX, botY] = bot.getXY();
      p.circle(botX, botY - (this.size * (this.#stackIndex + 2)), this.size)
    }
  }
}

export function initFire() {
  for (let i = 0; i < 5 ; i++) {
    for (let j = 1; j < 4 ; j++) {
      if (map.getVal(i, j) != FlameColor.Empty) {
        const fire = new Fire(i, j, map.getVal(i, j));
        fireArr.push(fire);
      }
    }
  }
}

export function incrementAllStackIndex() {
  for (const fire of fireArr) {
    fire.stackIndex += 1;
  }
}
