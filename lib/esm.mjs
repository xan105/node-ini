//ES Module Wrapper
//https://nodejs.org/api/esm.html#esm_dual_commonjs_es_module_packages

import module from './ini.cjs';
export const parse = module.parse;
export const stringify = module.stringify;