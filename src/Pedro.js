import { Path } from '../node_modules/rot-js/lib/index.js';
import Enemy from './Enemy.js';

class Pedro extends Enemy {
  getCharacter() {
    return 'P';
  }

  getForeground() {
    return 'red';
  }

  getBackground() {
    return 'black';
  }
}

export { Pedro as default }
