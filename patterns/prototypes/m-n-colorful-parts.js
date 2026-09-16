import { Pattern } from "./pattern.js";
import { HandSplitter } from "../../hand.js";
import { TileDefinition } from "../../tile.js";

export class MNColorfulParts extends Pattern {
  #n;
  #m;
  #getParts;

  /**
   * n 色同 partLabel m 組
   * @param {String} label 
   * @param {String} partLabel
   * @param {Function} getParts
   *  @param {HandSplitter} splitter
   *  @returns {HandPart[]}
   * @param {int} n 
   * @param {int} m 
   * @param {int} p1 
   * @param {int} p2 
   */
  constructor(
    label,
    partLabel,
    getParts,
    n,
    m,
    p1,
    p2,
  ) {
    super(
      label,
      `${n}つの異なる牌クラスタで構成された同じ数字の${partLabel}が${m}組あること`,
      false,
      false,
      null,
      p1,
      p2,
    );
    this.#n = n;
    this.#m = m;
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
    const parts = this.#getParts(splitter);
    if (parts.length < this.minTargetPartsCount) return false;
    const partMinOrderGroup = parts.reduce((acc, part) => {
      const minIdTileDef = TileDefinition.get(part.min);
      const minOrder = minIdTileDef.order;
      if (!acc.get(minOrder)) acc.set(minOrder, []);
      acc.get(minOrder).push({
        part,
        orderBase: minIdTileDef.orderBase,
      });
      return acc;
    }, new Map());
    return Array.from(partMinOrderGroup.values()).filter((group) => {
      const orderBaseVariations = new Set(group.map(({ orderBase }) => orderBase));
      return orderBaseVariations.size === this.#n;
    }).length === this.#m;
  }
}
