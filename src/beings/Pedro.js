import { Path } from '../../node_modules/rot-js/lib/index.js';
import Enemy from './Enemy.js';

class Pedro extends Enemy {
  _getCharacter() {
    return 'P';
  }

  _getForeground() {
    return 'red';
  }
}

export { Pedro as default }
