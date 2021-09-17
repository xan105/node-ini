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

function autoType (string, options = {}){
  
  //Unquote string
  if(options.unquote === true){
    if (string[0] === '"' && string.slice(-1) === '"') string = string.replace(/^"|"$/g, '');
    else if (string[0] === "'" && string.slice(-1) === "'") string = string.replace(/^'|'$/g, '');
  }
  
  //Bool
  if(options.bool === true) {
    if (string === "true") return true;
    if (string === "false") return false;
  }

  //Number
  if(options.number === true){
    if (string && !isNaN(string)) {
      const number = Number(string);
      if (Number.isInteger(number) && !Number.isSafeInteger(number)){
        return BigInt(string);
      } else {
        return number;
      }
    }
  }

  //default
  return string;
}

function param (option){
    if (option === true) {
      return {
        bool: true,
        number: true,
        unquote: true
      };
    } else if (option === false) {
      return {
        bool: false,
        number: false,
        unquote: false
      };
    } else {
      return {
        bool: option?.bool ?? true,
        number: option?.number || false,
        unquote: option?.unquote || false
      };
    }
  }
  
export { autoType, param };