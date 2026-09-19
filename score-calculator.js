import {
  ROUND_UP,
  roundInto,
} from "./math-utils.js";

// 点数の最小単位
const SCORE_MIN_UNIT = 1000;

// スコアを勢いよく増加させる最大の翻数
const MAX_INTENSELY_SCORED = 4;

// 1役満の点数
const GRAND_SCORE_UNIT = 32000;

/**
 * p1 による点数
 * @param {int} p1 有効役の p1 の合計
 */
function calculateScore1(p1) {
  let multiplied = 500;
  let exponentialBase = 2;
  let offset = 0;

  if (p1 > MAX_INTENSELY_SCORED) {
    multiplied = calculateScore1(MAX_INTENSELY_SCORED);
    exponentialBase = Math.pow(2, 1 / 3);
    offset = MAX_INTENSELY_SCORED;
  }
  return roundInto(
    multiplied * Math.pow(exponentialBase, p1 - offset),
    SCORE_MIN_UNIT,
    ROUND_UP,
  );
}

/**
 * p2 による点数
 * @param {int} p2 有効役の p2 の合計
 */
function calculateScore2(p2) {
  return GRAND_SCORE_UNIT * p2;
}

/**
 * 点数
 * @param {int} p1 有効役の p1 の合計
 * @param {int} p2 有効役の p2 の合計
 */
export function calculateScore(p1, p2) {
  return calculateScore1(p1) + calculateScore2(p2);
}
