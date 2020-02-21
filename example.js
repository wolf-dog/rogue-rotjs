import { DIRS, Display, Engine, Map, RNG, Scheduler, Util } from "./node_modules/rot-js/lib/index.js";

const mapWidth = 100;
const mapHeight = 30;
const numOfBoxes = 10;

let display = null;
let window = null;
let engine = null;

const Player = {
  movingKeyMap: {
    72: DIRS[8][6],
    74: DIRS[8][4],
    75: DIRS[8][0],
    76: DIRS[8][2],
    89: DIRS[8][7],
    85: DIRS[8][1],
    78: DIRS[8][5],
    77: DIRS[8][3],
  },

  x: null,
  y: null,

  create() {
    return this;
  },

  place(x, y) {
    this.x = x;
    this.y = y;
  },

  draw() {
    display.draw(this.x, this.y, '@', 'yellow');
  },

  act() {
    engine.lock();
    window.addEventListener('keydown', this);
  },

  handleEvent(event) {
    const code = event.keyCode;

    if (code === 32) {
      this._checkBox();
      return;
    }

    this._move(code);
  },

  _checkBox() {
    let key = this.x + ',' + this.y;
    if (Game.map[key] !== '*') {
      window.alert('There is no box here!');
    } else if (key === Game.ananas) {
      window.alert('You Found an ananas and won this game!!');
      window.removeEventListener('keydown', this);
    } else {
      window.alert('This box is empty.');
    }
  },

  _move(code) {
    if (!(code in this.movingKeyMap)) {
      return;
    }

    let newX = this.x + this.movingKeyMap[code][0];
    let newY = this.y + this.movingKeyMap[code][1];
    let newKey = newX + ',' + newY;
    if (!(newKey in Game.map)) {
      return;
    }

    display.draw(
      this.x,
      this.y,
      Game.map[this.x + ',' + this.y]
    );
    this.x = newX;
    this.y = newY;
    this.draw();
    this._resolve();
  },

  _resolve() {
    window.removeEventListener('keydown', this);
    engine.unlock();
  },
}

const Game = {
  map: {},
  player: null,
  ananas: null,

  init(container, browserWindow) {
    RNG.setSeed(Math.random());
    window = browserWindow;

    this._initDisplay(container);
    this._initPlayer();
    this._generateMap();
    this._initEngine();
  },

  _initDisplay(container) {
    display = new Display({
      bg: 'black',
      fg: 'white',
      width: mapWidth,
      height: mapHeight,
      fontSize: 16
    });
    container.appendChild(display.getContainer());
  },

  _initPlayer() {
    this.player = Player.create(display);
  },

  _generateMap() {
    const digger = new Map.Digger(mapWidth, mapHeight, {
      roomWidth: [3, 15],
      roomHeight: [3, 9],
      dugPercentage: [0.3],
    });
    const freeCells = [];

    digger.create((x, y, contents) => {
      if (contents === 1) {
        return;
      }

      const key = `${x},${y}`;
      this.map[key] = '.';
      freeCells.push(key);
    });

    this._generateBoxes(freeCells);
    this._drawWholeMap();
    this._createPlayer(freeCells);
  },

  _generateBoxes(freeCells) {
    for (let i = 0; i < numOfBoxes; i++) {
      const index = Math.floor(RNG.getUniform() * freeCells.length);
      const key = freeCells.splice(index, 1)[0];
      this.map[key] = '*';

      if (i === 0) {
        this.ananas = key;
      }
    }
  },

  _createPlayer(freeCells) {
    const index = Math.floor(RNG.getUniform() * freeCells.length);
    const key = freeCells.splice(index, 1)[0];
    const parts = key.split(',');
    const x = parseInt(parts[0]);
    const y = parseInt(parts[1]);
    this.player.place(x, y);
    this.player.draw();
  },

  _drawWholeMap() {
    for (let key in this.map) {
      const parts = key.split(',');
      const x = parseInt(parts[0]);
      const y = parseInt(parts[1]);
      display.draw(x, y, this.map[key]);
    }
  },

  _initEngine() {
    const scheduler = new Scheduler.Simple();
    scheduler.add(
      Player.create(),
      true
    );

    engine = new Engine(scheduler);
    engine.start();
  },
}

export { Game as default }
