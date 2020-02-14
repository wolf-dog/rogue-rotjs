import {Display, Map, RNG, Util} from "/node_modules/rot-js/lib/index.js";

RNG.setSeed(2);

let map = new Map.Digger();
let display = new Display({
  bg: 'black',
  fg: 'white',
  fontSize: 13
});
document.body.appendChild(display.getContainer());

map.create(display.DEBUG);

let drawDoor = function(x, y) {
  display.draw(x, y, '+');
}

let rooms = map.getRooms();
for (let i = 0; i < rooms.length; i++) {
  let room = rooms[i];
  room.getDoors(drawDoor);
}
