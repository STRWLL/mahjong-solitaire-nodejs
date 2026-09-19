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
  Discard,
  Finish,
  Kan,
} from './choice.js';

import process from 'process';

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
  #choiceIndex = 0;

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
    return this.#choices[this.#choiceIndex];
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

    // choice
    this.#writer.writeLine(this.#choices.map(String).join(' '));
    this.#writer.writeLine(this.#choices.map((c, i) => {
      return c.getCursorBox(i === this.#choiceIndex);
    }).join(' '));
    this.#writer.writeLine(this.choice.description);
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
    if (this.choice instanceof Discard) {
      finishers = HandEvaluator.cacheable(hand.removePerview(this.#choiceIndex)).finishers;
    } else if (this.choice instanceof Kan) {
      const kannedHand = hand.clone().kan(this.choice.tile)
      finishers = HandEvaluator.cacheable(kannedHand).finishers;
    }
    this.#writer.writeLine(`finishers: ${finishers.length ? finishers.map(String).join(' ') : 'none'}`);
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
    this.#choices = hand.contents.map((tile) => new Discard(tile));
    
    if (HandEvaluator.cacheable(hand).finishable) {
      this.#choices.push(new Finish());
      this.#choiceIndex = this.#choices.length - 1;
    } else {
      this.#choiceIndex = this.#player.hand.contents.findIndex((tile) => {
        return tile.def.id === this.#player.hand.lastDrawn.def.id;
      });
    }

    // 画面表示前にそれぞれの打牌の待ちを洗い出しておく
    this.#choices.forEach((choice, index) => {
      if (choice instanceof Discard) {
        HandEvaluator.cacheable(hand.removePerview(index)).finishers;
      }
    });

    this.#player.hand.tilesKannable.forEach((kannable) => {
      const firstIndex = this.#player.hand.contents.findIndex((tile) => {
        return tile.def.id === kannable.def.id;
      });
      this.#choices.splice(firstIndex, 1, new Kan(kannable));
    });
  }

  /**
   * @param {Direction} direction
   */
  #moveCursor(direction) {
    const size = this.#choices.length;
    this.#choiceIndex = (size + this.#choiceIndex + direction) % size;
  }

  #applySelection() {
    if (this.choice instanceof Discard) {
      this.#player.discard(this.#choiceIndex);
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
