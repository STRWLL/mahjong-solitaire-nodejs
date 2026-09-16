import { Pattern } from "../prototypes/pattern.js";
import { HandSplitter } from "../../hand.js";
import { Player } from "../../player.js";

export class TailOfDrawPile extends Pattern {
  constructor() {
    super(
      '海底撈月',
      '山の最後の牌で和了すること',
      false,
      false,
      null,
      1,
      0,
    );
  }

  /**
   * @param {HandSplitter} splitter 
   * @param {Player} player 
   * @returns {Boolean}
   */
  matches(splitter, player) {
    return player.drawPile.length === 0;
  }
}
