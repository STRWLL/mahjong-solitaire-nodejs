import {
  DiscardPile,
} from './pile.js';

import {
  Hand,
} from './hand.js'

/**
 * @import {
 *  DrawPile,
 * } from './pile.js';
 * @import {
 *  Hand,
 * } from './hand.js';
 */

export class Player {
  #drawPile;
  #discardPile;
  #hand;
  #drawnCount = 0;
  #drawnCountAfterLastKan = 0;
  #kanCombo = 0;

  /**
   * @param {DrawPile} drawPile 
   */
  constructor(drawPile) {
    this.#drawPile = drawPile;
    this.#discardPile = new DiscardPile();
    this.#hand = Hand.createFromDrawPile(drawPile);
  }

  /**
   * @returns {Boolean} done
   */
  draw() {
    const drawn = this.#drawPile.shift();
    if (!drawn) return false;
    this.#hand.add(drawn);
    this.#hand.markLastDrawn(drawn);
    this.#drawnCount++;
    if (this.#hand.quads.length > 0) {
      this.#drawnCountAfterLastKan++;
    }
    return true;
  }

  /**
   * @param {int} index
   */
  discard(index) {
    this.#discardPile.add(this.#hand.remove(index));
  }

  /**
   * @param {Tile} tile
   */
  kan(tile) {
    this.#hand.kan(tile);
    if (this.#drawnCountAfterLastKan === 1) {
      this.#kanCombo++;
    } else {
      this.#kanCombo = 1;
    }
    this.#drawnCountAfterLastKan = 0;
  }

  /**
   * @returns {Hand}
   */
  get hand() {
    return this.#hand;
  }

  /**
   * @returns {DrawPile}
   */
  get drawPile() {
    return this.#drawPile;
  }

  /**
   * @returns {DiscardPile}
   */
  get discardPile() {
    return this.#discardPile;
  }

  /**
   * @returns {int}
   */
  get drawnCount() {
    return this.#drawnCount;
  }

  /**
   * @returns {int}
   */
  get drawnCountAfterLastKan() {
    return this.#drawnCountAfterLastKan;
  }

  /**
   * @returns {int}
   */
  get kanCombo() {
    return this.#kanCombo;
  }
}
