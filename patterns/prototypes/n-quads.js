import { Pattern } from "./pattern.js";
import { HandSplitter } from "../../hand.js";

export class NQuads extends Pattern {
  #n;

  /**
   * @param {int} n 必要な槓子の数 
   */
  constructor(label, n, p1, p2) {
    super(
      label,
      `面子のちょうど${n}つが槓子であること`,
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
    return splitter.quads.length === this.#n;
  }
}
