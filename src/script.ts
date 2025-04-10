const isLocal = window.location.hostname === "localhost";

const script = document.createElement('script');
// script.language = "javascript" // BUG: error somehow, but is it necessary
// anyway?
script.type = "text/javascript"
script.src = isLocal
  ? "node_modules/p5/lib/p5.js"
  : "https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js";

document.head.appendChild(script);

// Import function from C
declare const Module: any;
// Instantiate wasmModule instance
// export const wasmModule = await WebAssembly.instantiateStreaming(fetch('module.wasm'));

// Both moves and map will contain pointer so it will be passed by address,
// instead of value
export let pathFind: (moves: number, map: number) => number = () => {
  throw new Error("WASM not initialized");
};

export const initWasm = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof Module === "undefined") {
      reject("Module is undefined — make sure algo.js loaded first");
      return;
    }

    // TODO: sometimes malloc get called before initialization is completed
    pathFind = Module.cwrap("pathFind", "number", ["number"]);
    resolve();
  });
};

