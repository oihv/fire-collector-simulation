import p5 from 'p5'
import { wallWidth, horizontalLineGap, verticalLineGap } from './sketch.js';
import { MainObj } from './Object.js';
import { map } from './sketch.js';
import { fireArr } from './sketch.js';
import { Fire, FlameColor } from './Fire.js';
import { botMoves } from './Simulation.js';

export enum BotOrientation {
  Right,
  Bottom,
  Left,
  Top
}

export enum BotInstruction {
  movr = 0,
  movb = 1,
  movl = 2,
  movt = 3,
  rotl = 4,
  rotr = 5,
  rotb = 6,
  take = 7,
  puth0 = 8,
  puth1 = 9,
  puth2 = 10,
  puth3 = 11,
  stop = 12,
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
  #halt: boolean;
  private isTakingFire: boolean;
  private vertex: number[][];
  private static readonly maxFireStorage: number = 4;
  private curFireStorage: number;
  #instructionIndex: number;

  constructor() {
    super();
    this.size = 60;

    this.speed = 15;
    this.speedX = 0;
    this.speedY = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.curFireStorage = 0;
    this.#instructionIndex = 0;

    this.orientation = BotOrientation.Bottom;
    this.idle = true;
    this.#halt = false;
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

  private moveForward(): void {
    switch(this.orientation) {
      case BotOrientation.Right:
        this.executeMove(BotInstruction.movr);
        break;
      case BotOrientation.Bottom:
        this.executeMove(BotInstruction.movb);
        break;
      case BotOrientation.Left:
        this.executeMove(BotInstruction.movl);
        break;
      case BotOrientation.Top:
        this.executeMove(BotInstruction.movt);
        break;
    }
  }

  private updateOrientation(): void {
    if (this.speedX === 1) this.orientation = BotOrientation.Right;
    else if (this.speedY === -1) this.orientation = BotOrientation.Top;
    else if (this.speedX === -1) this.orientation = BotOrientation.Left;
    else if (this.speedY === 1) this.orientation = BotOrientation.Bottom;
  }

  public rotate(dir: BotOrientation): void {
    this.orientation = dir;
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
        this.vertex[0][1] = this.y - this.size / 2;
        this.vertex[1][0] = this.x + this.size / 2;
        this.vertex[1][1] = this.y - this.size / 2;
        this.vertex[2][0] = this.x;
        this.vertex[2][1] = this.y + this.size / 2;
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
        this.vertex[0][1] = this.y + this.size / 2;
        this.vertex[1][0] = this.x + this.size / 2;
        this.vertex[1][1] = this.y + this.size / 2;
        this.vertex[2][0] = this.x;
        this.vertex[2][1] = this.y - this.size / 2;
        break;
    }
  }

  public stop(): void {
    this.speedX = 0;
    this.speedY = 0;
  }

  public realignPosition(): void {
    this.x = this.targetX;
    this.y = this.targetY;
  }

  public update(): void {
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

  public get halt(): boolean {
    return this.#halt;
  }

  public automateMove(): void {
    if (this.idle === true) {
      if (botMoves[this.#instructionIndex] === BotInstruction.stop) {
        this.#instructionIndex = 0; // reset the instruction index
        this.#halt = true;
        return;
      }
      this.executeMove(botMoves[this.#instructionIndex]);
      this.#instructionIndex++;
    }
  }

  public executeMove(ins: BotInstruction): void {
    switch (ins) {
      case BotInstruction.movr:
        this.dir(1, 0);
        break;
      case BotInstruction.movb:
        this.dir(0, 1);
        break;
      case BotInstruction.movl:
        this.dir(-1, 0);
        break;
      case BotInstruction.movt:
        this.dir(0, -1);
        break;
      case BotInstruction.rotl:
        this.rotate(BotOrientation.Left)
        break;
      case BotInstruction.rotr:
        this.rotate(BotOrientation.Right)
        break;
      case BotInstruction.rotb:
        let orientateTo: BotOrientation;
        this.orientation === BotOrientation.Bottom ? orientateTo = BotOrientation.Top : orientateTo = BotOrientation.Bottom;
        this.rotate(orientateTo);
        break;
      case BotInstruction.take:
        // For now, only move forward and take the ore there
        this.moveForward();
        break;
      case BotInstruction.puth0:
        this.checkLookoutCollision(0);
        break;
      case BotInstruction.puth1:
        this.checkLookoutCollision(1);
        break;
      case BotInstruction.puth2:
        this.checkLookoutCollision(2);
        break;
      case BotInstruction.puth3:
        this.checkLookoutCollision(3);
        break;
      case BotInstruction.stop:
        break;
    }
  }

  public checkArriveTarget(): boolean {
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
        Fire.pushTookStack(fire);
        map.setVal(x, y, FlameColor.Empty);
        break;
      }
    }
    this.curFireStorage++;
  }

  // TODO: Implement put fire mechanism
  private putFire(index: number): void {
    let putFlame: Fire = Fire.popTookStack();
    putFlame.isPut = true; // Set the flag to true
    map.setHighLookout(this.gridX, index, putFlame.color); // Set the color of the lookout in this position
    this.curFireStorage--;
  }

  public checkLookoutCollision(index: number): void {
    console.assert(this.gridY === 4, "Bot is not on the most bottom row.");
    console.assert(this.orientation === BotOrientation.Bottom, "Bot is not facing the bottom.");
    console.assert(map.getHighLookout(this.gridX, index) === FlameColor.Empty, "High lookout is not empty");

    this.putFire(index);
  }

  public getXY(): number[] {
    return Array(this.x, this.y);
  }

  public getGridXY(): number[] {
    return Array(this.gridX, this.gridY);
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
