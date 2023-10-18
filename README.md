About
=====

An opinionated ini encoder/decoder with comment-preserving feature.

Originally created due to several issues when using npm/ini and alternatives.

📦 Scoped `@xan105` packages are for my own personal use but feel free to use them.

Example
=======

```js
import { parse, stringify } from "@xan105/ini";
import { readFile, writeFile } from "node:fs/promises";

const file = await readFile("path/to/ini", "utf8");
const data = parse(file);
//do something
await writeFile("path/to/ini", data, "utf8");
```

Install
=======

```
npm install @xan105/ini
```

API
===

⚠️ This module is only available as an ECMAScript module (ESM) starting with version 2.0.0.<br />
Previous version(s) are CommonJS (CJS) with an ESM wrapper.

## Named export

### `parse(string: string, option?: object): object`

Decode the ini-style formatted string into an object.

#### ⚙️ Options

- `translate:? boolean | object`

  Auto string convertion.
  
  💡 Translate option accepts an object for granular control or a boolean which will force all following options to true/false:
  
  + `bool?:boolean` (true)<br />
    String to boolean.
    
  + `number?:boolean` (false)<br />
    String to number or bigint.
    
  + `unsafe?:boolean` (false)<br />
    Set to true to keep unsafe integer instead of bigint.
    
  + `unquote?:boolean` (false)<br />
    Remove leading and trailing quotes (" or ').

- `ignoreGlobalSection?: boolean` (false)<br />
  Ignore keys without a section aka 'Global' section.
  
- `sectionFilter?: string[]`<br />
  List of section name to filter out.
  
- `comment?: boolean` (true)<br />
  When set to true comments are stored in the symbol property `comment` of the returned object otherwise they are ignored.
  
- `removeInline?:boolean` (false)<br />
  Remove illegal inline comment. ⚠️ Can have false positive. **Use with caution**.

#### 📝 Implementation notice

- Sections cannot be nested.
- Comments start with `;` or `#`.
- Inline comments are not allowed !
  + Section: they are ignored.
  + Value: they are considered as part of the value _unless_ you use the `removeInline` option to strip them.
- Duplicate names: override first occurrence.
- Case sensitive.
- Name/value delimiter is "=" and is mandatory.
- Whitespace around section name, key name and key value are trimmed.

#### ⚠️ JSON compatibility

Some integers will be represented as **BigInt** due to their size if the related translate options are used.<br/>
**BigInt is not a valid value in the JSON spec**.<br/>
As such when stringify-ing the returned object to JSON you'll need to handle the JSON stringify replacer function to prevent it to fail.

A common workaround is to represent them as a string:

```js
JSON.stringify(data, function(key, value) {
  if(typeof value === "bigint")
    return value.toString();
  else
    return value;
});
```

### `stringify(obj: object, option?: object): string`

Encode the object obj into an ini-style formatted string.

#### ⚙️ Options

- `whitespace?:boolean` (false)<br />
  Whether to put whitespace around the delimiter `=`.
  
- `blankLine?:boolean` (true)<br />
  Add blank lines between sections.

- `ignoreGlobalSection?:boolean` (false)<br />
  Ignore root properties (not under any namespace if you will).
  
- `quoteString?:boolean` (false)<br />
  Quote string values using double quotes ("...").
  
- `comment?: boolean` (true)<br />
  Restore comments from the symbol property `comment` of the given object (if any).
  
- `eol?:string` (system's EOL)<br />
  Either "\n" _(POSIX)_ or "\r\n" _(Windows)_.

#### 📝 Implementation notice

- Sections shall not be nested.
- Case sensitive.
- Empty sections are allowed.
- Key value can only be a boolean, number, bigint or string.
