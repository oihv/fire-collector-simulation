import { wallWidth, horizontalLineGap, verticalLineGap } from "./sketch.js";
export class MainObj {
  gridX: number;
  gridY: number;
  x: number;
  y: number;

constructor(gridX=2, gridY=0) {
    this.gridX = gridX; // starts from 1, end in 5
    this.gridY = gridY; // starts from 0, end in 4
    this.x = wallWidth + (gridX + 1) * horizontalLineGap; // Offset
    this.y = wallWidth + gridY * verticalLineGap;
  }
}
