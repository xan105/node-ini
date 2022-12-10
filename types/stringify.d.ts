declare interface Option {
  whitespace?: boolean,
  blankLine?: boolean,
  ignoreGlobalSection?: boolean,
  quoteString?: boolean,
  eol?: string
}

export function stringify(obj: object, option?: Option): string;
