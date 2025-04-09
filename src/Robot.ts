import p5 from 'p5'
import { wallWidth, horizontalLineGap, verticalLineGap } from './sketch.js';
import { MainObj } from './Object.js';
import { map } from './sketch.js';
import { fireArr } from './sketch.js';
import { FlameColor, incrementAllStackIndex } from './Fire.js';

enum BotOrientation {
  Right,
  Bottom,
  Left,
  Top
}

export class Robot extends MainObj {
  private size: number;
  private speed: number;
  private speedX: number;
  private speedY: number;
  private targetX: number;
  private targetY: number;
  private orientation: BotOrientation;
  private idle: boolean;
  private isTakingFire: boolean;
  private vertex: number[][];
  private static readonly maxFireStorage: number = 4;
  private curFireStorage: number;

  constructor() {
    super();
    this.size = 60;

    this.speed = 15;
    this.speedX = 0;
    this.speedY = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.curFireStorage = 0;

    this.orientation = BotOrientation.Bottom;
    this.idle = true;
    this.isTakingFire = false;
    this.vertex = [[this.x - this.size / 2, this.y - this.size / 2],
    [this.x, this.y + this.size / 2],
    [this.x + this.size / 2, this.y - this.size / 2]];
  }

  // Update the direction
  dir(newSpeedX: number, newSpeedY: number) {
    if (this.idle === false) return;

    let newGridX = this.gridX + newSpeedX;
    let newGridY = this.gridY + newSpeedY;
    if (this.isOutConstraint(newGridX, newGridY)) return;
    if (this.checkCollisionFire(newGridX, newGridY)) return;
    this.speedX = newSpeedX;
    this.speedY = newSpeedY;
    this.updateOrientation();
    this.updateGrid(newGridX, newGridY);
    this.idle = false;
  }

  private updateOrientation(): void {
    if (this.speedX === 1) this.orientation = BotOrientation.Right;
    else if (this.speedY === -1) this.orientation = BotOrientation.Bottom;
    else if (this.speedX === -1) this.orientation = BotOrientation.Left;
    else if (this.speedY === 1) this.orientation = BotOrientation.Top;
  }

  isOutConstraint(newGridX: number, newGridY: number) {
    if (newGridX > 4 || newGridX < 0) return true;
    if (newGridY > 4 || newGridY < 0) return true;
    return false;
  }

  private updateGrid(newGridX: number, newGridY: number): void {
    this.gridX = newGridX;
    this.gridY = newGridY;
    this.targetX = wallWidth + (this.gridX + 1) * horizontalLineGap; // +1 for offset
    this.targetY = wallWidth + this.gridY * verticalLineGap;
    if (this.gridY === 4) this.targetY -= 30;
  }

  // Update the orientation of the triangle
  updateVertex() {
    switch (this.orientation) {
      case BotOrientation.Right:
        this.vertex[0][0] = this.x - this.size / 2;
        this.vertex[0][1] = this.y + this.size / 2;
        this.vertex[1][0] = this.x - this.size / 2;
        this.vertex[1][1] = this.y - this.size / 2;
        this.vertex[2][0] = this.x + this.size / 2;
        this.vertex[2][1] = this.y;
        break;
      case BotOrientation.Bottom:
        this.vertex[0][0] = this.x - this.size / 2;
        this.vertex[0][1] = this.y + this.size / 2;
        this.vertex[1][0] = this.x + this.size / 2;
        this.vertex[1][1] = this.y + this.size / 2;
        this.vertex[2][0] = this.x;
        this.vertex[2][1] = this.y - this.size / 2;
        break;
      case BotOrientation.Left:
        this.vertex[0][0] = this.x + this.size / 2;
        this.vertex[0][1] = this.y + this.size / 2;
        this.vertex[1][0] = this.x + this.size / 2;
        this.vertex[1][1] = this.y - this.size / 2;
        this.vertex[2][0] = this.x - this.size / 2;
        this.vertex[2][1] = this.y;
        break;
      case BotOrientation.Top:
        this.vertex[0][0] = this.x - this.size / 2;
        this.vertex[0][1] = this.y - this.size / 2;
        this.vertex[1][0] = this.x + this.size / 2;
        this.vertex[1][1] = this.y - this.size / 2;
        this.vertex[2][0] = this.x;
        this.vertex[2][1] = this.y + this.size / 2;
        break;
    }
  }

  stop() {
    this.speedX = 0;
    this.speedY = 0;
  }

  realignPosition() {
    this.x = this.targetX;
    this.y = this.targetY;
  }

  update() {
    if (this.checkArriveTarget()) {
      this.idle = true;
      if (this.isTakingFire)
        this.collectFire();
      this.realignPosition();
      this.stop();
      return;
    }
    this.x += this.speedX * this.speed;
    this.y += this.speedY * this.speed;
  }

  checkArriveTarget() {
    if (this.speedX === 1 && this.x + this.size / 2 >= this.targetX) return true;
    else if (this.speedX === -1 && this.x - this.size / 2 <= this.targetX) return true;
    else if (this.speedY === -1 && this.y - this.size / 2 <= this.targetY) return true;
    else if (this.speedY === 1 && this.y + this.size / 2 >= this.targetY) return true;
    else return false;
  }

  private checkCollisionFire(newGridX: number, newGridY: number): boolean {
    if (map.getVal(newGridX, newGridY) != FlameColor.Empty) { // If the next target grid have a flame
      if (this.curFireStorage >= Robot.maxFireStorage)
        return true; // If the capacity is full
      else {
        this.isTakingFire = true; // Take fire when arrived
        return false;
      }
    }
    return false;
  }

  private collectFire() {
    this.isTakingFire = false;

    // TODO: think of a better way of finding the fire located in the coordinate
    // Find the fire correlated to this position, and then set it as took
    for (const fire of fireArr) {
      let x: number, y: number;
      [x, y] = fire.getXY();
      if (this.gridX === x && this.gridY === y) {
        fire.isCollected = true;
        incrementAllStackIndex();
        fire.stackIndex = 0; // Start at 0
        map.setVal(x, y, FlameColor.Empty);
        break;
      }
    }
    console.log("Add")
    this.curFireStorage += 1;
  }

  // TODO: Implement put fire mechanism
  private putFire() {

  }

  public getXY(): number[] {
    return Array(this.x, this.y);
  }

  public show(p: p5) {
    this.updateVertex();
    p.noStroke();
    p.fill('#778DA9');
    p.triangle(
      this.vertex[0][0],
      this.vertex[0][1],
      this.vertex[1][0],
      this.vertex[1][1],
      this.vertex[2][0],
      this.vertex[2][1]
    );
  }
};
