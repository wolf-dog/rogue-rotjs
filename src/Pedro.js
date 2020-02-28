import { Path } from "../node_modules/rot-js/lib/index.js";


class Pedro {
  window = null;
  display = null;
  level = null;
  player = null;

  engine = null;

  x = null;
  y = null;

  constructor(window, display, level, player) {
    this.window = window;
    this.display = display;
    this.level = level;
    this.player = player;
  }

  setEngine(engine) {
    this.engine = engine;
  }

  place(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    this.display.draw(this.x, this.y, 'P', 'red');
  }

  act() {
    const passableCallback = function(x, y) {
      return this.level.isTerrainPassable(x, y);
    }.bind(this);
    const astar = new Path.AStar(this.player.x, this.player.y, passableCallback, {topology: 8});

    let path = [];
    const pathCallback = function(x, y) {
      path.push([x, y]);
    }

    astar.compute(this.x, this.y, pathCallback);

    path.shift();
    if (path.length <= 1) {
      this.engine.lock();
      this.window.alert('Game Over!!!');
    } else {
      const newX = path[0][0];
      const newY = path[0][1];
      const terrain = this.level.getTerrain(this.x, this.y);
      this.display.draw(
        this.x,
        this.y,
        terrain.getCharacter(),
        terrain.getForeground(),
        terrain.getBackground()
      );
      this.x = newX;
      this.y = newY;
      this.draw();
    }
  }
}

export { Pedro as default }
