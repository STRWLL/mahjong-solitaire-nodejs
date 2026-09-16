import { Pattern } from "../prototypes/pattern.js";
import { HandSplitter } from "../../hand.js";
import { BODY_COUNT } from "../../constants.js";

export class FullOfStraights extends Pattern {
  constructor() {
    super(
      '平和',
      '面子のすべてが順子であること',
      false,
      false,
      null,
      1,
      0,
    );
  }

  /**
   * @param {HandSplitter} splitter 
   * @returns {Boolean}
   */
  matches(splitter) {
    return splitter.straights.length === BODY_COUNT;
  }
}
