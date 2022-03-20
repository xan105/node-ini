declare interface ITranslate {
  bool?: boolean,
  number?: boolean,
  unquote?: boolean
}

declare interface IParseOption {
  translate?: boolean | ITranslate,
  ignoreGlobalSection?: boolean,
  sectionFilter?: string[]
}

export function parse(string: string, option?: IParseOption): object;

declare interface IStringifyOption {
  whitespace?: boolean,
  blankLine?: boolean,
  ignoreGlobalSection?: boolean,
  quoteString?: boolean,
  eol?: string
}

export function stringify(obj: object, option?: IStringifyOption): string;