/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { EOL } from "node:os";
import { isObj } from "@xan105/is";
import { shouldObj } from "@xan105/is/assert";

function stringify (obj, option = {}){
  
  shouldObj(obj);
  
  const options = {
    whitespace : option.whitespace || false,
    blankLine : option.blankLine ?? true,
    ignoreGlobalSection: option.ignoreGlobalSection || false,
    quoteString: option.quoteString || false,
    eol: ["\n","\r\n"].includes(option.eol) ? option.eol : EOL
  };

  const separator = options.whitespace ? ' = ' : '=';
  const allowed = ['boolean', 'string', 'number', 'bigint'];
  
  let result = '';

  for (const name of Object.keys(obj)) 
  {
   const section = obj[name];
   if (options.ignoreGlobalSection === false && allowed.includes(typeof section)) {
      const string = (typeof section === 'string' && options.quoteString) ? '"' + section.toString() + '"' : section.toString();
      result += name + separator + string + options.eol;
   } else if (isObj(section)) {
      if (options.blankLine && result !== '') result += options.eol;
      result += `[${name}]` + options.eol; 
      for (const key of Object.keys(section))
      {
        const value = section[key];
        if (allowed.includes(typeof value)) {
          const string = (typeof value === 'string' && options.quoteString) ? '"' + value.toString() + '"' : value.toString();
          result += key + separator + string + options.eol;
        }
      }
   }
  }

  return result;
}

export { stringify };