const isLocal = window.location.hostname === "localhost";

const script = document.createElement('script');
script.src = isLocal
  ? "node_modules/p5/lib/p5.js"
  : "https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js"; 
script.type = "text/javascript"
script.language = "javascript"

document.head.appendChild(script);

