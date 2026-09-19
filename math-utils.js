export const ROUND_DOWN = 0;
export const ROUND_UP = 1;

/**
 * 銀行屋でない丸め
 * @param {Mumber} x 丸める対象
 * @param {int} type 丸め種別 null で四捨五入
 */
export function round(x, type) {
  const intPart = Math.floor(x);
  switch (type) {
    case ROUND_DOWN:
      return intPart;
    case ROUND_UP:
      return intPart + 1;
    default:
      if (x - intPart < 0.5) return intPart;
      return intPart + 1;
  }  
};

/**
 * 単位指定可能丸め
 * @param {Number} x 丸め対象
 * @param {Number} y 丸め単位
 * @param {int} type 丸め種別 null で四捨五入
 */
export function roundInto(x, y, type) {
  return round(x / y, type) * y; 
};

/**
 * 有効桁数指定可能丸め
 * @param {Number} x 丸め対象
 * @param {Number} y 有効桁数
 * @param {int} type 丸め種別 null で四捨五入
 */
export function roundValid(x, y, type) {
  const intLog10 = Math.floor(Math.log10(x));
  const roundUnit = Math.pow(10, intLog10 - y + 1);
  return roundInto(x, roundUnit, type);
}

/**
 * 等差数列の1要素の値を得る
 * @param {Number} start 初項
 * @param {Number} step 等差 
 * @param {Number} index インデックス (0始まり)
 * @returns 
 */
export function getValueInStepSequence(start, step, index) {
  return start + step * index;
}

/**
 * rangeStart 以上 rangeEnd 以下に収まる
 * 等差 sequenceStep 長さ length の数列を、
 * 初項を startStep ずつ増やして列挙する
 * @param {Number} rangeStart 範囲下限
 * @param {Number} rangeEnd 範囲上限
 * @param {Number} sequenceStep 数列の等差
 * @param {Number} length 数列の長さ
 * @param {Number?} startStep = 1 数列の初項の増分
 */
export function getStepSequencesInRange(
  rangeStart,
  rangeEnd,
  sequenceStep,
  length,
  startStep = 1,
) {
  const sequences = [];
  let sequenceStart = rangeStart;
  while (getValueInStepSequence(sequenceStart, sequenceStep, length - 1) <= rangeEnd) {
    const sequence = new Array(length).fill(sequenceStart).map((e, i) => {
      return getValueInStepSequence(e, sequenceStep, i);
    });
    sequences.push(sequence);
    sequenceStart += startStep;
  }
  return sequences;
}
