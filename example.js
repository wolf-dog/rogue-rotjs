import { DIRS, Display, Engine, Map, Path, RNG, Scheduler, Util } from "./node_modules/rot-js/lib/index.js";

const mapWidth = 100;
const mapHeight = 30;
const numOfBoxes = 10;

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
  window = null;
  display = null;
  map = null;
  engine = null;

  constructor(window, display, map) {
    this.window = window;
    this.display = display;
    this.map = map;
  }

  setEngine(engine) {
    this.engine = engine;
  }

  place(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    this.display.draw(this.x, this.y, '@', 'yellow');
  }

  act() {
    this.engine.lock();
    this.window.addEventListener('keydown', this);
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
      this.window.alert('There is no box here!');
    } else if (key === Game.ananas) {
      this.window.alert('You Found an ananas and won this game!!');
      this.window.removeEventListener('keydown', this);
    } else {
      this.window.alert('This box is empty.');
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

    this.display.draw(
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
    this.window.removeEventListener('keydown', this);
    this.engine.unlock();
  }
}

class Pedro {
  x = null;
  y = null;
  window = null;
  display = null;
  map = null;
  engine = null;
  player = null;

  constructor(window, display, map, player) {
    this.window = window;
    this.display = display;
    this.map = map;
    this.player = player;
  }

  setEngine(engine) {
    this.engine = engine;
  }

  place(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    this.display.draw(this.x, this.y, 'P', 'red');
  }

  act() {
    const passableCallback = function(x, y) {
      return (x + ',' + y in this.map);
    }.bind(this);
    const astar = new Path.AStar(this.player.x, this.player.y, passableCallback, {topology: 8});

    let path = [];
    const pathCallback = function(x, y) {
      path.push([x, y]);
    }

    astar.compute(this.x, this.y, pathCallback);

    path.shift();
    if (path.length <= 1) {
      this.engine.lock();
      this.window.alert('Game Over!!!');
    } else {
      const newX = path[0][0];
      const newY = path[0][1];
      this.display.draw(this.x, this.y, this.map[this.x + ',' + this.y]);
      this.x = newX;
      this.y = newY;
      this.draw();
    }
  }
}

class Game {
  map = {};
  freeCells = [];
  window = null;
  display = null;
  engine = null;
  player = null;
  enemies = null;
  ananas = null;

  constructor(container, window) {
    RNG.setSeed(Math.random());
    this.window = window;

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
    this.display = new Display({
      bg: 'black',
      fg: 'white',
      width: mapWidth,
      height: mapHeight,
      fontSize: 16
    });
    container.appendChild(this.display.getContainer());
  }

  _initActors() {
    this.player = new Player(this.window, this.display, this.map);
    this.enemies = [
      new Pedro(this.window, this.display, this.map, this.player),
      new Pedro(this.window, this.display, this.map, this.player),
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
      this.display.draw(x, y, this.map[key]);
    }
  }

  _initEngine() {
    const scheduler = new Scheduler.Simple();

    scheduler.add(this.player, true);
    for (const enemy of this.enemies) {
      scheduler.add(enemy, true);
    }

    this.engine = new Engine(scheduler);
    this.player.setEngine(this.engine);
    for (const enemy of this.enemies) {
      enemy.setEngine(this.engine);
    }

    this.engine.start();
  }
}

export { Game as default }
