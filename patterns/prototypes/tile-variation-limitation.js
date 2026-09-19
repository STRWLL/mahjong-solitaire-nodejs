import { HandSplitter } from "../../hand.js";
import { Pattern } from "./pattern.js";

export class TileVariationLimitation extends Pattern {
  constructor(label, tileDefIds, p1, p2) {
    super(
      label,
      '',
      false,
      true,
      tileDefIds,
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
