import { Pattern } from "./pattern.js";
import { HandSplitter } from "../../hand.js";

export class NTriples extends Pattern {
  #n;

  /**
   * @param {int} n 必要な暗刻の数 
   */
  constructor(label, n, p1, p2) {
    super(
      label,
      `面子のちょうど${n}つが暗刻であること`,
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
    return splitter.triples.length + splitter.quads.length === this.#n;
  }
}
