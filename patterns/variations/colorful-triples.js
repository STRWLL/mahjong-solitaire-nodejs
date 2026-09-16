import { LF } from "../../constants.js";
import { MNColorfulTriples } from "../prototypes/m-n-colorful-triples.js";
import { ColorfulPairs } from "./colorful-pairs.js";
import { DualColorStraights } from "./dual-color-straights.js";

export class ColorfulTriples extends MNColorfulTriples {
  constructor() {
    super(
      '三色同刻',
      3,
      1,
      3,
      0,
    );
  }

  get description() {
    const cp = new ColorfulPairs();
    const dcs = new DualColorStraights();
    return [
      super.description,
      `${cp.label} も付くので実質 ${cp.p1 + this.p1} 翻である。`,
      `また、シャンポン待ちで片方がこの役が付かない待ちであっても、`,
      `${dcs.label} ${cp.label} (計 ${dcs.p1 + cp.p1} 翻) は付く。`,
    ].join(LF);
  }
}
