import fs from "node:fs";
import path from "node:path";
import t from "tap";
import * as ini from "../lib/index.js";

t.test("read write read equivalence (comment)", t => {
  const originalFile = path.resolve("./test/sample/steam_emu.ini");
  const originalData = fs.readFileSync(originalFile,"utf8");
  const data = ini.parse(originalData, { comment: true });
  const result = ini.stringify(data, { comment: true });

  t.strictSame(originalData, result, 'is stringify producing same result as original');
  t.end();
});