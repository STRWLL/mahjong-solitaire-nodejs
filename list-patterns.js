import { allPatterns } from "./patterns/index.js";

console.log();
console.log('定義が一般的なものと異なる場合があります。仕様です。');
console.log();
allPatterns.forEach((pattern) => {
  console.log(pattern.toStringWithDescription());
  console.log();
});
