import { Pattern } from "./pattern.js";
import { HandSplitter } from "../../hand.js";

export class MGroupOfSameNStraights extends Pattern {
  #n;
  #m;

  constructor(label, n, m, p1, p2) {
    super(
      label,
      `同じ順子${n}つが${m}組あること`,
      false,
      false,
      null,
      p1,
      p2,
    );
    this.#n = n;
    this.#m = m;
  }

  /**
   * @param {HandSplitter} splitter 
   * @returns {Boolean}
   */
  matches(splitter) {
    const straightGroup = splitter.straights.reduce((acc, straight) => {
      if (!acc.get(straight.min)) acc.set(straight.min, []);
      acc.get(straight.min).push(straight);
      return acc;
    }, new Map());
    return Array.from(straightGroup.values()).filter((group) => {
      return group.length === this.#n;
    }).length === this.#m;
  }
}
