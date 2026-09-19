import {
  amber,
  Color,
  electron,
  gray,
  lavender,
  water,
} from './color.js';

/**
 * @import {
 *  Tile
 * } from './tile.js';
 */

export class Choice {
  #label;
  #description;
  #tile;
  #enabled = true;

  constructor(label, description, tile) {
    this.#label = label;
    this.#description = description;
    this.#tile = tile;
  }

  /**
   * @returns {String}
   */
  get description() {
    return this.#description;
  }

  /**
   * @returns {Tile}
   */
  get tile() {
    return this.#tile;
  }

  toString() {
    return this.#label;
  }

  enable() {
    this.#enabled = true;
    return this;
  }

  disable() {
    this.#enabled = false;
    return this;
  }

  /**
   * @param {Boolean} selected
   * @returns {String}
   */
  getCursorBox(selected) {
    const surrounded = Color.applyAll(
      (
        this.#enabled
        ? (selected ? '-' : ' ')
        : '/'
      ).repeat(Color.remove(this.toString()).length - 2),
      this.#enabled ? electron : gray,
    );
    return `[${surrounded}]`;
  }
}

export class Discard extends Choice {
  /**
   * @param {Tile} tile
   */
  constructor(tile) {
    super(
      String(tile),
      `discarding: ${tile}`,
      tile,
    );
  }
}

export class ChoiceMetadata {
  #choice;
  #originalIndex;
  /**
   * @param {Choice} choice 
   * @param {int} originalIndex 
   */
  constructor(choice, originalIndex) {
    this.#choice = choice;
    this.#originalIndex = originalIndex;
  }
  /**
   * @returns {Choice}
   */
  get choice() {
    return this.#choice;
  }
  /**
   * @returns {int}
   */
  get originalIndex() {
    return this.#originalIndex;
  }
  /**
   * @param {ChoiceMetadata[]} choiceMetadataList
   * @param {int} choosenIndex
   * @returns {String[]}
   */
  static getCursorBoxes(choiceMetadataList, choosenIndex) {
    return choiceMetadataList.map((cm) => {
      return cm.choice.getCursorBox(cm.originalIndex === choosenIndex);
    });
  }
}

export class Reach extends Choice {
  /**
   * @param {Tile} tile
   */
  constructor(tile) {
    super(
      `${Color.applyAll('RCH', water)} ${tile.toString()}`,
      `reach by discarding: ${tile}`,
      tile,
    );
  }
}

export class Finish extends Choice {
  constructor() {
    super(
      Color.applyAll('FIN', amber),
      'finishing with this hand',
    );
  }
}

export class Kan extends Choice {
  /**
   * @param {Tile} tile
   */
  constructor(tile) {
    super(
      `${Color.applyAll('KAN', lavender)} ${tile.toString()}`,
      `kan: ${tile}`,
      tile,
    );
  }
}
