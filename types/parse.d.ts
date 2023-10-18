declare interface Translate {
  bool?: boolean,
  number?: boolean,
  unsafe?: boolean,
  unquote?: boolean
}

declare interface Option {
  translate?: boolean | Translate,
  ignoreGlobalSection?: boolean,
  sectionFilter?: string[],
  comment?: boolean,
  removeInline?: boolean
}

declare interface Result {
  [key: symbol | string]: string
}

export function parse(string: string, option?: Option): Result;
