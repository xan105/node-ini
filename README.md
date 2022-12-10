About
=====

Yet another (_opinionated_) ini encoder/decoder for Node.js.

Example
=======

Consider an ini-file that looks like this:

```ini
; this comment is being ignored
# that one as well

scope = global
 answer= 42
password type = string
yes = true

[Database]
password = some very*difficult=password:
database-name =my-project-db

[DB.default]
datadir = /var/lib/data
datadirWin = "C:\Windows"
```

Node

```js
import { parse } from '@xan105/ini';
import { readFile } from 'node:fs/promises';

const file = await readFile("path/to/ini","utf8");
const ini = parse(file);
console.log(ini);
```

Output:

```json
{
  "scope": "global",
  "answer": "42",
  "password type": "string",
  "yes": true,
  "Database": {
    "password": "some very*difficult=password:",
    "database-name": "my-project-db"
  },
  "DB.default": {
    "datadir": "/var/lib/data",
    "datadirWin": "C:\\Windows"
  }
}
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

### `parse(string: string, option?: obj): obj`

Decode the ini-style formatted string into an object.

#### option ⚙️

|name|type|default|description|
|----|----|-------|-----------|
|translate|boolean or {...boolean}¹|{...}|Auto string to boolean / number and unquote string|
|ignoreGlobalSection|boolean|false|Ignore keys without a section aka 'Global' section|
|sectionFilter|string[]|[]|List of section name to filter out|

#### Translate¹

Translate option accepts the following obj for granular control or a boolean true/false which force all options to true/false:

|name|type|default|description|
|----|----|-------|-----------|
|bool|boolean|true|String to boolean|
|number|boolean|false|String to number or [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)|
|unsafe|boolean|false|Set to true to keep unsafe integer instead of bigint|
|unquote|boolean|false|Remove leading and trailing quote (" or ')|

_Example_: 

```js
parse(string); //default
parse(string, {translate : true}); //every to true
parse(string, {translate : { //granular
  bool: true,
  number: true
}, ignoreGlobalSection: true}); //with an additional parse option

```

#### Implementation notice

- Sections cannot be nested
- Comments are ignored (; and #)
- Inline comments are not allowed !
- Duplicate names : override first occurrence
- Case sensitive
- Name/value delimiter is "=" and is mandatory
- Whitespace around section name, key name and key value are trimmed.

### `stringify(obj: obj, option?: obj): string`

Encode the object obj into an ini-style formatted string.

#### option ⚙️

|name|type|default|description|
|----|----|-------|-----------|
|whitespace|boolean|false|Whether to put whitespace around the delimiter =|
|blankLine|boolean|true|Add blank lines between sections|
|ignoreGlobalSection|boolean|false|Ignore root properties (not under any namespace if you will)|
|quoteString|boolean|false|Quote string values using double quotes ("...")|
|eol|string|system's EOL|Either "\n" _(POSIX)_ or "\r\n" _(Windows)_|

#### Implementation notice

- Sections shall not be nested
- Case sensitive
- Empty sections are allowed
- Key value can only be a boolean, number, [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) or string
