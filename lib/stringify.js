/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { EOL } from "node:os";
import { isObj, isArrayOfStringNotEmpty, isString } from "@xan105/is";
import { shouldObj } from "@xan105/is/assert";
import { asBoolean } from "@xan105/is/opt";

function atSymbol(obj, desc){
  if (!obj) return;
  const symbols = Object.getOwnPropertySymbols(obj);
  const symbol = symbols.find((sym) => sym.description === desc);
  return obj[symbol];
}

function stringify (obj, option = {}){
  
  shouldObj(obj);
  shouldObj(option);
  
  const options = {
    whitespace : asBoolean(option.whitespace) ?? false,
    blankLine : asBoolean(option.blankLine) ?? true,
    ignoreGlobalSection: asBoolean(option.ignoreGlobalSection) ?? false,
    quoteString: asBoolean(option.quoteString) ?? false,
    comment: asBoolean(option.comment) ?? true,
    eol: ["\n","\r\n"].includes(option.eol) ? option.eol : EOL
  };

  const separator = options.whitespace ? " = " : "=";
  const allowed = ["boolean", "string", "number", "bigint"];
  
  let result = "";
  const comments = atSymbol(obj, "comment");

  let hasGlobal = false;
  
  for (const name of Object.keys(obj)) 
  {
   const section = obj[name];
   const comment = comments?.[name];
   if (isObj(section)) {
      if (options.blankLine && result !== "") result += options.eol;
      result += `[${name}]` + options.eol;
      
      for (const key of Object.keys(section))
      {
        const value = section[key];
        const comment = comments?.[name]?.[key];
        if (allowed.includes(typeof value)) {
        
         if(options.comment && isArrayOfStringNotEmpty(comment))
          for (const line of comment)
            result += line + options.eol;
        
          const string = (isString(value) && options.quoteString) ? '"' + value.toString() + '"' : value.toString();
          result += key + separator + string + options.eol;
        }
      }
      if(options.comment && isArrayOfStringNotEmpty(atSymbol(comments?.[name], "root")))   
        for (const line of atSymbol(comments?.[name], "root"))
          result += line + options.eol;
   } 
   else if (!options.ignoreGlobalSection && allowed.includes(typeof section)) {
      
      if(options.comment && isArrayOfStringNotEmpty(comment))
        for (const line of comment)
          result += line + options.eol;
       
      const string = (isString(section) && options.quoteString) ? '"' + section.toString() + '"' : section.toString();
      result += name + separator + string + options.eol;
      
     if(options.comment && isArrayOfStringNotEmpty(atSymbol(comments, "root")))
      for (const line of atSymbol(comments, "root"))
        result += line + options.eol;
      
      hasGlobal = true;
      
   }
  }
  
  if (options.comment && 
      !hasGlobal && !options.ignoreGlobalSection && 
      isArrayOfStringNotEmpty(atSymbol(comments, "root"))
  ){
    let header = "";
    for (const line of atSymbol(comments, "root")) header += line + options.eol;
    if (options.blankLine) header += options.eol;
    result = header + result;
  }
  
  return result;
}

export { stringify };