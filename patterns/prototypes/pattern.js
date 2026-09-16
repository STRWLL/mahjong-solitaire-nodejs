import { LF } from "../../constants.js";
import {
  allTileDefinitions,
  Tile,
  TileDefinition,
} from "../../tile.js";
import { HandSplitter } from "../../hand.js";
import { Player } from "../../player.js";

export class Pattern {
  #label;
  #description;
  #splitless;
  #allowed;
  #describeAllowed;
  #p1;
  #p2;
  /**
   * @param {*} label 役名
   * @param {*} description 説明 
   * @param {*} isFreeForm 面子・雀頭の洗い出しによる聴牌または和了の判定が不可能であること
   * @param {*} describeAllowed 使用可能牌を説明に含める
   * @param {*} allowed 使用可能牌 null はすべて
   * @param {*} p1 翻数
   * @param {*} p2 役満数
   */
  constructor(
    label,
    description,
    isFreeForm,
    describeAllowed,
    allowed,
    p1,
    p2,
  ) {
    this.#label = label;
    this.#description = description;
    this.#splitless = isFreeForm;
    this.#describeAllowed = describeAllowed;
    this.#allowed = allowed;
    this.#p1 = p1;
    this.#p2 = p2;
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
  get description() {
    const lines = [this.#description];
    if (this.#describeAllowed) lines.push(`使用可能牌: ${this.#allowed.map(String).join(' ')}`);
    return lines.join(LF);
  }

  /**
   * 面子・雀頭の洗い出しが必要ないこと
   * @returns {Boolean}
   */
  get splitless() {
    return !!this.#splitless;
  }

  /**
   * 使用できる牌
   * @returns {TileDefinition[]}
   */
  get allowed() {
    return this.#allowed ?? allTileDefinitions;
  }

  /**
   * 翻数
   */
  get p1() {
    return this.#p1;
  }

  /**
   * 役満数
   */
  get p2() {
    return this.#p2;
  }

  /**
   * 成立するかどうか
   * @param {HandSplitter} splitter
   * @param {Player} player
   * @returns {Boolean}
   */
  matches(splitter, player) {
    return false;
  }

  /**
   * isFreeForm が true を返す場合のみ有効
   * @param {HandSplitter} splitter
   * @returns {Tile[]}
   */
  getFinishers(splitter) {
    return [];
  }

  /**
   * @returns {String}
   */
  toString() {
    const parts = [this.#label];
    if (this.#p1 > 0) parts.push(`${this.#p1}翻`);
    if (this.#p2 > 0) parts.push(`${this.#p2}役満`);
    return parts.join(' ');
  }

  /**
   * @returns {String}
   */
  toStringWithDescription() {
    return [
      this.toString(),
      this.description,
    ].join(LF);
  }
}
