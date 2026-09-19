import { honorTileDefinitions } from "../../tile.js";
import { TileVariationLimitation } from "../prototypes/tile-variation-limitation.js";

export class FullHonors extends TileVariationLimitation {
  constructor() {
    super(
      '字一色',
      honorTileDefinitions,
      0,
      1,
    );
  }
}
