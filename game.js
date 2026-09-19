import {
  KeyReader,
} from './reader.js';

import {
  Writer,
} from './writer.js';

import {
  HandEvaluator,
} from './hand.js';

import {
  ChoiceMetadata,
  Discard,
  Finish,
  Kan,
  Reach,
} from './choice.js';

import process from 'process';
import { splitArray } from './array-utils.js';

export class InvalidModeException extends Error {
  constructor() {
    super('invalid mode');
  }
}

export class InvalidDirectionException extends Error {
  constructor() {
    super('invalid direction');
  }
}

/**
 * @import {
 *  Player,
 * } from './player.js'
 * @typedef {int} Mode
 * @typedef {int} Direction
 */

export class Game {
  #reader;
  #writer;
  #player;

  #choices = [];
  #choosenIndex = 0;

  /**
   * @param {Player} player
   */
  constructor(player) {
    this.#reader = new KeyReader();
    this.#writer = new Writer();
    this.#player = player;
  }

  /**
   * @type {Object}
   *  @prop {Direction}
   */
  static directions = Object.freeze({
    previous: -1,
    next: 1,
  });

  /**
   * @returns {Choice}
   */
  get choice() {
    return this.#choices[this.#choosenIndex];
  }

  #setEvents() {
    this.#reader.onExit(() => this.end());
    this.#reader.onEnter(() => {
      this.#applySelection();
      this.#startNextTurn();
      this.display();
    });
    this.#reader.onPrevious(() => {
      this.#moveCursor(Game.directions.previous);
      this.display();
    });
    this.#reader.onNext(() => {
      this.#moveCursor(Game.directions.next);
      this.display();
    });
  }

  display() {
    // reset
    this.#writer.reset();

    // header
    this.#writer.writeLine(`rest draws: ${this.#player.drawPile.length}`);
    this.#writer.writeLine();
    this.#writer.writeLine(this.#player.discardPile);
    this.#writer.writeLine();
    this.#displayFinishers();
    this.#writer.writeLine();
    this.#writer.writeLine(`last drawn: ${this.#player.hand.lastDrawn ?? 'none'}`);
    this.#writer.writeLine();
    this.#displayChoices();    
    this.#writer.writeLine();

    // extra hand
    this.#player.hand.quads.forEach((quad) => {
      this.#writer.writeLine(quad);
    });
    if (this.#player.hand.quads.length > 0) {
      this.#writer.writeLine();
    }
  }

  #displayFinishers() {
    const hand = this.#player.hand;
    let finishers = [];
    if (this.choice instanceof Discard || this.choice instanceof Reach) {
      finishers = HandEvaluator.cacheable(hand.removePerview(this.#choosenIndex)).finishers;
    } else if (this.choice instanceof Kan) {
      const kannedHand = hand.clone().kan(this.choice.tile)
      finishers = HandEvaluator.cacheable(kannedHand).finishers;
    }
    this.#writer.writeLine(`finishers: ${finishers.length ? finishers.map(String).join(' ') : 'none'}`);
  }

  #displayChoices() {
    const discards = [];
    const others = [];
    this.#choices.forEach((choice, originalIndex) => {
      const choiceMetadata = new ChoiceMetadata(choice, originalIndex);
      if (choice instanceof Discard) {
        return discards.push(choiceMetadata);
      }
      others.push(choiceMetadata);
    });
    
    const choiceSplits = [discards, ...splitArray(others, 5)];
    choiceSplits.forEach((split) => {
      this.#writer.writeLine(split.map(cm => String(cm.choice)).join(' '));
      this.#writer.writeLine(ChoiceMetadata.getCursorBoxes(split, this.#choosenIndex).join(' '));
    });

    this.#writer.writeLine(this.choice.description);
  }

  displayScore() {
    const evaluator = HandEvaluator.cacheable(this.#player.hand);
    evaluator.patterns.forEach((pattern) => {
      this.#writer.writeLine(pattern);
    });
    this.#writer.writeLine(evaluator.score);
  }

  #resetChoice() {
    const hand = this.#player.hand;

    // 手牌に対応する Discard を生成
    this.#choices = hand.contents.map((tile) => new Discard(tile));

    // 今後の選択肢追加や画面表示前にそれぞれの打牌の待ちを洗い出しておく
    this.#choices.forEach((choice, index) => {
      HandEvaluator.cacheable(hand.removePerview(index)).finishers;
    });

    if (HandEvaluator.cacheable(hand).finishable) {
      // あがれる場合、Finish を追加し、そこにカーソルを移動
      this.#choices.push(new Finish());
      this.#choosenIndex = this.#choices.length - 1;
    } else {
      // あがれない場合、ツモってきた牌にカーソルを移動
      this.#choosenIndex = hand.contents.findIndex((tile) => {
        return tile.def.id === hand.lastDrawn.def.id;
      });
    }
    
    // カン出来る牌ごとに Kan を追加
    hand.tilesKannable.forEach((kannable) => {
      this.#choices.push(new Kan(kannable));
    });

    // 切ると聴牌になる牌ごとに Reach を生成
    const addedReachableTileDefIds = new Set();
    hand.contents.forEach((tile, index) => {
      if (
        HandEvaluator.cacheable(hand.removePerview(index)).finishers.length > 0
        && !addedReachableTileDefIds.has(tile.def.id)
      ) {
        this.#choices.push(new Reach(tile));
        addedReachableTileDefIds.add(tile.def.id);
      }
    });
  }

  /**
   * @param {Direction} direction
   */
  #moveCursor(direction) {
    const size = this.#choices.length;
    this.#choosenIndex = (size + this.#choosenIndex + direction) % size;
  }

  #applySelection() {
    if (this.choice instanceof Discard) {
      this.#player.discard(this.#choosenIndex);
      this.#markLastFinishers();
    } else if (this.choice instanceof Finish) {
      HandEvaluator.cacheable(this.#player.hand).calculateScore(this.#player);
      this.displayScore();
      this.end();
    } else if (this.choice instanceof Kan) {
      this.#player.kan(this.choice.tile);
      this.#markLastFinishers();
    }
  }

  #markLastFinishers() {
    this.#player.hand.markLastFinishers(HandEvaluator.cacheable(this.#player.hand).finishers);
  }

  #startNextTurn() {
    const drawn = this.#player.draw();
    if(!drawn) this.end(); 
    this.#resetChoice();
  }

  start() {
    this.#reader.open();
    this.#startNextTurn();
    this.display();
    this.#setEvents();
  }

  end() {
    this.#reader.close();
    process.exit();
  }
}
