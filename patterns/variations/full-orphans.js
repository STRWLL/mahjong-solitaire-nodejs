import { Pattern } from "../prototypes/pattern.js";

import {
  Hand,
  HandSplitter,
} from "../../hand.js";

import {
  terminalTileDefinitions,
  honorTileDefinitions,
  TileDefinition,
  Tile,
} from "../../tile.js";

export class FullOrphans extends Pattern {
  constructor() {
    super(
      '国士無双',
      'すべての幺九牌を持ち、1つを雀頭とすること',
      true,
      false,
      [
        ...terminalTileDefinitions,
        ...honorTileDefinitions,
      ],
      0,
      1,
    );
  }

  /**
   * @param {HandSplitter} splitter 
   * @returns {Boolean} 
   */
  matches(splitter) {
    const ids = splitter.rest.tiles.map((tile) => tile.def.id);
    const uniqueIds = Array.from(new Set(ids));
    const allowedIds = new Set(this.allowed.map((def) => def.id));
    return (
      ids.length === Hand.finishableLength
    ) && (
      uniqueIds.length === allowedIds.size
    ) && uniqueIds.every((id) => {
      return allowedIds.has(id);
    });
  }

  /**
   * @param {HandSplitter} splitter 
   * @returns {Tile[]} 
   */
  getFinishers(splitter) {
    const allowedIds = new Set(this.allowed.map((def) => def.id));
    const ids = splitter.rest.tiles.map((tile) => tile.def.id);
    const uniqueIds = Array.from(new Set(ids));
    const finishing = (
      ids.length === Hand.defaultLength
    ) && (
        [allowedIds.size, allowedIds.size - 1].includes(uniqueIds.length)
      ) && uniqueIds.every((id) => {
        return allowedIds.has(id);
      });
    if (!finishing) return [];
    if (uniqueIds.length === allowedIds.size) {
      return this.allowed.map((def) => new Tile(def));
    }
    return Array.from(allowedIds.difference(new Set(ids))).map((id) => new Tile(TileDefinition.get(id)));
  }
}
