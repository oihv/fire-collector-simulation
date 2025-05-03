import p5 from "p5";
import { map, arenaWidth } from "./sketch";
import { FlameColor } from "./Fire";

export class Stats {
  static #score: number = 0;
  static #pairHigh: number = 45;
  // static #pairLow: number = 30;
  static #singleHigh: number = 15;
  // static #singleLow: number = 10;
  // static #trialsNum: number = 0;
  static #winstreak: number = 0;
  static #moves: number = 0;
  static #rotations: number = 0; //New definition for rotation
  static #totalMoves: number = 0;
  static #totalRotations: number = 0;
  static #averageMoves: number = 0;
  static #averageRotations: number = 0;

  public reset(): void {
    Stats.#moves = 0;
    Stats.#rotations = 0;
    Stats.#score = 0;
  }
  
  public resetAll(): void {
    Stats.#totalMoves = 0;
    Stats.#averageMoves = 0;
    Stats.#winstreak = 0;
    Stats.#rotations = 0;
  }

  public calcuteAvgMove(): void {
    Stats.#totalMoves += Stats.#moves;
    Stats.#averageMoves = Stats.#totalMoves / (Stats.#winstreak + 1); // TODO: implement actual game count
  }

  public calculateAvgRotation(): void{
    Stats.#totalRotations += Stats.#rotations;
    Stats.#averageRotations = Stats.#totalRotations / (Stats.#winstreak + 1);
  }

  public incrementMoves(): void {
    Stats.#moves++;
  }

  public incrementRotations(): void{
    Stats.#rotations++;
  }

  private calculateScore(): void {
    if (!map.updated) return;
    Stats.#score = 0;
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

        if (red === 1 && blue === 1) Stats.#score += Stats.#pairHigh;
        else if (red || blue) Stats.#score += (red + blue) * Stats.#singleHigh;
        blue = 0, red = 0; // Reset 
      }
    }
    map.updated = false;
  }

  public get score(): number {
    return Stats.#score;
  }

  public increaseWinstreak(): void {
    Stats.#winstreak++;
  }

  public show(p: p5): void {
    this.calculateScore();
    p.textSize(40)
    p.fill("White");
    p.text(`Score: ${Stats.#score}`, arenaWidth, 400);
    p.text(`Moves: ${Stats.#moves}`, arenaWidth, 500);
    p.text(`Rotations: ${Stats.#rotations}`, arenaWidth, 600); //Added a value for rotation
    p.text(`Avg Moves: ${Stats.#averageMoves}`, arenaWidth, 700);
    p.text(`Avg Rotations: ${Stats.#averageRotations}`, arenaWidth, 800);
    p.text(`Win streak: ${Stats.#winstreak}`, arenaWidth, 900);
  }
}
