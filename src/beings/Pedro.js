import Enemy from './Enemy.js';

class Pedro extends Enemy {
  _isSpottingPlayer() {
    if (this.player.isSpotted()) {
      this.spotting = true;
      return true;
    } else {
      return super._isSpottingPlayer();
    }
  }

  _attack() {
    this.engine.lock();
    this.window.alert('Game Over!!!');
  }

  _getCharacter() {
    return 'P';
  }
}

export { Pedro as default }
