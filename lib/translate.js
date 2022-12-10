/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

function unquote(string){
  if (string[0] === '"' && string.slice(-1) === '"') 
    string = string.replace(/^"|"$/g, '');
  else if (string[0] === "'" && string.slice(-1) === "'") 
    string = string.replace(/^'|'$/g, '');
  return string;
}

function translate(string, options){

  if(options.unquote === true) string = unquote(string);
  
  //To Boolean
  if(options.bool === true) {
    if (string.toLowerCase() === "true") return true;
    if (string.toLowerCase() === "false") return false;
  }

  //To Number/BigInt
  if(options.number === true){
    if (string && !isNaN(string)) {
      const number = Number(string);
      return (options.unsafe === false && 
              Number.isInteger(number) && 
              !Number.isSafeInteger(number)) ? BigInt(string) : number;
    }
  }

  //default
  return string;
}

export { translate };