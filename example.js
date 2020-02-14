import { Display, Map, RNG, Util } from "./node_modules/rot-js/lib/index.js";

let Game = {
  display: null,
  map: {},

  init: function(container) {
    RNG.setSeed(Math.random());

    this._initDisplay(container);
    this._generateMap();
  },

  _generateMap: function() {
    let digger = new Map.Digger(100, 30);
    let freeCells = [];

    let digCallback = function(x, y, contents) {
      if (contents) {
        return;
      }

      let key = x + ',' + y;
      this.map[key] = '.';
      freeCells.push(key);
    }
    digger.create(digCallback.bind(this));

    this._generateBoxes(freeCells);
    this._drawWholeMap();
  },

  _generateBoxes: function(freeCells) {
    for (let i = 0; i < 10; i++) {
      let index = Math.floor(RNG.getUniform() * freeCells.length);
      let key = freeCells.splice(index, 1)[0];
      this.map[key] = '*';
    }
  },

  _drawWholeMap: function() {
    for (var key in this.map) {
      let parts = key.split(',');
      let x = parseInt(parts[0]);
      var y = parseInt(parts[1]);
      this.display.draw(x, y, this.map[key]);
    }
  },

  _initDisplay: function(container) {
    this.display = new Display({
      bg: 'black',
      fg: 'white',
      width: 100,
      height: 30,
      fontSize: 16
    });
    container.appendChild(this.display.getContainer());
  }
}

export { Game as default }
