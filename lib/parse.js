/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { isArrayOfString } from "@xan105/is";
import { shouldString } from "@xan105/is/assert";
import { translate } from "./translate.js";

const param = (option) => {
  if (option === true)
    return { bool: true, number: true, unquote: true };
  else if (option === false)
    return { bool: false, number: false, unquote: false };
  else
    return { bool: option?.bool ?? true, number: option?.number || false, unquote: option?.unquote || false };
};

function parse (string, option = {}){
  
  shouldString(string);
  
  const options = {
    translate: param(option.translate),
    ignoreGlobalSection: option.ignoreGlobalSection || false,
    sectionFilter: isArrayOfString(option.sectionFilter) ? option.sectionFilter : []
  };
  
  let result = Object.create(null);
  
  let section = null;
  let ignoreSection = false;

  const lines = string.split(/[\r\n]+/g);
  for (const _line of lines) 
  {
    if (!_line || _line.match(/^\s*[;#]/)) continue; //ignore empty and comment

    const line = _line.trim();

    if (line[0] === "[") //SECTION
    { 
      const match = line.match(/^\[([^\]]*)\]/);
      if (match && match[1] !== undefined) {
        section = match[1].trim();
        if (section === '__proto__') continue; //not allowed
        
        ignoreSection = options.sectionFilter.includes(section) ? true : false;
        
        if (ignoreSection === false && !result[section]) result[section] = Object.create(null);
      }
      continue
    } 
    else if (line.includes("=")) //KEY
    {
      const pos = line.indexOf("=");
      const key = line.slice(0, pos).trim();
      const value = translate(line.slice(pos + 1).trim(), options.translate);
      
      if (section === '__proto__' || key === '__proto__') continue; //not allowed
      
      if (section && ignoreSection === false) result[section][key] = value;
      else if (!section && options.ignoreGlobalSection === false) result[key] = value;
    } 
  }

  return result;
}

export { parse };