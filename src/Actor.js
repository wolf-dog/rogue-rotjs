import Being from './Being.js';

class Actor extends Being {
  engine = null;

  fovRadius = 10;

  act() {
  }

  setEngine(engine) {
    this.engine = engine;
  }
}

export { Actor as default }
