import { Pattern } from "./prototypes/pattern.js";
import { FullConcealed } from "./variations/full-concealed.js";
import { FullOfStraights } from "./variations/full-of-straights.js";
import { FullOrphans } from "./variations/full-orphans.js";
import { OneTriple } from "./variations/one-triple.js";
import { TwoTriples } from "./variations/two-triples.js";
import { ThreeTriples } from "./variations/three-triples.js";
import { FourTriples } from "./variations/four-triples.js";
import { BlessingOfHeaven } from "./variations/blessing-of-heaven.js";
import { AfterQuadBorn } from "./variations/after-quad-born.js";
import { OneQuad } from "./variations/one-quad.js";
import { TwoQuads } from "./variations/two-quads.js";
import { ThreeQuads } from "./variations/three-quads.js";
import { FourQuads } from "./variations/four-quads.js";
import { TailOfDrawPile } from "./variations/tail-of-draw-pile.js";
import { ColorfulStraights } from "./variations/colorful-straights.js";
import { OneStraightPair } from "./variations/one-straight-pair.js";
import { TwoStraightPairs } from "./variations/two-straight-pairs.js";
import { ColorfulTriples } from "./variations/colorful-triples.js";
import { ColorfulPairs } from "./variations/colorful-pairs.js";
import { SevenPairs } from "./variations/seven-pairs.js";
import { DoubleColorfulPairs } from "./variations/double-colorful-pairs.js";
import { DualColorStraights } from "./variations/dual-color-straights.js";
import { DoubleDualColorStraights } from "./variations/double-dual-color-straights.js";
import { DualColorTriples } from "./variations/dual-color-triples.js";
import { DoubleDualColorTriples } from "./variations/double-dual-color-triples.js";
import { ThreeStepedTriples } from "./variations/three-stepped-triples.js";
import { FourSteppedTriples } from "./variations/four-stepped-triples.js";
import { ColorfulSteppedTriples } from "./variations/colorful-stepped-triples.js";
import { ThreeSameStraights } from "./variations/three-same-straights.js";
import { FourSameStraights } from "./variations/four-same-straights.js";

/**
 * @type {Pattern[]}
 */
export const allPatterns = [
  new AfterQuadBorn(),
  new TailOfDrawPile(),
  new FullConcealed(),
  new BlessingOfHeaven(),

  new FullOfStraights(),
  new OneStraightPair(),
  new TwoStraightPairs(),
  new ThreeSameStraights(),
  new FourSameStraights(),
  new DualColorStraights(),
  new DoubleDualColorStraights(),
  new ColorfulStraights(),
  
  new SevenPairs(),
  new DualColorTriples(),
  new DoubleDualColorTriples(),
  new ColorfulPairs(),
  new DoubleColorfulPairs(),
  new ColorfulTriples(),
  new ThreeStepedTriples(),
  new FourSteppedTriples(),
  new ColorfulSteppedTriples(),
  new OneTriple(),
  new TwoTriples(),
  new ThreeTriples(),
  new FourTriples(),

  new OneQuad(),
  new TwoQuads(),
  new ThreeQuads(),
  new FourQuads(),

  new FullOrphans(),
];

/**
 * @type {Pattern[]}
 */
export const splitlessPatterns = allPatterns.filter((pat) => pat.splitless);
