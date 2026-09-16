import { Pattern } from "../prototypes/pattern.js";
import { HandSplitter } from "../../hand.js";
import { Player } from "../../player.js";

export class BlessingOfHeaven extends Pattern {
  constructor() {
    super(
      '天和',
      '第一ツモで和了すること',
      false,
      false,
      null,
      0,
      1,
    );
  }

  /**
   * @param {HandSplitter} splitter 
   * @param {Player} player 
   * @returns {Boolean}
   */
  matches(splitter, player) {
    return player.drawnCount === 1;
  }
}
