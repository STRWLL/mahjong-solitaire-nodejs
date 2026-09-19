import {
  FORE_COLOR_PREFIX,
  BACK_COLOR_PREFIX,
  COLOR_SUFFIX,
  COLOR_PATTERN,
} from './escape-sequences.js';

export class Color {
  #pixel
  /**
   * @param {Number} r 
   * @param {Number} g 
   * @param {Number} b 
   */
  constructor(r, g, b) {
    this.#pixel = [r, g, b];
  }
  /**
   * @returns {String}
   */
  get fore() {
    return FORE_COLOR_PREFIX + this.#pixel.join(';') + COLOR_SUFFIX;
  }
  /**
   * @returns {String}
   */
  get back() {
    return BACK_COLOR_PREFIX + this.#pixel.join(';') + COLOR_SUFFIX;
  }

  static get defaultFore() {
    return new Color(224, 224, 224).fore;
  }

  static get defaultBack() {
    return new Color(0, 0, 0).back;
  }

  /**
   * @param {String} str 
   * @param  {...String} colors 
   * @returns {String}
   */
  static apply(str, ...colors) {
    const chars = Array.from(str);
    const resultChars = [];
    while (chars.length) {
      const color = colors.shift();
      const char = chars.shift();
      resultChars.push(color, char);
    }
    resultChars.push(
      Color.defaultBack,
      Color.defaultFore,
    );
    return resultChars.join('');
  }

  /**
   * @param {String} str
   * @param {String} color
   */
  static applyAll(str, color) {
    return [
      color,
      str,
      Color.defaultBack,
      Color.defaultFore,
    ].join('');
  }

  /**
   * @param {String} str 
   */
  static remove(str) {
    return str.replace(COLOR_PATTERN, '');
  }
}

export const rose = new Color(192, 0, 0).fore;
export const leaf = new Color(48, 192, 96).fore;
export const cerulean = new Color(0, 128, 255).fore;
export const amber = new Color(255, 192, 0).fore;
export const lavender = new Color(192, 128, 255).fore;
export const water = new Color(192, 224, 255).fore;
export const electron = new Color(64, 255, 192).fore;
export const gray = new Color(128, 128, 128).fore;
