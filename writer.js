import {
  LF,
} from './constants.js';

import {
  CLEAR,
} from './escape-sequences.js'

import {
  Color,
} from './color.js';

import { stdout } from 'process';

export class Writer {
  #stream;

  /**
   * @param {Stream?} stream
   */
  constructor(stream = stdout) {
    this.#stream = stream;
  }

  reset() {
    this.#stream.write(CLEAR + Color.defaultBack + Color.defaultFore);
  }

  /**
   * @param {String} text
   */
  writeLine(text) {
    this.#stream.write(`${text ?? ''}${LF}`);
  }
}
