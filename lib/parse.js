/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { shouldString, shouldObj } from "@xan105/is/assert";
import { isBoolean } from "@xan105/is";
import { asBoolean, asArrayOfStringNotEmpty } from "@xan105/is/opt";
import { translate } from "./translate.js";

function parse (string, option = {}){
  
  shouldString(string);
  shouldObj(option);
  
  if (isBoolean(option.translate)) {
    option.translate = { 
      bool: option.translate, 
      number: option.translate, 
      unsafe: option.translate, 
      unquote: option.translate
    };
  }

  const options = {
    translate: {
      bool: asBoolean(option.translate?.bool) ?? true,
      number: asBoolean(option.translate?.number) ?? false,
      unsafe: asBoolean(option.translate?.unsafe) ?? false,
      unquote: asBoolean(option.translate?.unquote) ?? false
    },
    ignoreGlobalSection: asBoolean(option.ignoreGlobalSection) ?? false,
    sectionFilter: asArrayOfStringNotEmpty(option.sectionFilter) ?? []
  };

  const result = Object.create(null);
  let section = null, ignoreSection = false;

  const lines = string.split(/[\r\n]+/g);
  for (const ln of lines) 
  {
    if (!ln || ln.match(/^\s*[;#]/)) continue; //ignore empty and comment

    const line = ln.trim();

    if (line.at(0) === "[") //SECTION
    { 
      const match = line.match(/^\[([^\]]*)\]/);
      if (match && match[1] !== undefined) {
        section = match[1].trim();
        if (section === "__proto__") continue; //not allowed
        
        ignoreSection = options.sectionFilter.includes(section);
        if (section && ignoreSection === false && !result[section]) 
          result[section] = Object.create(null);
      }
      continue
    } 
    else //KEY
    {
      const pos = line.indexOf("=");
      if (pos < 1) continue //ignore missing '=' and empty key; better safe than sorry
      const key = line.slice(0, pos).trim();
      if (section === "__proto__" || key === "__proto__") continue; //not allowed
      
      const value = translate(line.slice(pos + 1).trim(), 
        options.translate
      );

      if (section && ignoreSection === false) 
        result[section][key] = value;
      else if (!section && options.ignoreGlobalSection === false) 
        result[key] = value;
    } 
  }

  return result;
}

export { parse };