export const EXIT = '\u0003';
export const CLEAR = '\x1Bc';
export const CR = '\x0d';
export const LF = '\x0a';
export const UP = '\x1b[A';
export const DOWN = '\x1b[B';
export const RIGHT = '\x1b[C';
export const LEFT = '\x1b[D';

export const FORE_COLOR_PREFIX = '\x1b[38;2;';
export const BACK_COLOR_PREFIX = '\x1b[48;2;';
export const COLOR_SUFFIX = 'm';
export const COLOR_PATTERN = /\x1b\[[34]8;2;.*?m/g;
