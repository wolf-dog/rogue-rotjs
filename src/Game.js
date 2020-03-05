import { Display, Engine, Map, RNG, Scheduler, Util } from "../node_modules/rot-js/lib/index.js";
import Hound from "./beings/Hound.js";
import Pedro from "./beings/Pedro.js";
import Player from "./beings/Player.js";
import Colors from "./static/Colors.js";
import Rules from "./static/Rules.js";
import Level from "./Level.js";


class Game {
  window = null;
  level = null;
  display = null;
  engine = null;

  constructor(container, window) {
    RNG.setSeed(Math.random());

    this.window = window;

    this.level = this._generateLevel();
    this.display = this._initDisplay(container);

    this.level.setPlayer(this._initPlayer(this.window, this.display, this.level));
    this.level.setEnemies(this._initEnemies(this.window, this.display, this.level, this.level.player));

    this._drawWholeLevel(this.display, this.level);

    this.engine = this._initEngine(this.level.getPlayer(), this.level.getEnemies());
  }

  _generateLevel() {
    const level = new Level;
    const digger = new Map.Digger(Rules.levelWidth, Rules.levelHeight, {
      roomWidth: Rules.roomWidth,
      roomHeight: Rules.roomHeight,
      dugPercentage: Rules.dugPercentage,
    });

    digger.create((x, y, contents) => {
      if (contents === 1) {
        level.setWall(x, y);
        return;
      }

      level.setFloor(x, y);
      level.pushIntoFreeCells(x, y);
    });

    this._generateBoxes(level);

    return level;
  }

  _generateBoxes(level) {
    for (let i = 0; i < Rules.numOfBoxes; i++) {
      const index = Math.floor(RNG.getUniform() * level.getFreeCells().length);
      const coordinates = level.spliceFreeCells(index)
      level.setBox(coordinates.x, coordinates.y);

      if (i === 0) {
        level.setAnanas(coordinates.x, coordinates.y);
      }
    }
  }

  _initDisplay(container) {
    const display = new Display({
      bg: Colors.defaultBackGround,
      fg: Colors.defaultForeGround,
      width: Rules.levelWidth,
      height: Rules.levelHeight,
      fontSize: Rules.fontSize
    });
    container.appendChild(display.getContainer());

    return display;
  }

  _drawWholeLevel(display, level) {
    for (let x = 0; x < Rules.levelWidth; x++) {
      for (let y = 0; y < Rules.levelHeight; y++) {
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

    this.level.getPlayer().draw();
    for (const enemy of this.level.getEnemies()) {
      enemy.draw();
    }
  }

  _initPlayer(window, display, level) {
    const player = new Player(window, display, level);
    this._placeActor(player, level);

    return player;
  }

  _initEnemies(window, display, level, player) {
    const enemies = [
      new Hound(window, display, level, player),
      new Hound(window, display, level, player),
      new Hound(window, display, level, player),
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
