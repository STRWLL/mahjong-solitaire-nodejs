import {
  LF,
  HEAD_COUNT,
  HEAD_SIZE,
  BODY_COUNT,
  BODY_PART_SIZE,
  QUAD_SIZE,
  INDENT,
} from './constants.js';

import {
  AutoSortedArray,
  pickupFoundFirst,
  getReplacementPermutations,
  getNoReplacementCombinations,
} from './array-utils.js';

import {
  Tile,
  TileDefinition,
} from './tile.js'

import {
  Pattern,
} from './patterns/prototypes/pattern.js';

import {
  allPatterns,
  splitlessPatterns,
} from './patterns/index.js';

import { calculateScore } from './score-calculator.js';

/**
 * @import {
 *  Tile,
 *  TileDefId,
 * } from './tile.js'
 * @import {
 *  DrawPile,
 * } from './pile.js';
 * @typedef {int} HandAction
 */

export class HandPart {
  #ids;
  #isMarked = false;
  #isHead = false;
  #isStraight = false;
  #isTriple = false;
  #isQuad = false;
  /**
   * @param {TileDefId[]} ids 
   */
  constructor(ids) {
    this.#ids = new AutoSortedArray(ids, (a, b) => a - b);
  }
  
  /**
   * @param {Tile} tile
   * @returns {HandPart}
   */
  static createQuadOf(tile) {
    return new HandPart(new Array(QUAD_SIZE).fill(tile.def.id)).markAsQuad();
  }

  /**
   * @returns {int}
   */
  get length() {
    return this.#ids.contents.length;
  }

  /**
   * @returns {Tile[]}
   */
  get tiles() {
    return this.#ids.contents.map((id) => new Tile(TileDefinition.get(id)));
  }

  /**
   * @returns {TileDefId}
   */
  get min() {
    return this.#ids.contents[0];
  }

  /**
   * @returns {TileDefId}
   */
  get max() {
    return this.#ids.contents.slice(-1)[0];
  }

