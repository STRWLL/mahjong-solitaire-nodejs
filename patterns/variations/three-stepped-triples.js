import { KColorMStepNSequentialParts } from "../prototypes/k-color-m-step-n-sequential-parts.js";
import { FourSteppedTriples } from "./four-stepped-triples.js";

export class ThreeStepedTriples extends KColorMStepNSequentialParts {
  constructor() {
    super(
      '三連刻',
      '刻子',
      splitter => splitter.triples,
      3,
      1,
      1,
      2,
      0,   
    );
  }

  matches(...args) {
    // 上位互換役
    if (new FourSteppedTriples().matches(...args)) return false;
    return super.matches(...args);
  }
}
