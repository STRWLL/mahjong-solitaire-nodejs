import { HandPart, HandSplitter } from "../../hand.js";
import { MNColorfulParts } from "./m-n-colorful-parts.js";

export class MNColorfulTriples extends MNColorfulParts {
  constructor(label, n, m, p1, p2) {
    super(
      label,
      '刻子',
      /**
       * @param {HandSplitter} splitter 
       * @returns {HandPart[]}
       */
      splitter => splitter.triples,
      n,
      m,
      p1,
      p2,
    );
  }
}
