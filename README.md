About
=====

An opinionated ini encoder/decoder with comment-preserving feature.

Originally created due to several issues when using npm/ini and alternatives.

📦 Scoped `@xan105` packages are for my own personal use but feel free to use them.

Example
=======

```js
import { parse } from "@xan105/ini";
import { readFile } from "node:fs/promises";

const file = await readFile("path/to/ini", "utf8");
const ini = parse(file);
console.log(ini);
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
  
  + `bool?:boolean` (true)
    String to boolean.
    
  + `number?:boolean` (false)
    String to number or bigint.
    
  + `unsafe?:boolean` (false)
    Set to true to keep unsafe integer instead of bigint.
    
  + `unquote?:boolean` (false)
    Remove leading and trailing quotes (" or ').

- `ignoreGlobalSection?: boolean` (false)
  Ignore keys without a section aka 'Global' section.
  
- `sectionFilter?: string[]`
  List of section name to filter out.
  
- `comment?: boolean` (true)
  When set to true comments are stored in the symbol property `comment` of the returned object otherwise they are ignored.
  
- `removeInline?:boolean` (false)
  Remove illegal inline comment<br/>
  ⚠️ Can have false positive. **Use with caution**.

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

- `whitespace?:boolean` (false)
  Whether to put whitespace around the delimiter `=`.
  
- `blankLine?:boolean` (true)
  Add blank lines between sections.

- `ignoreGlobalSection?:boolean` (false)
  Ignore root properties (not under any namespace if you will).
  
- `quoteString?:boolean` (false)
  Quote string values using double quotes ("...").
  
- `eol?:string` (system's EOL)
  Either "\n" _(POSIX)_ or "\r\n" _(Windows)_.

#### 📝 Implementation notice

- Sections shall not be nested.
- Case sensitive.
- Empty sections are allowed.
- Key value can only be a boolean, number, bigint or string.
