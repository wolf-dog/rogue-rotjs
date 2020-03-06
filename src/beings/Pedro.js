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

  _swap(toSwap, toX, toY) {
    toSwap.x = this.x;
    toSwap.y = this.y;
    toSwap.draw();

    this.x = toX;
    this.y = toY;
    this.draw();
  }

  _getCharacter() {
    return 'P';
  }
}

export { Pedro as default }
