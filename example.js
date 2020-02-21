import { DIRS, Display, Engine, Map, Path, RNG, Scheduler, Util } from "./node_modules/rot-js/lib/index.js";

const mapWidth = 100;
const mapHeight = 30;
const numOfBoxes = 10;

let display = null;
let window = null;
let engine = null;

class Player {
  movingKeyMap = {
    72: DIRS[8][6],
    74: DIRS[8][4],
    75: DIRS[8][0],
    76: DIRS[8][2],
    89: DIRS[8][7],
    85: DIRS[8][1],
    78: DIRS[8][5],
    77: DIRS[8][3],
  };

  x = null;
  y = null;
  map = null;

  constructor(map) {
    this.map = map;
  }

  place(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    display.draw(this.x, this.y, '@', 'yellow');
  }

  act() {
    engine.lock();
    window.addEventListener('keydown', this);
  }

  handleEvent(event) {
    const code = event.keyCode;

    if (code === 32) {
      this._checkBox();
      return;
    }

    this._move(code);
  }

  _checkBox() {
    let key = this.x + ',' + this.y;
    if (this.map[key] !== '*') {
      window.alert('There is no box here!');
    } else if (key === Game.ananas) {
      window.alert('You Found an ananas and won this game!!');
      window.removeEventListener('keydown', this);
    } else {
      window.alert('This box is empty.');
    }
  }

  _move(code) {
    if (!(code in this.movingKeyMap)) {
      return;
    }

    let newX = this.x + this.movingKeyMap[code][0];
    let newY = this.y + this.movingKeyMap[code][1];
    let newKey = newX + ',' + newY;
    if (!(newKey in this.map)) {
      return;
    }

    display.draw(
      this.x,
      this.y,
      this.map[this.x + ',' + this.y]
    );
    this.x = newX;
    this.y = newY;
    this.draw();
    this._resolve();
  }

  _resolve() {
    window.removeEventListener('keydown', this);
    engine.unlock();
  }
}

class Pedro {
  x = null;
  y = null;
  player = null;
  map = null;

  constructor(player, map) {
    this.player = player;
    this.map = map;
  }

  place(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    display.draw(this.x, this.y, 'P', 'red');
  }

  act() {
    const passableCallback = function(x, y) {
      return (x + ',' + y in this.map);
    }.bind(this);
    const astar = new Path.AStar(this.player.x, this.player.y, passableCallback, {topology: 4});

    let path = [];
    const pathCallback = function(x, y) {
      path.push([x, y]);
    }

    astar.compute(this.x, this.y, pathCallback);

    path.shift();
    if (path.length <= 1) {
      engine.lock();
      window.alert('Game Over!!!');
    } else {
      const newX = path[0][0];
      const newY = path[0][1];
      display.draw(this.x, this.y, this.map[this.x + ',' + this.y]);
      this.x = newX;
      this.y = newY;
      this.draw();
    }
  }
}

class Game {
  map = {};
  freeCells = [];
  player = null;
  enemies = null;
  ananas = null;

  constructor(container, browserWindow) {
    RNG.setSeed(Math.random());
    window = browserWindow;

    this._initDisplay(container);
    this._generateMap();

    this._initActors();
    this._placeActor(this.player, this.freeCells);
    for (const enemy of this.enemies) {
      this._placeActor(enemy, this.freeCells);
    }

    this._initEngine();
  }

  _initDisplay(container) {
    display = new Display({
      bg: 'black',
      fg: 'white',
      width: mapWidth,
      height: mapHeight,
      fontSize: 16
    });
    container.appendChild(display.getContainer());
  }

  _initActors() {
    this.player = new Player(this.map);
    this.enemies = [
      new Pedro(this.player, this.map),
      new Pedro(this.player, this.map),
    ];
  }

  _generateMap() {
    const digger = new Map.Digger(mapWidth, mapHeight, {
      roomWidth: [3, 15],
      roomHeight: [3, 9],
      dugPercentage: [0.3],
    });

    digger.create((x, y, contents) => {
      if (contents === 1) {
        return;
      }

      const key = `${x},${y}`;
      this.map[key] = '.';
      this.freeCells.push(key);
    });

    this._generateBoxes(this.freeCells);
    this._drawWholeMap();
  }

  _generateBoxes(freeCells) {
    for (let i = 0; i < numOfBoxes; i++) {
      const index = Math.floor(RNG.getUniform() * freeCells.length);
      const key = freeCells.splice(index, 1)[0];
      this.map[key] = '*';

      if (i === 0) {
        this.ananas = key;
      }
    }
  }

  _placeActor(actor, freeCells) {
    const index = Math.floor(RNG.getUniform() * freeCells.length);
    const key = freeCells.splice(index, 1)[0];
    const parts = key.split(',');
    const x = parseInt(parts[0]);
    const y = parseInt(parts[1]);
    actor.place(x, y);
    actor.draw();
  }

  _drawWholeMap() {
    for (let key in this.map) {
      const parts = key.split(',');
      const x = parseInt(parts[0]);
      const y = parseInt(parts[1]);
      display.draw(x, y, this.map[key]);
    }
  }

  _initEngine() {
    const scheduler = new Scheduler.Simple();
    scheduler.add(this.player, true);
    for (const enemy of this.enemies) {
      scheduler.add(enemy, true);
    }

    engine = new Engine(scheduler);
    engine.start();
  }
}

export { Game as default }
