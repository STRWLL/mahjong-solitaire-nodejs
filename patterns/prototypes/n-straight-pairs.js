import { MGroupOfSameNStraights } from "./m-group-of-same-n-straights.js";

export class NStraightPairs extends MGroupOfSameNStraights {
  constructor(label, n, p1, p2) {
    super(
      label,
      2,
      n,
      p1,
      p2,
    );
  }
}