  /**
   * @returns {Boolean}
   */
  get isHead() {
    if (this.#isMarked) return this.#isHead;
    return (this.length === HEAD_SIZE) && (this.max === this.min);
  }

  /**
   * @returns {Boolean}
   */
  get isStraight() {
    if (this.#isMarked) return this.#isStraight;
    const ids = this.#ids.contents;
    return (this.length === BODY_PART_SIZE) && ids.slice(0, -1).every((id, i) => {
      return id + 1 === ids[i + 1];
    });
  }

  /**
   * @returns {Boolean}
   */
  get isTriple() {
    if (this.isQuad) return true;
    if (this.#isMarked) return this.#isTriple;
    return (this.length === BODY_PART_SIZE) && (this.max === this.min);
  }

  /**
   * @returns {Boolean}
   */
  get isQuad() {
    if (this.#isMarked) return this.#isQuad;
    return (this.length === QUAD_SIZE) && (this.max === this.min);
  }

  /**
   * @returns {Boolean}
   */
  get isPreHead() {
    return this.length === HEAD_SIZE - 1;
  }

  /**
   * @returns {Boolean}
   */
  get isPreStraight() {
    return (this.length === BODY_PART_SIZE - 1) && (this.max - this.min < BODY_PART_SIZE);
  }

  /**
   * @returns {Boolean}
   */
  get isPreTriple() {
    return (this.length === BODY_PART_SIZE - 1) && (this.max === this.min);
  }

  /**
   * @return {Tile[]}
   */
  get finishers() {
    if (this.isPreHead || this.isPreTriple) {
      return [this.tiles[0]];
    }

    if (this.isPreStraight) {
      const candidates = (this.max - this.min === 1) ? [
        this.min - 1,
        this.max + 1,
      ] : [this.min + 1];
      return candidates.reduce((acc, id) => {
        const def = TileDefinition.get(id);
        if (def) acc.push(new Tile(def));
        return acc;
      }, []);
    }

    return [];
  }

  /**
   * @returns {HandPart}
   */
  markAsHead() {
    this.#isMarked = true;
    this.#isHead = true;
    return this;
  }

  /**
   * @returns {HandPart}
   */
  markAsStraight() {
    this.#isMarked = true;
    this.#isStraight = true;
    return this;
  }

  /**
   * @returns {HandPart}
   */
  markAsTriple() {
    this.#isMarked = true;
    this.#isTriple = true;
    return this;
  }

  /**
   * @returns {HandPart}
   */
  markAsQuad() {
    this.#isMarked = true;
    this.#isTriple = true;
    this.#isQuad = true;
    return this;
  }

  /**
   * @returns {String}
   */
  toString() {
    return this.tiles.map(String).join(' ');
  }
}

export class Hand {
  #contents = [];
  #lastDrawn = null;
  #lastFinishers = [];
  #quads = [];

  /**
   * @param {Tile[]} tiles
   */
  constructor(tiles) {
    this.#contents = new AutoSortedArray(tiles, (a, b) => a.def.id - b.def.id);    
  }

  /**
   * @param {DrawPile} pile
   */
  static createFromDrawPile(pile) {
    const tiles = [];
    while(tiles.length < Hand.defaultLength) {
      tiles.push(pile.shift());
    }
    return new Hand(tiles);
  }

  /**
   * @param {TileDefId[]} ids
   */
  static createFromTileDefIds(ids) {
    return new Hand(ids.map((id) => new Tile(TileDefinition.get(id))));
  }

  /**
   * @returns {Hand}
   */
  clone() {
    const cloned = new Hand(this.contents);
    this.#quads.forEach((quad) => {
      cloned.addQuad(quad);
    });
    return cloned;
  }

  /**
   * @returns {int}
   */
  static get finishableLength() {
    return HEAD_SIZE * HEAD_COUNT + BODY_PART_SIZE * BODY_COUNT;
  }

  /**
   * @returns {int}
   */
  static get defaultLength() {
    return Hand.finishableLength - 1;
  }

  /**
   * @returns {int}
   */
  static get maxHeadCount() {
    return Math.floor(Hand.finishableLength / HEAD_SIZE);
  }

  /**
   * @returns {Tile[]}
   */
  get contents() {
    return this.#contents.contents;
  }

  /**
   * @returns {Map<TileDefId, int>}
   */
  get duplicationsForEachTileDefId() {
    return this.contents.reduce((acc, tile) => {
      const { id } = tile.def;
      acc.set(id, (acc.get(id) ?? 0) + 1);
      return acc;
    }, new Map());
  }

  /**
   * @returns {Set<TilDefId>}
   */
  get tileDefIdsKannable() {
    return this.duplicationsForEachTileDefId.entries().reduce((
      acc,
      [id, dup],
    ) => {
      if (dup >= QUAD_SIZE) acc.add(id);
      return acc;
    }, new Set());
  }

  /**
   * @returns {Tile[]}
   */
  get tilesKannable() {
    return Array.from(this.tileDefIdsKannable).map((id) => new Tile(TileDefinition.get(id)));
  }

  /**
   * @returns {HandPart[]}
   */
  get quads() {
    return this.#quads;
  }

  /**
   * @returns {Number}
   */
  get length() {
    return this.contents.length;
  }

  /**
   * @return {Tile?}
   */
  get lastDrawn() {
    return this.#lastDrawn;
  }

  /**
   * @return {Tile[]}
   */
  get lastFinishers() {
    return this.#lastFinishers ?? [];
  }

  /**
   * @param {Tile} tile 
   * @returns {Hand}
   */
  markLastDrawn(tile) {
    this.#lastDrawn = tile;
    return this;
  }

  /**
   * @param {Tile[]} finishers 
   * @returns {Hand}
   */
  markLastFinishers(finishers) {
    this.#lastFinishers = finishers;
    return this;
  }

  /**
   * @param {Tile} tile
   * @returns {Hand}
   */
  add(tile) {
    this.#contents.add(tile);
    return this;
  }

  /**
   * @param {int} index
   * @returns {Tile} removed tile
   */
  remove(index) {
    return this.#contents.remove(index);
  }

  /**
   * @param {int} index
   * @returns {Hand}
   */
  removePerview(index) {
    const clone = this.clone();
    clone.remove(index);
    return clone;
  }

  /**
   * @param {Tile} member
   * @return {Hand}
   */
  kan(member) {
    if (!this.tileDefIdsKannable.has(member.def.id)) {
      throw new Error(`the tile is not kannable: ${member}`);
    }
    let removed;
    const firstIndex = this.contents.findIndex((tile) => {
      return tile.def.id === member.def.id;
    });
    for (let i = 0; i < QUAD_SIZE; i++) {
      removed = this.remove(firstIndex);
    }
    this.addQuad(HandPart.createQuadOf(removed));
    return this;
  }

  /**
   * @param {HandPart}
   * @returns {Hand}
   */
  addQuad(quad) {
    this.#quads.push(quad);
    return this;
  }

  /**
   * @returns {String}
   */
  toString() {
    return this.contents.map(String).join(' ');
  }

  /**
   * @returns {String}
   */
  serializeContents() {
    return this.contents.map((tile) => tile.def.id).join('-');
  }
}

export class HandSplitter {
  #hand = null;
  #queue = [];
  #heads = [];
  #straights = [];
  #triples = [];
  #extra = [];
  #takeLogs = false;
  #operationLog = [];
  #notFoundCount = 0;
  /**
   * @param {Hand} hand
   * @param {Boolean} takeLogs
   */
  constructor(hand, takeLogs = false) {
    this.#hand = hand;
    this.#queue = [...hand.contents.map((tile) => tile.def.id)];
    this.#takeLogs = takeLogs;
  }

  /**
   * 聴牌または和了のパターンを洗い出す
   * @param {Hand} hand
   * @returns {HandSplitter[]}
   */
  static findFinishingPatterns(hand) {
    // method patterns
    const undeterminedBodyCount = BODY_COUNT - hand.quads.length;
    const methodsFindingBody = [
      HandSplitter.prototype.findStraight,
      HandSplitter.prototype.findTriple,
    ];
    const methodPatternsFindingBody = getReplacementPermutations(methodsFindingBody, undeterminedBodyCount);
    const methodPatterns = methodPatternsFindingBody.flatMap((pat) => {
      const patternsFindingHead = [];
      for (let pos = 0; pos <= pat.length; pos++) {
        patternsFindingHead.push(pat.toSpliced(pos, 0, HandSplitter.prototype.findHead));
      }
      return patternsFindingHead;
    });

    // part starter patterns
    const handById = hand.contents.map((tile) => tile.def.id);
    const partStarterPatterns = getNoReplacementCombinations(handById, HEAD_COUNT + undeterminedBodyCount);

    // method patterns x part starter patterns
    const validPatterns = [];
    methodPatterns.forEach((methods) => {
      return partStarterPatterns.forEach((starters) => {
        const splitter = new HandSplitter(hand);
        let valid = true;
        for (let i = 0; i < methods.length; i++) {
          const method = methods[i];
          const starter = starters[i];
          method.call(splitter, starter);
          if (splitter.notFoundCount > 1) {
            valid = false;
            break;
          }
        }
        if (valid) validPatterns.push(splitter);
      });
    });

    // pattern full of pair
    const tileDefUniqueIds = new Set(hand.contents.map((tile) => tile.def.id));
    const splitterFullOfPair = new HandSplitter(hand);
    let fullOfPairValid = true;
    for (const starter of tileDefUniqueIds) {
      splitterFullOfPair.findHead(starter);
      if (splitterFullOfPair.notFoundCount > 1) {
        fullOfPairValid = false;
        break;
      }
    }
    if (fullOfPairValid) validPatterns.push(splitterFullOfPair);

    return validPatterns;
  }

  /**
   * @returns {int}
   */
  get notFoundCount() {
    return this.#notFoundCount;
  }

  /**
   * @returns {HandPart[]}
   */
  get heads() {
    return Object.freeze(this.#heads);
  }

  /**
   * @returns {HandPart[]}
   */
  get straights() {
    return Object.freeze(this.#straights);
  }

  /**
   * @returns {HandPart[]}
   */
  get triples() {
    return Object.freeze(this.#triples);
  }

  /**
   * @returns {HandPart[]}
   */
  get quads() {
    return Object.freeze(this.#hand.quads);
  }

  /**
   * @returns {HandPart[]}
   */
  get bodyParts() {
    return Object.freeze([
      ...this.straights,
      ...this.triples,
      ...this.quads,
    ]);
  }

  /**
   * @returns {HandPart[]}
   */
  get parts() {
    return Object.freeze([
      ...this.heads,
      ...this.bodyParts,
    ]);
  }

  /**
   * @returns {HandPart}
   */
  get rest() {
    return new HandPart([
      ...this.#queue,
      ...this.#extra,
    ]);
  }

  /**
   * @returns {String[]}
   */
  get operationLog() {
    return Object.freeze(this.#operationLog);
  }
  
  /**
   * @param {String} methodName 
   * @param {TileDefId[]} targets 
   */
  #addOperationLog(methodName, targets) {
    if (!this.#takeLogs) return;
    const targetsLabel = targets.map((id) => String(new Tile(TileDefinition.get(id)))).join(' ');
    this.#operationLog.push(`${methodName} ${targetsLabel}`);
  }

  /**
   * @param {String} operationLabel
   * @param {TileDefId[]} targets
   * @param {Function} handPartMarker
   * @param {Array} destination
   * @returns {HandPart} found part
   */
  #find(
    operationLabel,
    targets,
    handPartMarker,
    destination,
  ) {
    this.#addOperationLog(operationLabel, targets[0]);
    const found = pickupFoundFirst(this.#queue, targets);
    if (found.length < targets.length) {
      this.#extra.push(...found);
      this.#notFoundCount++;
      return null;
    }
    const handPart = new HandPart(found);
    handPartMarker.call(handPart);
    destination.push(handPart);
    return handPart;
  }

  /**
   * @param {TileDefId} starter 
   * @returns {HandPart} found
   */
  findHead(starter) {
    return this.#find(
      HandSplitter.prototype.findHead.name,
      new Array(HEAD_SIZE).fill(starter),
      HandPart.prototype.markAsHead,
      this.#heads,
    );
  }

  /**
   * @param {TileDefId} starter 
   * @returns {HandPart} found
   */
  findStraight(starter) {
    return this.#find(
      HandSplitter.prototype.findStraight.name,
      new Array(BODY_PART_SIZE).fill(starter).map((e, i) => e + i),
      HandPart.prototype.markAsStraight,
      this.#straights,
    );
  }

  /**
   * @param {TileDefId} starter
   * @returns {HandPart} found
   */
  findTriple(starter) {
    return this.#find(
      HandSplitter.prototype.findTriple.name,
      new Array(BODY_PART_SIZE).fill(starter),
      HandPart.prototype.markAsTriple,
      this.#triples,
    );
  }

  /**
   * @returns {String}
   */
  toString() {
    return [
      'heads',
      'straights',
      'triples',
      'quads',
      'rest',
    ].map((collectionName) => {
      const header = `${collectionName}:`;
      const collection = this[collectionName];
      const content = (
        collection.length === 0
        ? INDENT + 'none'
        : (
          collection instanceof HandPart
          ? INDENT + String(collection)
          : collection.map((handPart) => INDENT + String(handPart)).join(LF)
        )
      )
      return header + LF + content;
    }).join(LF);
  }
}

/**
 * 複数の HandSplitter により Hand を HandPart に分割するすべてのパターンを網羅し、
 * 手牌を解析する。
 */
export class HandEvaluator {
  #hand;
  #splittersExtracted = false;
  #splitters = [];
  #noSplitSplitter = null;
  #finishersExtracted = false;
  #finishers = [];
  #finishableCalculated = false;
  #finishable = false;
  #patterns = [];
  #score = 0;
  #scoredSplitter = null;
  static #cache = new Map();

  /**
   * @param {Hand} hand 
   */
  constructor (hand) {
    this.#hand = hand;
    this.#noSplitSplitter = new HandSplitter(this.#hand);
    HandEvaluator.#cache.set(hand.serializeContents(), this);
  }

  /**
   * @param {Hand} hand 
   */
  static cacheable(hand) {
    return HandEvaluator.#cache.get(hand.serializeContents()) ?? new HandEvaluator(hand);
  }

  #extractSplitters() {
    if (this.#splittersExtracted) return;
    this.#splitters = HandSplitter.findFinishingPatterns(this.#hand);
    this.#splittersExtracted = true;
  }

  #extractFinishers() {
    if (this.#finishersExtracted) return;
    this.#finishers = [];
    this.#finishers.push(...Object.values(splitlessPatterns.reduce((acc, pat) => {
      pat.getFinishers(this.#noSplitSplitter).forEach((finisher) => {
        acc[finisher.def.id] = finisher;
      });
      return acc;
    }, {})));
    this.#extractSplitters();
    this.#finishers.push(...Object.values(this.#splitters.reduce((acc, splitter) => {
      splitter.rest.finishers.forEach((finisher) => {
        acc[finisher.def.id] = finisher;
      });
      return acc;
    }, {})));
    this.#finishersExtracted = true;
  }

  #calculateFinishable() {
    if (this.#finishableCalculated) return;
    // 後ろの要素ほど処理が重いので、some により早期切り上げを行う。
    this.#finishable = [
      () => {
        const lastAdded = this.#hand.lastDrawn;
        if (!lastAdded) return false;
        const lastFinishers = this.#hand.lastFinishers;
        if (lastFinishers.length === 0) return false;
        return !!lastFinishers.find((finisher) => finisher.def.id === lastAdded.def.id);
      },
      () => {
        return splitlessPatterns.some((pat) => {
          return pat.matches(this.#noSplitSplitter);
        });
      },
      () => {
        this.#extractSplitters();
        return this.#splitters.some((splitter) => {
          return splitter.rest.length === 0;
        });
      },
    ].some(judge => judge());
    this.#finishableCalculated = true;
  }

  /**
   * @param {Player} player
   * @returns {int}
   */
  calculateScore(player) {
    if (!this.finishable) return;

    this.#extractSplitters();
    
    this.#patterns = [];
    this.#score = 0;

    [
      this.#noSplitSplitter,
      ...this.#splitters,
    ].forEach((splitter) => {
      let p1 = 0;
      let p2 = 0;
      const patterns = [];
      allPatterns.forEach((pattern) => {
        if (pattern.splitless && splitter.rest.length === 0) return;
        if (!pattern.splitless && splitter.rest.length > 0) return;

        if (pattern.matches(splitter, player)) {
          p1 += pattern.p1;
          p2 += pattern.p2;
          patterns.push(pattern);
        }
      });
      const score = calculateScore(p1, p2);

      if (score > this.#score) {
        this.#score = score;
        this.#patterns = patterns;
        this.#scoredSplitter = splitter;
      }
    });
  }

  /**
   * @returns {HandSplitter[]}
   */
  get splitters() {
    this.#extractSplitters();
    return this.#splitters;
  }

  /**
   * @returns {Tile[]}
   */
  get finishers() {
    this.#extractFinishers();
    return this.#finishers;
  }

  /**
   * @returns {Tile[]}
   */
  get finishable() {
    this.#calculateFinishable();
    return this.#finishable;
  }

  /**
   * @returns {Pattern[]}
   */
  get patterns() {
    return this.#patterns;
  }
  
  /**
   * @returns {int}
   */
  get score() {
    return this.#score;
  }

  /**
   * @returns {HandSplitter}
   */
  get scoredSplitter() {
    return this.#scoredSplitter;
  }
}
