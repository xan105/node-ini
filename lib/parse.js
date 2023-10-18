/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { shouldString, shouldObj } from "@xan105/is/assert";
import { asBoolean, asArrayOfStringNotEmpty } from "@xan105/is/opt";
import { translate } from "./translate.js";

function parse (string, option = {}){
  shouldString(string);
  shouldObj(option);

  const options = {
    translate: {
      bool: asBoolean(option.translate) ?? asBoolean(option.translate?.bool) ?? true,
      number: asBoolean(option.translate) ?? asBoolean(option.translate?.number) ?? false,
      unsafe: asBoolean(option.translate) ?? asBoolean(option.translate?.unsafe) ?? false,
      unquote: asBoolean(option.translate) ?? asBoolean(option.translate?.unquote) ?? false
    },
    ignoreGlobalSection: asBoolean(option.ignoreGlobalSection) ?? false,
    sectionFilter: asArrayOfStringNotEmpty(option.sectionFilter) ?? [],
    comment: asBoolean(option.comment) ?? true,
    removeInline: asBoolean(option.removeInline) ?? false
  };

  const result = Object.create(null);
  const comments = Object.create(null);

  let section = null, ignoreSection = false, comment = [];

  //Save orphan comment:
  //Comments are saved by their corresponding key
  //Sometimes there will be orphan comment (not tied to any key)
  const save = function(){
      if (section && !ignoreSection){
        Object.defineProperty(comments[section], Symbol("root"), { //Symbol to avoid name clashing
          enumerable: true, //don't "hide" it
          configurable: false,
          writable: true,
          value: Array.from(comment)
        }); 
      } else if (!section && !options.ignoreGlobalSection){
        Object.defineProperty(comments, Symbol("root"), { //Symbol to avoid name clashing
          enumerable: true, //don't "hide" it
          configurable: false,
          writable: true,
          value: Array.from(comment)
        });
      }
      comment = [];
  };

  const lines = string.split(/\r?\n/g);
  for (const ln of lines) 
  {
    if (!ln) continue; //ignore empty
    
    //keep or ignore comment
    if(/^\s*[;#]/.test(ln)){
      if(options.comment && !ignoreSection) comment.push(ln);
      continue;
    }
    
    const line = options.removeInline ? 
                 ln.replace(/\s+[;#].+$/, "").trim() : //remove illegal inline comment
                 ln.trim();

    if (line.at(0) === "[") //SECTION
    { 
      if (comment.length > 0) save(); //from previous section

      const match = line.match(/^\[([^\]]*)\]/);
      if (match && match[1] !== undefined) {
        section = match[1].trim();
        if (section === "__proto__") { 
          ignoreSection = true;
          continue; //not allowed
        }
        
        ignoreSection = options.sectionFilter.includes(section);
        if (section && !ignoreSection){
          result[section] ??= Object.create(null);
          comments[section] ??= Object.create(null);
        }   
      } else ignoreSection = true;
    } 
    else //KEY
    {
      const pos = line.indexOf("=");
      if (pos < 1) continue //ignore missing '=' and empty key; better safe than sorry
      const key = line.slice(0, pos).trim();
      if (key === "__proto__") {
        comment = [];
        continue; //not allowed
      }
      
      const raw = line.slice(pos + 1).trim();
      const value = translate(raw, options.translate);

      if (section && !ignoreSection){
        result[section][key] = value;
        if (comment.length > 0) comments[section][key] = Array.from(comment);
      }
      else if (!section && !options.ignoreGlobalSection){
        result[key] = value;
        if (comment.length > 0) comments[key] = Array.from(comment);
      }
      comment = [];
    } 
  }
  if (comment.length > 0) save(); //from end of file
  
  if (options.comment){
    Object.defineProperty(result, Symbol("comment"), { //Symbol to avoid name clashing
      enumerable: false,
      configurable: false,
      writable: false,
      value: comments
    });
  }
  return result;
}

export { parse };