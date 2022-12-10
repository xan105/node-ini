declare interface Translate {
  bool?: boolean,
  number?: boolean,
  unsafe?: boolean,
  unquote?: boolean
}

declare interface Option {
  translate?: boolean | Translate,
  ignoreGlobalSection?: boolean,
  sectionFilter?: string[]
}

export function parse(string: string, option?: Option): object;
