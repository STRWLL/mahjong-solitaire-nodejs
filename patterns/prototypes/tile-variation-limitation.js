import { HandSplitter } from "../../hand.js";
import { TileDefinition } from "../../tile.js";
import { Pattern } from "./pattern.js";

export class TileVariationLimitation extends Pattern {
  /**
   * @param {String} label 
   * @param {TileDefinition[]} allowed 
   * @param {int} p1 
   * @param {int} p2 
   */
  constructor(label, allowed, p1, p2) {
    super(
      label,
      '',
      false,
      true,
      allowed,
      p1,
      p2,
    );
  }

  /**
   * @param {HandSplitter} splitter 
   */
  matches(splitter) {
    const allowed = new Set(this.allowed.map((def) => def.id));
    return splitter.hand.contents.every((tile) => allowed.has(tile.def.id));
  }
}
