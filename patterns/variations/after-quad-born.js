import { Pattern } from "../prototypes/pattern.js";
import { HandSplitter } from "../../hand.js";
import { Player } from "../../player.js";

export class AfterQuadBorn extends Pattern {
  constructor() {
    super(
      '嶺上開花',
      'カンの直後のツモで和了すること',
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
    return player.drawnCountAfterLastKan === 1;
  }
}
