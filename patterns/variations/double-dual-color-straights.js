import { LF } from "../../constants.js";
import { Hand } from "../../hand.js";
import { MNColorfulStraights } from "../prototypes/m-n-colorful-straights.js";
import { ColorfulStraights } from "./colorful-straights.js";
import { OneStraightPair } from "./one-straight-pair.js";

export class DoubleDualColorStraights extends MNColorfulStraights {
  constructor() {
    super(
      '二色同順二組',
      2,
      2,
      3,
      0,
    );
  }
}
