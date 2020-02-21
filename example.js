import { DIRS, Display, Engine, Map, Path, RNG, Scheduler, Util } from "./node_modules/rot-js/lib/index.js";


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

  window = null;
  display = null;
  level = null;

  engine = null;

  x = null;
  y = null;

  constructor(window, display, level) {
    this.window = window;
    this.display = display;
    this.level = level;
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
    if (this.level.getTerrain(this.x, this.y) !== '*') {
      this.window.alert('There is no box here!');
    } else if (this.level.hasAnanas(this.x, this.y)) {
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
    if (!this.level.exists(newX, newY)) {
      return;
    }

    this.display.draw(
      this.x,
      this.y,
      this.level.getTerrain(this.x, this.y)
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
  window = null;
  display = null;
  level = null;
  player = null;

  engine = null;

  x = null;
  y = null;

  constructor(window, display, level, player) {
    this.window = window;
    this.display = display;
    this.level = level;
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
      return this.level.exists(x, y);
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
      this.display.draw(this.x, this.y, this.level.getTerrain(this.x, this.y));
      this.x = newX;
      this.y = newY;
      this.draw();
    }
  }
}

class Level {
  terrain = {};
  freeCells = [];
  ananas = null;

  constructor() {
  }

  exists(x, y) {
    return Level.key(x, y) in this.terrain;
  }

  isVisibleWall(x, y) {
    if (this.exists(x, y)) {
      return false;
    }

    if (this.exists(x- 1, y - 1)
      || this.exists(x - 1, y)
      || this.exists(x - 1, y + 1)
      || this.exists(x, y - 1)
      || this.exists(x, y + 1)
      || this.exists(x + 1, y - 1)
      || this.exists(x + 1, y)
      || this.exists(x + 1, y + 1)
    ) {
      return true;
    }

    return false;
  }

  getTerrain(x, y) {
    if (this.exists(x, y)) {
      return this.terrain[Level.key(x, y)];
    }

    if (this.isVisibleWall(x, y)) {
      return '#';
    }

    return '';
  }

  setTerrain(x, y, content) {
    this.terrain[Level.key(x, y)] = content;
  }

  setFloor(x, y) {
    this.setTerrain(x, y, '.');
  }

  setBox(x, y) {
    this.setTerrain(x, y, '*');
  }

  hasAnanas(x, y) {
    return Level.key(x, y) === this.ananas;
  }

  setAnanas(x, y) {
    this.ananas = Level.key(x, y);
  }

  getFreeCells() {
    return this.freeCells;
  }

  spliceFreeCells(index) {
    return Level.partKey(this.freeCells.splice(index, 1)[0]);
  }

  pushIntoFreeCells(x, y) {
    this.freeCells.push(Level.key(x, y));
  }

  static key(x, y) {
    return `${x},${y}`;
  }

  static partKey(key) {
    const parts = key.split(',');
    return {
      x: parseInt(parts[0]),
      y: parseInt(parts[1]),
    }
  }
}

class Game {
  levelWidth = 100;
  levelHeight = 30;
  numOfBoxes = 10;

  level = null;
  window = null;
  display = null;
  engine = null;
  player = null;
  enemies = null;

  constructor(container, window) {
    RNG.setSeed(Math.random());
    this.window = window;
    this.level = new Level();

    this._initDisplay(container);
    this._generateLevel();

    this._initActors();
    this._placeActor(this.player, this.level);
    for (const enemy of this.enemies) {
      this._placeActor(enemy, this.level);
    }

    this._initEngine();
  }

  _initDisplay(container) {
    this.display = new Display({
      bg: 'black',
      fg: 'white',
      width: this.levelWidth,
      height: this.levelHeight,
      fontSize: 16
    });
    container.appendChild(this.display.getContainer());
  }

  _initActors() {
    this.player = new Player(this.window, this.display, this.level);
    this.enemies = [
      new Pedro(this.window, this.display, this.level, this.player),
      new Pedro(this.window, this.display, this.level, this.player),
    ];
  }

  _generateLevel() {
    const digger = new Map.Digger(this.levelWidth, this.levelHeight, {
      roomWidth: [3, 15],
      roomHeight: [3, 9],
      dugPercentage: [0.3],
    });

    digger.create((x, y, contents) => {
      if (contents === 1) {
        return;
      }

      this.level.setFloor(x, y);
      this.level.pushIntoFreeCells(x, y);
    });

    this._generateBoxes(this.level);
    this._drawWholeLevel();
  }

  _generateBoxes(level) {
    for (let i = 0; i < this.numOfBoxes; i++) {
      const index = Math.floor(RNG.getUniform() * level.getFreeCells().length);
      const coordinates = level.spliceFreeCells(index)
      this.level.setBox(coordinates.x, coordinates.y);

      if (i === 0) {
        this.level.setAnanas(coordinates.x, coordinates.y);
      }
    }
  }

  _placeActor(actor, level) {
    const index = Math.floor(RNG.getUniform() * level.getFreeCells().length);
    const coordinates = level.spliceFreeCells(index);
    actor.place(coordinates.x, coordinates.y);
    actor.draw();
  }

  _drawWholeLevel() {
    for (let x = 0; x < this.levelWidth; x++) {
      for (let y = 0; y < this.levelHeight; y++) {
        this.display.draw(x, y, this.level.getTerrain(x, y));
      }
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
