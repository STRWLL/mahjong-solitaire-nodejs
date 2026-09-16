import { KColorMStepNSequentialParts } from "../prototypes/k-color-m-step-n-sequential-parts.js";

export class FourSteppedTriples extends KColorMStepNSequentialParts {
  constructor() {
    super(
      '四連刻',
      '刻子',
      splitter => splitter.triples,
      4,
      1,
      1,
      0,
      1,   
    );
  }
}
