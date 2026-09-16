import { Pattern } from "../prototypes/pattern.js";
import { HandSplitter } from "../../hand.js";

export class FullConcealed extends Pattern {
  constructor() {
    super(
      '門前清自摸和',
      'すべて自摸牌で構成されること',
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
    return true;
  }
}
