import { Display } from "/node_modules/rot-js/lib/index.js";

let level = {
  width: 11,
  height: 11
}
let display = new Display(level);
document.body.appendChild(display.getContainer());

for (let i = 0; i < level.width; i++) {
  for (let j = 0; j < level.height; j++ ) {
    if (!i || !j || i + 1 == level.width || j + 1 == level.height) {
      display.draw(i, j, '#', 'gray');
    } else {
      display.draw(i, j, '.', '#666');
    }
  }
}

display.draw(level.width >> 1, level.height >> 1, '@', 'red');
