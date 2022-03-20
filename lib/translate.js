/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

function translate(string, options = {}){
  
  //Unquote string
  if(options.unquote === true){
    if (string[0] === '"' && string.slice(-1) === '"') string = string.replace(/^"|"$/g, '');
    else if (string[0] === "'" && string.slice(-1) === "'") string = string.replace(/^'|'$/g, '');
  }
  
  //To Boolean
  if(options.bool === true) {
    if (string.toLowerCase() === "true") return true;
    if (string.toLowerCase() === "false") return false;
  }

  //To Number/BigInt
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

export { translate };