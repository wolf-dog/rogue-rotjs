import { DIRS } from '../../node_modules/rot-js/lib/index.js';
import Actor from './Actor.js';

class Player extends Actor {

  window = null;

  constructor(window, display, level) {
    super(display, level);

    this.window = window;
  }

  act() {
    this.engine.lock();
    this.window.addEventListener('keydown', this);
  }

  handleEvent(event) {
    const code = event.keyCode;

    switch (code) {
      case Player.keyCodeInspect:
        this._checkBox();
        return;
      case Player.keyCodeWait:
        this._wait();
        return;
    }

    if (code in Player.movingKeyMap) {
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
    const newX = this.x + Player.movingKeyMap[code][0];
    const newY = this.y + Player.movingKeyMap[code][1];
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

  _getCharacter() {
    return '@';
  }

  _getForeground() {
    return 'yellow';
  }
}

Player.keyCodeInspect = 32;
Player.keyCodeWait = 190;
Player.movingKeyMap = {
  72: DIRS[8][6],
  74: DIRS[8][4],
  75: DIRS[8][0],
  76: DIRS[8][2],
  89: DIRS[8][7],
  85: DIRS[8][1],
  78: DIRS[8][5],
  77: DIRS[8][3],
};

export { Player as default }
