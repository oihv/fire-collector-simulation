import p5 from "p5";
import { map, arenaWidth } from "./sketch";
import { FlameColor } from "./Fire";

export class Stats {
  #score: number;
  static #pairHigh: number = 45;
  static #pairLow: number = 30;
  static #singleHigh: number = 15;
  static #singleLow: number = 10;
  static #trialsNum: number = 0;
  static #winstreak: number = 0;
  static #moves: number = 0;
  static #totalMoves: number = 0;
  static #averageMoves: number = 0;

  constructor() {
    this.#score = 0;
  }

  public reset(): void {
    this.resetScore();
    Stats.#moves = 0;
  }

  public resetScore(): void {
    this.#score = 0;
  }

  public resetAll(): void {
    this.reset();
    Stats.#totalMoves = 0;
    Stats.#averageMoves = 0;
    Stats.#winstreak = 0;
  }

  public calcuteAvgMove(): void {
    Stats.#totalMoves += Stats.#moves;
    Stats.#averageMoves = Stats.#totalMoves / (Stats.#winstreak + 1); // TODO: implement actual game count
  }

  public incrementMoves(): void {
    Stats.#moves++;
  }

  private calculateScore(): void {
    if (!map.updated) return;
    this.resetScore();
    let blue: number = 0; // To track number of flame
    let red: number = 0;
    for (let i = 0; i < 5; i++) {
      // Check 2 by 2
      for (let j = 0; j < 2; j++) {
        // TODO: refine the logic, optimize
        if (map.getHighLookout(i, j * 2) === FlameColor.Red) red++;
        else if (map.getHighLookout(i, j * 2) === FlameColor.Blue) blue++;
        if (map.getHighLookout(i, j * 2 + 1) === FlameColor.Red) red++;
        else if (map.getHighLookout(i, j * 2 + 1) === FlameColor.Blue) blue++;

        if (red === 1 && blue === 1) this.#score += Stats.#pairHigh;
        else if (red || blue) this.#score += (red + blue) * Stats.#singleHigh;
        blue = 0, red = 0; // Reset 
      }
    }
    map.updated = false;
  }

  public get score(): number {
    return this.#score;
  }

  public increaseWinstreak(): void {
    Stats.#winstreak++;
  }

  public show(p: p5): void {
    this.calculateScore();
    p.textSize(40)
    p.fill("White");
    p.text(`Score: ${this.#score}`, arenaWidth, 400);
    p.text(`Moves: ${Stats.#moves}`, arenaWidth, 500);
    p.text(`Avg Moves: ${Stats.#averageMoves}`, arenaWidth, 600);
    p.text(`Win streak: ${Stats.#winstreak}`, arenaWidth, 700);
  }
}
