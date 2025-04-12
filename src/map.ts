import { FlameColor } from "./Fire.js";
import { wallWidth, highLookoutWidth, horizontalLineGap } from "./sketch.js";
import { Fire } from "./Fire.js";
import p5 from "p5";
export class Map {
  #coordinate: FlameColor[][]; // Matrix to store flame position throughout the map
  #highLookout: FlameColor[][]; // Matrix to store availability in high lookout
  #updated: boolean;

  constructor() {
    this.#coordinate = Array.from(Array(5), _ => Array(5).fill(FlameColor.Empty));
    this.#highLookout = Array.from(Array(5), _ => Array(4).fill(FlameColor.Empty))
    this.#updated = false;
  }

  public initMap(color: FlameColor): void {
    this.#coordinate = Array.from(Array(5), _ => Array(5).fill(color));
    this.#highLookout = Array.from(Array(5), _ => Array(4).fill(color))
  }

  getRandomXY(): number[] {
    let x: number = Math.floor(Math.random() * 5); // Randomize from 1-5
    let y: number = Math.floor(Math.random() * 3 + 1); // Randomize from 2-4

    return Array(x, y)
  }

  populateFire(): void {
    let x: number;
    let y: number;

    for (var i = 0; i < 4; i++) {
      do { [x, y] = this.getRandomXY() }
      while (this.#coordinate[x][y] != 0)

      this.#coordinate[x][y] = FlameColor.Blue;
    }
    for (var i = 0; i < 4; i++) {
      do { [x, y] = this.getRandomXY() }
      while (this.#coordinate[x][y] != 0)

      this.#coordinate[x][y] = FlameColor.Red;
    }
  }

  print() {
    console.log(this.#coordinate);
  }

  public get coordinate(): FlameColor[][] {
    return this.#coordinate;
  }

  public set updated(val: boolean) {
    this.#updated = val;
  }

  public get updated(): boolean {
    return this.#updated;
  }

  public getVal(x: number, y: number): FlameColor {
    return this.#coordinate[x][y]; // Offset from gridX, and gridY
  }

  public setVal(x: number, y: number, val: FlameColor): void {
    this.#coordinate[x][y] = val; // Offset from gridX, and gridY
  }

  public setHighLookout(x: number, index: number, color: FlameColor): void {
    this.#updated = true;
    this.#highLookout[x][index] = color;
  }

  public getHighLookout(x: number, index: number): FlameColor {
    return this.#highLookout[x][index];
  }

  public showLookout(p: p5): void {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        let color = this.getHighLookout(i, j);
        if (color != FlameColor.Empty) {
          let colorStr: string = color == FlameColor.Blue ? "#A2D2FF" : "#C1121F";
          p.fill(colorStr);
          p.circle(wallWidth + ((i + 1) * horizontalLineGap) - (highLookoutWidth / 2) + j * 45, p.height - (wallWidth / 2), Fire.size);
        }
        // if (i !== 0 && i !== 6) p.rect(wallWidth + (i * horizontalLineGap) - highLookoutWidth / 2, p.height - wallWidth, highLookoutWidth, wallWidth)
      }
    }
  }
}
