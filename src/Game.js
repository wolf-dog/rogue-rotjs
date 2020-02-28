import { Display, Engine, Map, RNG, Scheduler, Util } from "../node_modules/rot-js/lib/index.js";
import Level from "./Level.js";
import Player from "./Player.js";
import Pedro from "./Pedro.js";


class Game {
  numOfBoxes = 10;

  window = null;
  level = null;
  display = null;
  engine = null;

  constructor(container, window) {
    RNG.setSeed(Math.random());

    this.window = window;

    this.level = this._generateLevel();
    this.display = this._initDisplay(container, this.level);
    this._drawWholeLevel(this.display, this.level);

    this.level.player = this._initPlayer(this.window, this.display, this.level);
    this.level.enemies = this._initEnemies(this.window, this.display, this.level, this.level.player);

    this.engine = this._initEngine(this.level.player, this.level.enemies);
  }

  _generateLevel() {
    const level = new Level;
    const digger = new Map.Digger(level.width, level.height, {
      roomWidth: [3, 15],
      roomHeight: [3, 9],
      dugPercentage: [0.3],
    });

    digger.create((x, y, contents) => {
      if (contents === 1) {
        return;
      }

      level.setFloor(x, y);
      level.pushIntoFreeCells(x, y);
    });

    this._generateBoxes(level);

    return level;
  }

  _generateBoxes(level) {
    for (let i = 0; i < this.numOfBoxes; i++) {
      const index = Math.floor(RNG.getUniform() * level.getFreeCells().length);
      const coordinates = level.spliceFreeCells(index)
      level.setBox(coordinates.x, coordinates.y);

      if (i === 0) {
        level.setAnanas(coordinates.x, coordinates.y);
      }
    }
  }

  _initDisplay(container, level) {
    const display = new Display({
      bg: 'black',
      fg: 'white',
      width: level.width,
      height: level.height,
      fontSize: 16
    });
    container.appendChild(display.getContainer());

    return display;
  }

  _drawWholeLevel(display, level) {
    for (let x = 0; x < level.width; x++) {
      for (let y = 0; y < level.height; y++) {
        const terrain = level.getTerrain(x, y);
        display.draw(
          x,
          y,
          terrain.getCharacter(),
          terrain.getForeground(),
          terrain.getBackground()
        );
      }
    }
  }

  _initPlayer(window, display, level) {
    const player = new Player(window, display, level);
    this._placeActor(player, level);

    return player;
  }

  _initEnemies(window, display, level, player) {
    const enemies = [
      new Pedro(window, display, level, player),
      new Pedro(window, display, level, player),
    ];

    for (const enemy of enemies) {
      this._placeActor(enemy, level);
    }

    return enemies;
  }

  _placeActor(actor, level) {
    const index = Math.floor(RNG.getUniform() * level.getFreeCells().length);
    const coordinates = level.spliceFreeCells(index);
    actor.place(coordinates.x, coordinates.y);
    actor.draw();
  }

  _initEngine(player, enemies) {
    const scheduler = new Scheduler.Simple();

    scheduler.add(player, true);
    for (const enemy of enemies) {
      scheduler.add(enemy, true);
    }

    const engine = new Engine(scheduler);
    player.setEngine(engine);
    for (const enemy of enemies) {
      enemy.setEngine(engine);
    }

    engine.start();

    return engine;
  }
}

export { Game as default }
