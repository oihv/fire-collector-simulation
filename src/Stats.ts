import p5 from "p5";
import { map, arenaWidth } from "./sketch";
import { FlameColor } from "./Fire";

export class Stats {
  #score: number;
  static #pairHigh: number = 45;
  static #pairLow: number = 30;
  static #singleHigh: number = 15;
  static #singleLow: number = 10;

  constructor() {
    this.#score = 0;
  }

  public reset(): void {
    this.#score = 0;
  }

  private calculateScore(): void {
    if (!map.updated) return;
    this.reset();
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

  public show(p: p5): void {
    this.calculateScore();
    p.textSize(40)
    p.fill("White");
    p.text(`Score: ${this.#score}`, arenaWidth, 400);
  }
}
