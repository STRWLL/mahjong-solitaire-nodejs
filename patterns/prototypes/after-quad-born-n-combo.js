import { Pattern } from "./pattern.js";
import { HandSplitter } from "../../hand.js";
import { Player } from "../../player.js";

export class AfterQuadBornNCombo extends Pattern {
  #n;

  constructor(label, n, p1, p2) {
    super(
      label,
      `${n > 1 ? `${n}回連続` : ''}カンの直後のツモで和了すること`,
      false,
      false,
      null,
      p1,
      p2,
    );
    this.#n = n;
  }

  /**
   * @param {HandSplitter} splitter 
   * @param {Player} player 
   * @returns {Boolean}
   */
  matches(splitter, player) {
    return player.drawnCountAfterLastKan === 1 && player.kanCombo === this.#n;
  }
}
