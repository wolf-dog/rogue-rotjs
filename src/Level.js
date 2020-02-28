class Level {
  width = 100;
  height = 30;

  terrain = {};
  freeCells = [];
  ananas = null;

  player = null;
  enemies = null;

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

export { Level as default }
