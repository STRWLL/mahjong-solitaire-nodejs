import { Pattern } from "./pattern.js";
import { HandSplitter } from "../../hand.js";

export class NStraightPairs extends Pattern {
  #n;

  /**
   * @param {int} n 必要な同じ順子の組の数 
   */
  constructor(label, n, p1, p2) {
    super(
      label,
      `同じ順子が${n}組あること`,
      false,
      false,
      null,
      p1,
      p2,
    );
    this.#n = n
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
      return group.length >= 2;
    }).length === this.#n;
  }
}
