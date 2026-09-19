import {
  TILE_DUPLICATION,
} from './constants.js'

import {
  Color,
  rose,
  leaf,
  cerulean,
} from './color.js';

/**
 * @typedef {int} TileDefId
 * @typedef {int} TilePoolId
 */

export class Tile {
  #def;
  /**
   * @param {TileDefinition} def
   */
  constructor(def) {
    this.#def = def;
  }

  /**
   * @returns {TileDefinition}
   */
  get def() {
    return this.#def;
  }

  /**
   * @returns {String}
   */
  toString() {
    return this.#def.label;
  }

  /**
   * @param {Tile[]} tiles
   * @return {String}
   */
  static serialize(tiles) {
    return tiles.map((tile) => tile.def.id).join('-');
  }
}

export class TileDefinition {
  #orderBase;
  #order;
  #id;
  #label;
  #text;
  #duplication;
  static #table = new Map();

  /**
   * @param {int} orderBase
   * @param {int} order
   * @param {String} label
   * @param {int?} duplication
   */
  constructor(
    orderBase,
    order,
    label,
    text,
    duplication = TILE_DUPLICATION,
  ) {
    this.#orderBase = orderBase;
    this.#order = order;
    this.#id = this.#orderBase * TileDefinition.orderBaseIdOffset + this.#order;
    if (TileDefinition.get(this.#id)) {
      throw new Error(`duplicated id ${id}`);
    }
    this.#label = label;
    this.#text = text;
    this.#duplication = duplication;
    TileDefinition.#table.set(this.#id, this);
  }

  /**
   * @returns {int}
   */
  static get orderBaseIdOffset() {
    return 100;
  }

  /**
   * @returns {int}
   */
  get orderBase() {
    return this.#orderBase;
  }

  /**
   * @returns {int}
   */
  get order() {
    return this.#order;
  }

  /**
   * @returns {TileDefId}
   */
  get id() {
    return this.#id;
  }

  /**
   * @returns {String}
   */
  get label() {
    return this.#label;
  }

  /**
   * @returns {String}
   */
  get text() {
    return this.#text;
  }

  /**
   * @returns {String}
   */
  toString() {
    return this.#label;
  }

  /**
   * @param {TileDefId} id
   * @returns {TileDefinition}
   */
  static get(id) {
    return TileDefinition.#table.get(id);
  }

  /**
   * @returns {Tile[]}
   */
  createTiles() {
    return new Array(this.#duplication)
      .fill(null)
      .map(() => new Tile(this));
  }
}

// 順子を作れるかどうかを
// id が隣接する牌が定義されているかどうかで判定しているため、
// 数牌の id は 1 区切り
// 字牌の id は 10 区切りとし、
// クラスタの異なる牌同士の id は 100 単位で隔離する

// id 1~: 萬子
export const unitTileDefinitions = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
].map((order) => {
  return new TileDefinition(
    0,
    order,
    Color.apply(`$${order}$`, rose, Color.defaultFore, rose),
    `${order}萬`,
  );
});

// id 101~: 筒子
export const coinTileDefinitions = [
  [1, cerulean, rose, cerulean],
  [2, cerulean, cerulean, cerulean],
  [3, cerulean, rose, cerulean],
  [4, cerulean, cerulean, cerulean],
  [5, cerulean, rose, cerulean],
  [6, cerulean, rose, cerulean],
  [7, cerulean, rose, cerulean],
  [8, cerulean, cerulean, cerulean],
  [9, cerulean, rose, cerulean],
].map(([order, ...colors]) => {
  return new TileDefinition(
    1,
    order,
    Color.apply(`*${order}*`, ...colors),
    `${order}筒`,
  );
});

// id 201~: 索子
export const bambooTileDefinitions = [
  [1, leaf, rose, leaf],
  [2, leaf, leaf, leaf],
  [3, leaf, leaf, leaf],
  [4, leaf, leaf, leaf],
  [5, leaf, rose, leaf],
  [6, leaf, leaf, leaf],
  [7, leaf, rose, leaf],
  [8, leaf, leaf, leaf],
  [9, leaf, rose, leaf],
].map(([order, ...colors]) => {
  return new TileDefinition(
    2,
    order,
    Color.apply(`!${order}!`, ...colors),
    `${order}索`,
  );
});

// id 310~: 風牌
export const windTileDefinitions = [
  [10, 'TON', '東'],
  [20, 'NAN', '南'],
  [30, 'XIA', '西'],
  [40, 'PEI', '北'],
].map(([order, label, text]) => {
  return new TileDefinition(
    3,
    order,
    Color.applyAll(label, cerulean),
    text,
  );
});

// id 410~: 三元牌
export const dragonTileDefinitions = [
  [10, '[ ]', Color.defaultFore, '白'],
  [20, '[#]', leaf, '發'],
  [30, '[@]', rose, '中'],
].map(([order, label, middleColor, text]) => {
  return new TileDefinition(
    4,
    order,
    Color.apply(label, Color.defaultFore, middleColor, Color.defaultFore),
    text,
  );
});

export const honorTileDefinitions = [
  ...windTileDefinitions,
  ...dragonTileDefinitions,
];

export const terminalTileDefinitions = [
  ...unitTileDefinitions,
  ...coinTileDefinitions,
  ...bambooTileDefinitions,
].filter((def) => [1, 9].includes(def.id % 10));

export const allTileDefinitions = [
  ...unitTileDefinitions,
  ...coinTileDefinitions,
  ...bambooTileDefinitions,
  ...windTileDefinitions,
  ...dragonTileDefinitions,
];

export const allTiles = allTileDefinitions.flatMap((def) => def.createTiles());
