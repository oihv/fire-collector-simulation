import p5 from 'p5'
import { fireArr } from './sketch.js';
import { MainObj } from './Object.js';
import { map, bot } from './sketch.js';

export enum FlameColor {
  Empty,
  Blue,
  Red
}

export class Fire extends MainObj {
  #color: FlameColor;
  public static size: number = 45;
  #isCollected: boolean;
  #isPut: boolean;
  static #tookStack: Fire[] = [];

  constructor(gridX: number, gridY: number, color: FlameColor) {
    super(gridX, gridY);
    this.#color = color; // 1 for blue, 2 for red
    this.#isCollected = false;
    this.#isPut = false;
  }

  public get color(): FlameColor {
    return this.#color;
  }

  public getXY(): number[] {
    return Array(this.gridX, this.gridY);
  }

  public static pushTookStack(obj: Fire): void {
    Fire.#tookStack.push(obj);
  }

  static popTookStack(): Fire {
    console.assert(Fire.#tookStack.length > 0, "Attempting to pop from tookStack while it is empty.");
    return Fire.#tookStack.pop()!; // Assuring typescript that this value won't be undefined
  }

  public static getTookStackSize(): number {
    return Fire.#tookStack.length;
  }

  public set isCollected(value: boolean) {
    this.#isCollected = value;
  }

  public set isPut(value: boolean) {
    this.#isPut = value;
  }

  public get isPut(): boolean {
    return this.#isPut;
  }

  public show(p: p5): void {
    let colorStr: string = this.#color == FlameColor.Blue ? "#A2D2FF" : "#C1121F";
    p.fill(colorStr);
    if (!this.#isCollected) { // Show on the map
      p.circle(this.x, this.y, Fire.size);
    }
    else if (!this.#isPut) { // Show on top of the robot
      let botX: number, botY: number;
      [botX, botY] = bot.getXY();
      p.circle(botX, botY - (Fire.size * (4 - Fire.#tookStack.indexOf(this) + 1)), Fire.size)
    }
  }
}

export function initFire() {
  for (let i = 0; i < 5; i++) {
    for (let j = 1; j < 4; j++) {
      if (map.getVal(i, j) != FlameColor.Empty) {
        const fire = new Fire(i, j, map.getVal(i, j));
        fireArr.push(fire);
      }
    }
  }
}

export function clearFire() {
  for (let i = 0; i < 8; i++) {
    delete fireArr[i];
  }
}
