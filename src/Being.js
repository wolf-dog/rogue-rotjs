import Colors from './Colors.js';

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
      this.getCharacter(),
      this.getForeground(),
      this.getBackground()
    );
  }

  getCharacter() {
    return '';
  }

  getForeground() {
    return Colors.defaultForeGround;
  }

  getBackground() {
    return Colors.defaultBackGround;
  }
}

export { Being as default }
