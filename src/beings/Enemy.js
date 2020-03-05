import { FOV, Path, RNG } from '../../node_modules/rot-js/lib/index.js';
import Actor from './Actor.js';

class Enemy extends Actor {
  window = null;
  player = null;

  lastPlayerPosition = null;

  constructor(window, display, level, player) {
    super(display, level);

    this.window = window;
    this.player = player;
  }

  act() {
    if (this._isSpottingPlayer()) {
      this._chasePlayer();
    } else {
      this._trackPlayersLastPosition();
    }
  }

  _isSpottingPlayer() {
    const lightPassesCallback = function(x, y) {
      return this.level.isTerrainPassable(x, y);
    }.bind(this);
    const fov = new FOV.PreciseShadowcasting(lightPassesCallback);

    let isSpottingPlayer = false;
    fov.compute(this.x, this.y, this.fovRadius, function(x, y, r, visibility) {
      if (this.player.exists(x, y)) {
        isSpottingPlayer = true;
      }
    }.bind(this));

    return isSpottingPlayer;
  }

  _chasePlayer() {
    this._memorizePlayersPosition();
    const path = this._getPath(this.player.x, this.player.y);

    if (path.length <= 1) {
      this._gameOver();
    } else {
      this._move(path[0][0], path[0][1]);
    }
  }

  _trackPlayersLastPosition() {
    if (this.lastPlayerPosition === null) {
      this._wander();
      return;
    }

    const path = this._getPath(this.lastPlayerPosition[0], this.lastPlayerPosition[1]);
    if (path.length === 0) {
      this.lastPlayerPosition = null;
      this._wander();
    } else {
      this._move(path[0][0], path[0][1]);
    }
  }

  _memorizePlayersPosition() {
    this.lastPlayerPosition = [this.player.x, this.player.y];
  }

  _wander() {
    const candidates = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const toX = this.x + x;
        const toY = this.y + y;
        if (this.level.isTerrainPassable(toX, toY)) {
          candidates.push([toX, toY]);
        }
      }
    }

    if (candidates.length === 0) {
      return;
    }

    const dest = candidates.splice(
      Math.floor(RNG.getUniform() * candidates.length),
      1
    );

    this._move(dest[0][0], dest[0][1]);
  }

  _getPath(toX, toY) {
    const passableCallback = function(x, y) {
      return this.level.isTerrainPassable(x, y);
    }.bind(this);
    const astar = new Path.AStar(toX, toY, passableCallback);

    const path = [];
    const pathCallback = function(x, y) {
      path.push([x, y]);
    }

    astar.compute(this.x, this.y, pathCallback);

    path.shift();
    return path;
  }

  _move(toX, toY) {
    if (this.level.getEnemy(toX, toY)) {
      return;
    }

    const terrain = this.level.getTerrain(this.x, this.y);
    this.display.draw(
      this.x,
      this.y,
      terrain.getCharacter(),
      terrain.getForeground(),
      terrain.getBackground()
    );
    this.x = toX;
    this.y = toY;
    this.draw();
  }

  _gameOver() {
    this.engine.lock();
    this.window.alert('Game Over!!!');
  }
}

export { Enemy as default }
