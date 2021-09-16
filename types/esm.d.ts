declare interface IAutoType {
  bool?: bool,
  number?: bool,
  unquote?: bool
}

declare interface IParseOption {
  autoType?: bool | IAutoType,
  ignoreGlobalSection?: bool,
  sectionFilter?: string[]
}

export function parse(string: string, option?: IParseOption): any;

declare interface IStringifyOption {
  whitespace?: bool,
  blankLine?: bool,
  ignoreGlobalSection?: bool,
  quoteString?: bool
}

export function stringify(obj: any, option?: IStringifyOption): string;