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
}

class Hollow extends Terrain {
  getCharacter() {
    return '';
  }
}

class Floor extends Terrain {
  getCharacter() {
    return '.';
  }

  getForeground() {
    return 'grey'
  }
}

class Box extends Terrain {
  getCharacter() {
    return '*';
  }

  getForeground() {
    return 'green'
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

export { Hollow, Floor, Box, Wall }
