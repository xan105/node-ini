/*
MIT License

Copyright (c) 2021 Anthony Beaumont

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

const {autoType, param } = require("./autoType.cjs");

function parse (string, option = {}){

  const options = {
    autoType: param(option.autoType),
    ignoreGlobalSection: option.ignoreGlobalSection || false,
    sectionFilter: Array.isArray(option.sectionFilter) && option.sectionFilter.every((s) => typeof s === 'string') ? option.sectionFilter : []
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
      const value = autoType(line.slice(pos + 1).trim(), options.autoType);
      
      if (section && ignoreSection === false) result[section][key] = value;
      else if (!section && options.ignoreGlobalSection === false) result[key] = value;
    } 
  }

  return result;
}

module.exports = { parse };