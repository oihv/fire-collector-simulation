import { FlameColor } from "./Fire.js";
export class Map {
  coordinate: FlameColor[][];

  constructor() {
    this.coordinate = Array.from(Array(5), _ => Array(5).fill(FlameColor.Empty));
  }

  getRandomXY(): number[] {
    let x: number = Math.floor(Math.random() * 5); // Randomize from 1-5
    let y: number = Math.floor(Math.random() * 3 + 1); // Randomize from 2-4

    return Array(x,y)
  }

  populateFire(): void {
    let x: number;
    let y: number;

    for (var i = 0; i < 4; i++) {
      do { [x, y] = this.getRandomXY() }
      while (this.coordinate[x][y] != 0)

      this.coordinate[x][y] = FlameColor.Blue;
    }
    for (var i = 0; i < 4; i++) {
      do { [x, y] = this.getRandomXY() }
      while (this.coordinate[x][y] != 0)

      this.coordinate[x][y] = FlameColor.Red;
    }
  }

  print() {
    console.log(this.coordinate);
  }

  public getVal(x: number, y: number): FlameColor{
    return this.coordinate[x][y]; // Offset from gridX, and gridY
  }
}
