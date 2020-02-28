import { Floor, Box, Wall } from "./Terrain.js";

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

  isTerrainPassable(x, y) {
    const terrain = this.getTerrain(x, y);

    if (terrain === null) {
      return false;
    }
    return terrain.isPassable();
  }

  getTerrain(x, y) {
    const key = Level.key(x, y);
    if (key in this.terrain) {
      return this.terrain[key];
    }

    return null;
  }

  setTerrain(x, y, terrain) {
    this.terrain[Level.key(x, y)] = terrain;
  }

  setFloor(x, y) {
    this.setTerrain(x, y, new Floor());
  }

  setBox(x, y) {
    this.setTerrain(x, y, new Box());
  }

  setWall(x, y) {
    this.setTerrain(x, y, new Wall());
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
