import { KColorMStepNSequentialParts } from "../prototypes/k-color-m-step-n-sequential-parts.js";

export class ColorfulFullStraight extends KColorMStepNSequentialParts {
  constructor() {
    super(
      '三色一気通貫',
      '順子',
      (splitter) => splitter.straights,
      3,
      3,
      3,
      2,
      0,
    );
  }

  get description() {
    return super.description.replace('増分', '最小の数字の増分');
  }
}
