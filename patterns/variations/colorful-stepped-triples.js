import { KColorMStepNSequentialParts } from "../prototypes/k-color-m-step-n-sequential-parts.js";

export class ColorfulSteppedTriples extends KColorMStepNSequentialParts {
  constructor() {
    super(
      '三色三連刻',
      '刻子',
      splitter => splitter.triples,
      3,
      1,
      3,
      2,
      0,   
    );
  }
}
