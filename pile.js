import {
  LF,
  INDENT,
  DISCARD_PILE_INLINE_LENGTH,
  DRAW_COUNT,
} from './constants.js';

import {
  shuffleArray,
  splitArray,
} from './array-utils.js';

import {
  allTiles,
} from './tile.js';

import {
  Hand,
} from './hand.js';

/**
 * @import {
 *  Tile,
 * } from './tile.js';
 */

export class DrawPile {
  #contents;
  /**
   * @param {Tile[]?} tiles
   */
  constructor(tiles = allTiles, shuffle = true) {
    const length = Hand.defaultLength + DRAW_COUNT;
    if (shuffle) {
      this.#contents = shuffleArray(tiles, length);
      return;
    }
    this.#contents = tiles.slice(0, length);
  }
  /**
   * @returns {Tile}
   */
  shift() {
    return this.#contents.shift();
  }
  /**
   * @returns {Tile[]}
   */
  get contents() {
    return this.#contents;
  }

  /**
   * @returns {Number}
   */
  get length() {
    return this.contents.length;
  }
}

export class DiscardPile {
  #contents;
  constructor() {
    this.#contents = [];
  }
  /**
   * @param {Tile} tile 
   */
  add(tile) {
    this.#contents.push(tile);
  }
  /**
   * @returns {Tile[]}
   */
  get contents () {
    return this.#contents;
  }

  /**
   * @returns {Number}
   */
  get length() {
    return this.contents.length;
  }

  /**
   * @returns {Tile[][]}
   */
  get split() {
    return splitArray(
      this.#contents,
      DISCARD_PILE_INLINE_LENGTH,
    );
  }

  /**
   * @returns 
   */
  toString() {
    const header = 'discarded:';
    if (this.length === 0) return header + LF + INDENT + 'none';
    const split = splitArray(
      this.#contents,
      DISCARD_PILE_INLINE_LENGTH,
    );
    const lines = split.map((part) => {
      return INDENT + part.map(String).join(' ');
    });
    return header + LF + lines.join(LF);
  }
}
