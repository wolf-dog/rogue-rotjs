import Colors from './Colors.js';

class Terrain {
  constructor() {
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

  isPassable() {
    return false;
  }
}

class Floor extends Terrain {
  getCharacter() {
    return '.';
  }

  getForeground() {
    return '#444';
  }

  isPassable() {
    return true;
  }
}

class Box extends Terrain {
  getCharacter() {
    return '*';
  }

  getForeground() {
    return 'green';
  }

  isPassable() {
    return true;
  }
}

class Wall extends Terrain {
  getCharacter() {
    return '';
  }

  getBackground() {
    return 'grey';
  }
}

export { Floor, Box, Wall }
