import { Pattern } from "./pattern.js";
import { HandSplitter } from "../../hand.js";
import { TileDefinition } from "../../tile.js";
import { getStepSequencesInRange } from "../../math-utils.js";
import {
  ORDER_START,
  ORDER_END,
} from "../../constants.js";
import { pickupFoundFirst } from "../../array-utils.js";

export class KColorMStepNSequentialParts extends Pattern {
  #n;
  #m;
  #k;
  #getParts;

  /**
   * k 色 n 連部 (等差 m)
   * @param {String} label 
   * @param {String} partLabel
   * @param {Function} getParts
   *  @param {HandSplitter} splitter
   *  @returns {HandPart[]}
   * @param {int} n 
   * @param {int} m 
   * @param {int} k
   * @param {int} p1 
   * @param {int} p2 
   */
  constructor(
    label,
    partLabel,
    getParts,
    n,
    m,
    k,
    p1,
    p2,
  ) {
    super(
      label,
    `${k === 1 ? '同じ' : `${k}つの異なる`}牌クラスタで、増分 ${m} で ${n} 連続する${partLabel}があること`,
      false,
      false,
      null,
      p1,
      p2,
    );
    this.#n = n;
    this.#m = m;
    this.#k = k;
    this.#getParts = getParts;
  }

  get minTargetPartsCount() {
    return this.#n * this.#m;
  }

  /**
   * @param {HandSplitter} splitter 
   * @returns {Boolean}
   */
  matches(splitter) {
    // 検索対象部の数で早期切り上げ
    const parts = this.#getParts(splitter);
    if (parts.length < this.#n) return false;

    // 検索対象部の牌クラスタの数で早期切り上げ
    const orderBases = new Set(parts.map((part) => {
      return TileDefinition.get(part.min).orderBase;
    }));
    if (orderBases.size < this.#k) return false;

    // 検索対象部から目的の等差数列を抽出
    const sequences = getStepSequencesInRange(
      ORDER_START,
      ORDER_END,
      this.#m,
      this.#n,
    );

    return !!sequences.find((sequence) => {
      const foundParts = pickupFoundFirst(
        [...parts],
        sequence,
        (part) => TileDefinition.get(part.min).order,
      );
      if (foundParts.length !== this.#n) return false;
      const foundPartsOrderBases = new Set(foundParts.map((part) => {
        return TileDefinition.get(part.min).orderBase;
      }));
      return foundPartsOrderBases.size === this.#k;
    });
  }
}
