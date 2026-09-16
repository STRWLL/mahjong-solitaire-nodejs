import {
  CR,
  LF,
  EXIT,
  LEFT,
  RIGHT,
} from './escape-sequences.js'

import { stdin } from 'process';

export class KeyReader {
  #stream;
  #previousKeys;
  #nextKeys;
  #enterKeys;
  #exitKeys;
  #onPrevious = new Function();
  #onNext = new Function();
  #onEnter = new Function();
  #onExit = new Function();

  /**
   * @param {Stream} stream
   * @param {String[]} previousKeys
   * @param {String[]} nextKeys
   * @param {String[]} enterKeys
   * @param {String[]} exitKeys
   */
  constructor(
    stream = stdin,
    previousKeys = [LEFT],
    nextKeys = [RIGHT],
    enterKeys = [CR, LF],
    exitKeys = [EXIT],
  ) {
    this.#stream = stream;
    this.#previousKeys = new Set(previousKeys);
    this.#nextKeys = new Set(nextKeys);
    this.#enterKeys = new Set(enterKeys);
    this.#exitKeys = new Set(exitKeys);
  }

  open() {
    this.#stream.setRawMode(true);
    this.#stream.setEncoding('utf8');
    this.#setEvents();
  }

  close() {
    this.#stream.pause();
  }

  #setEvents() {
    this.#stream.on('data', (data) => {
      if (this.#exitKeys.has(data)) this.#onExit();
      if (this.#previousKeys.has(data)) this.#onPrevious();
      if (this.#nextKeys.has(data)) this.#onNext();
      if (this.#enterKeys.has(data)) this.#onEnter();
    });
  }

  /**
   * @param {Function} callback
   */
  onPrevious(callback) {
    this.#onPrevious = callback;
  }

  /**
   * @param {Function} callback
   */
  onNext(callback) {
    this.#onNext = callback;
  }

  /**
   * @param {Function} callback
   */
  onEnter(callback) {
    this.#onEnter = callback;
  }

  /**
   * @param {Function} callback
   */
  onExit(callback) {
    this.#onExit = callback;
  }
};
