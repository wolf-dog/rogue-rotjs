import { DIRS } from "../node_modules/rot-js/lib/index.js";

class Player {
  keyCodeInspect = 32;
  keyCodeWait = 190;

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

    switch (code) {
      case this.keyCodeInspect:
        this._checkBox();
        return;
      case this.keyCodeWait:
        this._wait();
        return;
    }

    if (code in this.movingKeyMap) {
      this._move(code);
    }
  }

  _checkBox() {
    if (this.level.getTerrain(this.x, this.y).constructor.name !== 'Box') {
      this.window.alert('There is no box here!');
      return;
    }

    if (this.level.hasAnanas(this.x, this.y)) {
      this.window.alert('You Found an ananas and won this game!!');
      this.window.removeEventListener('keydown', this);
    } else {
      this.window.alert('This box is empty.');
      this._resolve();
    }
  }

  _wait() {
    this._resolve();
  }

  _move(code) {
    let newX = this.x + this.movingKeyMap[code][0];
    let newY = this.y + this.movingKeyMap[code][1];
    if (!this.level.isTerrainPassable(newX, newY)) {
      return;
    }

    const terrain = this.level.getTerrain(this.x, this.y);
    this.display.draw(
      this.x,
      this.y,
      terrain.getCharacter(),
      terrain.getForeground(),
      terrain.getBackground()
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

export { Player as default }
