import Colors from './static/Colors.js';

class Being {
  display = null;
  level = null;

  x = null;
  y = null;

  constructor(display, level) {
    this.display = display;
    this.level = level;
  }

  place(x, y) {
    this.x = x;
    this.y = y;
  }

  exists(x, y) {
    if (this.x === x && this.y === y) {
      return true;
    }
    return false;
  }

  draw() {
    this.display.draw(
      this.x,
      this.y,
      this._getCharacter(),
      this._getForeground(),
      this._getBackground()
    );
  }

  _getCharacter() {
    return '';
  }

  _getForeground() {
    return Colors.defaultForeGround;
  }

  _getBackground() {
    return Colors.defaultBackGround;
  }
}

export { Being as default }
