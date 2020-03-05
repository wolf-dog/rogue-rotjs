import Enemy from './Enemy.js';

class Hound extends Enemy {
  fovRadius = 20;

  _isSpottingPlayer() {
    const spotting = super._isSpottingPlayer();
    if (spotting) {
      this.spotting = true;
      this.player.spot();
      console.log('bow wow!');
    } else {
      this.spotting = false;
    }

    return spotting
  }

  _attack() {
  }

  _getCharacter() {
    return 'H';
  }
}

export { Hound as default }
