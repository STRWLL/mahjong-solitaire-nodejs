import { allPatterns } from "./patterns/index.js";

console.log();
console.log('定義が一般的なものと異なる場合があります。仕様です。');
console.log('山と嶺上の区別はなく、嶺上開花と海底撈月は複合します。');
console.log();
allPatterns.forEach((pattern) => {
  console.log(pattern.toStringWithDescription());
  console.log();
});
