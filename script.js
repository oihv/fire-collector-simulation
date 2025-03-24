const isLocal = window.location.hostname === "localhost";

const script = document.createElement('script');
script.language = "javascript"
script.type = "text/javascript"
script.src = isLocal
  ? "node_modules/p5/lib/p5.js"
  : "https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js"; 

document.head.appendChild(script);

