import { parse, stringify } from "../lib/index.js";
import { readFile, writeFile } from "node:fs/promises";

//const file = await readFile("./sample/php.ini", "utf8");
const file = await readFile("./steam_emu.ini", "utf8");

const obj = parse(file, { keepComment: true });
//console.dir(obj);
//console.log("---------");
console.dir(obj[Object.getOwnPropertySymbols(obj).find((symbol) => symbol.description === "comment")]);

const string = stringify(obj, { restoreComment: true, blankLine: true });
//await writeFile("./php2.ini", string, "utf8");
await writeFile("./steam_emu2.ini", string, "utf8");