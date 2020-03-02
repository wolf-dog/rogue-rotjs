import Being from './Being.js';

class Actor extends Being {
  engine = null;

  setEngine(engine) {
    this.engine = engine;
  }
}

export { Actor as default }
