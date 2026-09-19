import { Pattern } from "../prototypes/pattern.js";
import { HandSplitter } from "../../hand.js";
import { Player } from "../../player.js";

export class Reach extends Pattern {
  constructor() {
    super(
      '立直',
      '聴牌宣言後、あがれる牌または待ちを変えずにカン出来る牌以外を自摸切りする。',
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
    return player.reaching;
  }
}
