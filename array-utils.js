/**
 * @param {Array} array
 * @param {int} innerLength
 */
export function splitArray(array, innerLength) {
  const copy = [...array];
  const split = [];
  while (copy.length) {
    const part = [];
    while (copy.length && part.length < innerLength) {
      part.push(copy.shift());
    }
    split.push(part);
  }
  return split;
}

/**
 * @param {Array} array
 * @param {int} pickupCount
 * @returns {Array} new reference
 */
export function shuffleArray(array, pickupCount) {
  const truePickupCount = Math.min(pickupCount, array.length);
  const copy = [...array];
  const shuffled = [];
  while (shuffled.length < truePickupCount) {
    shuffled.push(...copy.splice(Math.floor(Math.random() * copy.length), 1));
  }
  return shuffled;
}

/**
 * 配列の中から検索対象のそれぞれうち最初に見つかった要素を取り出す
 * 取り出された要素は配列から取り除かれる
 *  @param {Array} source 検索源
 *  @param {Array} targets 検索対象
 *  @param {Function} sourceMapper
 *    @param {any} 検索源のひとつ
 *    @returns {Primitive} 検索される値
 *  @param {Function} targetMapper
 *    @param {any} 検索対象のひとつ
 *    @returns {Primitive} 検索する値
 *  @returns {Primitive[]}
 */
export function pickupFoundFirst(
  source,
  targets,
  sourceMapper = (val) => val,
  targetMapper = (val) => val,
) {
  const targetToRestCount = targets.reduce((acc, e) => {
    const targetVal = targetMapper(e);
    acc.set(targetVal, (acc.get(targetVal) ?? 0) + 1);
    return acc;
  }, new Map());
  const picked = [];
  const rest = [];
  while (source.length > 0) {
    const element = source.shift();
    const mapped = sourceMapper(element);
    const restCount = targetToRestCount.get(mapped);
    if (restCount > 0) {
      picked.push(element);
      targetToRestCount.set(mapped, restCount - 1);
    } else {
      rest.push(element);
    }
  }
  source.push(...rest);
  return picked;
};

/**
 * 作成・要素の追加・要素の削除のたびに自動でソートする配列
 * 内部で保持される配列は新しい参照になる
 */
export class AutoSortedArray {
  #contents;
  #compareFn;

  /**
   * @param {Array} elements
   * @param {Function} compareFn @see Array.toSorted
   */
  constructor(elements, compareFn) {
    this.#contents = elements.toSorted(compareFn);
    this.#compareFn = compareFn;
  }
  /**
   * @param {any} element
   */
  add(element) {
    this.#contents.push(element);
    this.#contents.sort(this.#compareFn);
  }
  /**
   * @param {int} index
   * @returns {any} removed element
   */
  remove(index) {
    const removed = this.#contents.splice(index, 1);
    this.#contents.sort(this.#compareFn);
    return removed[0];
  }

  /**
   * @returns {Array}
   */
  get contents() {
    return this.#contents;
  }

  /**
   * @returns {int}
   */
  get length() {
    return this.#contents.length;
  }
}

/**
 * 復元抽出の順列
 * @param {any[]} pool
 * @param {int} length
 * @returns {any[][]}
 */
export function getReplacementPermutations(pool, length) {
  if (length <= 0) return [[]];
  if (length === 1) return pool.map((el) => [el]);
  return pool.flatMap((el) => {
    return getReplacementPermutations(pool, length - 1).map(
      (pat) => [...pat, el],
    );
  });
}

/**
 * @param {int[]} arr
 * @returns {int[]}
 */
export function bucketSort(arr) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const valueRange = max - min + 1;
  const counts = new Array(valueRange).fill(0);
  arr.forEach((e) => counts[e - min]++);
  return counts.flatMap((c, i) => new Array(c).fill(min + i));
}

/**
 * 非復元抽出の組み合わせ
 * @param {Primitive[]} pool
 * @param {int} count
 * @returns {Primitive[][]}
 */
export function getNoReplacementCombinations(pool, count) {
  const foundUniqueCombinations = new Set();
  return getReplacementPermutations([true, false], pool.length).filter((bools) => {
    return bools.filter((v) => v).length === count;
  }).map((bools) => {
    return bools.reduce((acc, v, i) => {
      if (v) acc.push(pool[i]);
      return acc;
    }, []);
  }).filter((combination) => {
    const uniqueCombination = bucketSort(combination).join(' ');
    const found = foundUniqueCombinations.has(uniqueCombination);
    foundUniqueCombinations.add(uniqueCombination);
    return !found;
  });
}
