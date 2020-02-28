class Terrain {
  constructor() {
  }

  getCharacter() {
    return '';
  }

  getForeground() {
    return 'white'
  }

  getBackground() {
    return 'black'
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
    return 'grey'
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
    return 'green'
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
    return 'brown'
  }
}

export { Floor, Box, Wall }
