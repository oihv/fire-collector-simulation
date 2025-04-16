import { pathFind } from "./script";
import { fireArr, map, bot } from "./sketch";
import { BotInstruction } from "./Robot";
import { FlameColor, clearFire, initFire } from "./Fire";
import { stats } from "./sketch";

export let botMoves: BotInstruction[] = [];
const botMovesLength: number = 50; // Placeholder number
declare const Module: any;

const TYPES = {
  i8: { array: Int8Array, heap: "HEAP8" },
  i16: { array: Int16Array, heap: "HEAP16" },
  i32: { array: Int32Array, heap: "HEAP32" },
  f32: { array: Float32Array, heap: "HEAPF32" },
  f64: { array: Float64Array, heap: "HEAPF64" },
  u8: { array: Uint8Array, heap: "HEAPU8" },
  u16: { array: Uint16Array, heap: "HEAPU16" },
  u32: { array: Uint32Array, heap: "HEAPU32" }
};

export function simulate(): void {
  // Create pointer to a flattened array for the map
  const flatCoordinate = map.coordinate.flat();
  const coordinatePtr = Module._malloc(flatCoordinate.length * 4);
  Module[TYPES.i32.heap].set(flatCoordinate, coordinatePtr >> 2);

  // Create pointer to botMoves array
  const movesPtr = Module._malloc(botMovesLength * 4);

  // run the algorithm to pathfind
  pathFind(movesPtr, coordinatePtr);

  // Reassign value from memory to the array
  const memory = new Int32Array(Module.HEAP32.buffer, movesPtr, botMovesLength);
  botMoves = Array.from(memory);

  console.log('Updated botMoves:', botMoves);

  Module._free(coordinatePtr);
  Module._free(movesPtr);
}

export function initSimulation(): void {
  map.initMap(FlameColor.Empty);
    let arr: number[][] = [[2, 2, 0, 0, 1],
    [2, 1, 0, 0, 0],
    [2, 1, 0, 0, 1]]
  // map.populateFixedFire(arr);
  map.populateRandomFire();
  initFire();
  simulate();
}

export function resetSimulation(): void {
  bot.reset();
  clearFire();
  fireArr.length = 0; // Reset array
  stats.reset();
}

export function checkHighScore(): void {
  if (stats.score === 180) {
    stats.calcuteAvgMove();
    resetSimulation();
    initSimulation();
    stats.increaseWinstreak();
    console.log("Game finished");
  }
}
