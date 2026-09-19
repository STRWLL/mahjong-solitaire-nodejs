import { LF } from "./constants.js";
import fs from 'fs';
import { allTileDefinitions } from "./tile.js";
import { Color } from "./color.js";

const lines = [];
lines.push('画面デザインの都合上、牌は半角3文字で表現されます');
allTileDefinitions.forEach((def) => {
  lines.push(`${Color.remove(def.label)} ${def.text}`);
});

fs.writeFileSync('牌一覧.txt', lines.join(LF));
