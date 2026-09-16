import { Pattern } from "../prototypes/pattern.js";
import { HandSplitter } from "../../hand.js";

export class SevenPairs extends Pattern {
  constructor() {
    super(
      '七対子',
      '対子が7つあること',
      false,
      false,
      null,
      2,
      0,
    );
  }

  /**
   * @param {HandSplitter} splitter 
   * @returns {Boolean}
   */
  matches(splitter) {
    return splitter.heads.length === 7;
  }
}
