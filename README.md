Yet another (_opinionated_) ini encoder/decoder for Node.js.

Usage example
-------------

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
//ESM
import * as ini from '@xan105/ini';
import { promises as fs} from 'fs';
//CommonJS
const ini = require('@xan105/ini');
const { promises : fs } = require('fs');

fs.readFile("path/to/ini","utf8")
.then((content)=>{
  const data = ini.parse(content);
  console.log(data);
}).catch(console.error);

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
-------

```
npm install @xan105/ini
```

API
---

## parse(string: string, [option: obj]): obj

Decode the ini-style formatted string into an object.

### option ⚙️

|name|type|default|description|
|----|----|-------|-----------|
|autoType|bool or {bool...}|{...}|Auto string to boolean / number and unquote string**|
|ignoreGlobalSection|bool|false|Ignore keys without a section aka 'Global' section|
|sectionFilter|string[]|[]|List of section name to filter out|

### Auto type**

autoType option accepts the following obj for granular control or a boolean true/false which force all options to true/false:

|name|type|default|description|
|----|----|-------|-----------|
|bool|bool|true|String to boolean|
|number|bool|false|String to number|
|unquote|bool|false|Remove leading and trailing quote (" or ') in a string value|

_Example_: 

```js
ini.parse(string); //default
ini.parse(string, {autoType : true}); //every autotype to true
ini.parse(string, {autoType : { //granular autotype
  bool: true,
  number: true
}, ignoreGlobalSection: true}); //with an additional parse option

```

### Implementation notice

- Sections cannot be nested
- Comments are ignored (! and #)
- Inline comments are not allowed !
- Duplicate names : override first occurrence
- Case sensitive
- Name/value delimiter is "=" and is mandatory
- Whitespace around section name, key name and key value are trimmed.

## stringify(obj: obj, [option: obj]: string

Encode the object obj into an ini-style formatted string.

### option ⚙️

|name|type|default|description|
|----|----|-------|-----------|
|whitespace|bool|false|Whether to put whitespace around the delimiter =|
|blankLine|bool|true|Add blank lines between sections|
|ignoreGlobalSection|bool|false|Ignore root properties (not under any namespace if you will)|
|quoteString|bool|false|Quote string values using double quotes ("...")|

### Implementation notice

- Sections shall not be nested
- Case sensitive
- Empty section are allowed
- Key value can only be a boolean, number or string
