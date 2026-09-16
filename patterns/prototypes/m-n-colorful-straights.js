import { HandPart, HandSplitter } from "../../hand.js";
import { MNColorfulParts } from "./m-n-colorful-parts.js";

export class MNColorfulStraights extends MNColorfulParts {
  constructor(label, n, m, p1, p2) {
    super(
      label,
      '順子',
      /**
       * @param {HandSplitter} splitter 
       * @returns {HandPart[]}
       */
      splitter => splitter.straights,
      n,
      m,
      p1,
      p2,
    );
  }
}
