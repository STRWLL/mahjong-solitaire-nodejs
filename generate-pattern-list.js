import { LF } from "./constants.js";
import { allPatterns } from "./patterns/index.js";
import fs from 'fs';

const lines = [];

allPatterns.forEach((pattern) => {
  lines.push(pattern.toStringWithDescription());
  lines.push('');
});

lines.push('*このゲームでの定義は一般的なものと異なる場合があります。');
lines.push('*このゲームでは山と嶺上の区別はなく、嶺上開花と海底撈月は複合します。');
lines.push('*門前なので、三連刻 + 三暗刻 と 平和 + 一色三順 は、');
lines.push(' その部分だけなら同点ですが、その部分を順子とする場合と刻子とする場合それぞれで');
lines.push(' 他に付く役を洗い出して点数を計算し、高得点法により高い方が採用されます。');
lines.push(' 上記の上でもなお同点の場合は、より多くの部分を刻子とする面子構成が優先されます。');

fs.writeFileSync('採用役一覧.txt', lines.join(LF));
