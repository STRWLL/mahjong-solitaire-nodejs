import { HandPart, HandSplitter } from "../../hand.js";
import { MNColorfulParts } from "./m-n-colorful-parts.js";

export class MNColorfulPairs extends MNColorfulParts {
  constructor(label, n, m, p1, p2) {
    super(
      label,
      '対子または暗刻',
      /**
       * @param {HandSplitter} splitter 
       * @returns {HandPart[]}
       */
      splitter => [...splitter.heads, ...splitter.triples],
      n,
      m,
      p1,
      p2,
    );
  }
}
