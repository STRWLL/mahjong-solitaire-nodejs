import {
  amber,
  Color,
  lavender,
  water,
} from './color.js';

/**
 * @import {
 *  Tile
 * } from './tile.js';
 */

export class Choice {
  /**
   * @returns {String}
   */
  get description() {
    return 'I describe about this choice.';
  }

  /**
   * @returns {String}
   */
  toString() {
    return 'SEL';
  }

  /**
   * @param {Boolean} selected
   * @returns {String}
   */
  getCursorBox(selected) {
    const surrounded = selected ? '-' : ' ';
    const chars = new Array(Color.remove(this.toString()).length).fill(surrounded);
    chars.splice(0, 1, '[');
    chars.splice(-1, 1, ']');
    return chars.join('');
  }
}

export class Discard extends Choice {
  #tile;

  /**
   * @param {Tile} tile
   */
  constructor(tile) {
    super();
    this.#tile = tile;
  }

  get tile() {
    return this.#tile;
  }

  get description() {
    return `discarding: ${this.#tile}`;
  }

  toString() {
    return this.#tile.toString();
  }
}

export class Reach extends Choice {
  #tile;

  /**
   * @param {Tile} tile
   */
  constructor(tile) {
    super();
    this.#tile = tile;
  }

  get tile() {
    return this.#tile;
  }

  get description() {
    return `reach by discarding: ${this.#tile}`;
  }

  toString() {
    return `${Color.applyAll('RCH', water)} ${this.#tile.toString()}`;
  }
}

export class Finish extends Choice {
  get description() {
    return 'finishing with this hand';
  }

  toString() {
    return Color.applyAll('FIN', amber);
  }
}

export class Kan extends Choice {
  #tile;

  /**
   * @param {Tile} tile
   */
  constructor(tile) {
    super();
    this.#tile = tile;
  }

  get tile() {
    return this.#tile;
  }

  get description() {
    return `kan: ${this.#tile}`;
  }

  toString() {
    return `${Color.applyAll('KAN', lavender)} ${this.#tile.toString()}`;
  }
}
