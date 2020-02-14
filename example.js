import { DIRS, Display, Engine, Map, RNG, Scheduler, Util } from "./node_modules/rot-js/lib/index.js";

const mapWidth = 100;
const mapHeight = 30;
const numOfBoxes = 10;

const Player = {
  x: null,
  y: null,

  create() {
    return this;
  },

  place(x, y) {
    this.x = x;
    this.y = y;
  },

  draw(display) {
    display.draw(this.x, this.y, '@', 'yellow');
  },
}

const User = {
  player: null,
  window: null,
  keyMap: {
    72: DIRS[8][6],
    74: DIRS[8][4],
    75: DIRS[8][0],
    76: DIRS[8][2],
    89: DIRS[8][7],
    85: DIRS[8][1],
    78: DIRS[8][5],
    77: DIRS[8][3],
  },

  create(player, window) {
    this.player = player;
    this.window = window;

    return this;
  },

  act() {
    Game.engine.lock();
    this.window.addEventListener('keydown', this);
  },

  handleEvent(event) {
    const code = event.keyCode;

    if (!(code in this.keyMap)) {
      return;
    }

    let newX = this.player.x + this.keyMap[code][0];
    let newY = this.player.y + this.keyMap[code][1];
    let newKey = newX + ',' + newY;
    if (!(newKey in Game.map)) {
      return;
    }

    Game.display.draw(this.player.x, this.player.y, Game.map[this.player.x + ',' + this.player.y]);
    this.player.x = newX;
    this.player.y = newY;
    this.player.draw(Game.display);
    this.window.removeEventListener('keydown', this);
    Game.engine.unlock();
  },
}

const Game = {
  display: null,
  map: {},
  player: null,
  engine: null,

  init(container, window) {
    RNG.setSeed(Math.random());

    this._initPlayer(window);
    this._initDisplay(container);
    this._generateMap();
    this._initEngine();
  },

  _initEngine() {
    const scheduler = new Scheduler.Simple();
    scheduler.add(
      User.create(this.player, window),
      true
    );

    this.engine = new Engine(scheduler);
    this.engine.start();
  },

  _initPlayer() {
    this.player = Player.create();
  },

  _initDisplay(container) {
    this.display = new Display({
      bg: 'black',
      fg: 'white',
      width: mapWidth,
      height: mapHeight,
      fontSize: 16
    });
    container.appendChild(this.display.getContainer());
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
    }
  },

  _createPlayer(freeCells) {
    const index = Math.floor(RNG.getUniform() * freeCells.length);
    const key = freeCells.splice(index, 1)[0];
    const parts = key.split(',');
    const x = parseInt(parts[0]);
    const y = parseInt(parts[1]);
    this.player.place(x, y);
    this.player.draw(this.display);
  },

  _drawWholeMap() {
    for (let key in this.map) {
      const parts = key.split(',');
      const x = parseInt(parts[0]);
      const y = parseInt(parts[1]);
      this.display.draw(x, y, this.map[key]);
    }
  },
}

export { Game as default }
