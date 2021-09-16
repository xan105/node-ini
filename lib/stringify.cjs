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

const { EOL } = require("os");

function stringify (obj, option = {}){

  const options = {
    whitespace : option.whitespace || false,
    blankLine : option.blankLine ?? true,
    ignoreGlobalSection: option.ignoreGlobalSection || false,
    quoteString: option.quoteString || false
  };
  
  const separator = options.whitespace ? ' = ' : '=';
  
  let result = '';

  for (const name of Object.keys(obj)) 
  {
   const section = obj[name];
   if (options.ignoreGlobalSection === false && ['boolean', 'string', 'number'].includes(typeof section)) {
      const string = (typeof section === 'string' && options.quoteString) ? '"' + section.toString() + '"' : section.toString();
      result += name + separator + string + EOL;
   } else if (section && typeof section === 'object') {
      if (options.blankLine && result !== '') result += EOL;
      result += `[${name}]` + EOL; 
      for (const key of Object.keys(section))
      {
        const value = section[key];
        if (['boolean', 'string', 'number'].includes(typeof value)) {
          const string = (typeof value === 'string' && options.quoteString) ? '"' + value.toString() + '"' : value.toString();
          result += key + separator + string + EOL;
        }
      }
   }
  }

  return result;
}

module.exports = { stringify };