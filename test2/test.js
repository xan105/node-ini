import fs from 'node:fs';
import path from 'node:path';
import t from 'tap';
import * as ini from '../lib/index.js';

const expected = [
    {
      global: "string",
      "hel lo": "w o r l d ;inline comment are not allowed",
      url: "http://1270.0.0.1#div",
      '"[disturbing]"': "hey you never know",
      update_lang: {},
      a: {
        override : false
      },
      "b.c": {
        b : "string",
        c : "string",
        d : "string",
        e : "string",
        eq : "eq=eq",
        f : "\'string\'",
        g : '\"string\"'
      },
      d: {
        d: "125",
        e: "0x125",
        f: '\"125\"',
        g: "0123456",
        h: "8M"
      },
      e: {
        path: '"var/lib/path/to"',
        win32: '"C:\\\\Windows\\\\System32"'
      },
      f: {
        "void" : "",
        empty: '""',
        mixed: `"something'`
      },
      h: {
        lessIsMore : '\"\\.\"',
        lessIsMore2 : "\\."
      },
      i: {},
      j: {
        yes: true,
        yes2: '\"true\"',
        no: false,
        no2: '\"false\"'
      },
      k: {
        array: "[ a; b; c; d ] #inline",
        array2: "[a ; b ; c ; ] #false positive"
      },
      Database: {
        password: "some very*difficult=password:",
        "database-name": "my-project-db"
      }
    },
    {
      global: "string",
      "hel lo": "w o r l d ;inline comment are not allowed",
      url: "http://1270.0.0.1#div",
      '"[disturbing]"': "hey you never know",
      update_lang: {},
      a: {
        override : false
      },
      "b.c": {
        b : "string",
        c : "string",
        d : "string",
        e : "string",
        eq : "eq=eq",
        f : "string",
        g : "string"
      },
      d: {
        d: 125,
        e: "0x125",
        f: 125,
        g: 123456,
        h: "8M"
      },
      e: {
        path: "var/lib/path/to",
        win32: "C:\\\\Windows\\\\System32"
      },
      f: {
        "void" : "",
        empty: "",
        mixed: `"something'`
      },
      h: {
        lessIsMore : "\\.",
        lessIsMore2 : "\\."
      },
      i: {},
      j: {
        yes: true,
        yes2: true,
        no: false,
        no2: false
      },
      k: {
        array: "[ a; b; c; d ] #inline",
        array2: "[a ; b ; c ; ] #false positive"
      },
      Database: {
        password: "some very*difficult=password:",
        "database-name": "my-project-db"
      }
    },
    {
      update_lang: {},
      a: {
        override : "false"
      },
      "b.c": {
        b : "string",
        c : "string",
        d : "string",
        e : "string",
        eq : "eq=eq",
        f : "\'string\'",
        g : '\"string\"'
      },
      d: {
        d: "125",
        e: "0x125",
        f: '\"125\"',
        g: "0123456",
        h: "8M"
      },
      e: {
        path: '"var/lib/path/to"',
        win32: '"C:\\\\Windows\\\\System32"'
      },
      f: {
        "void" : "",
        empty: '""',
        mixed: `"something'`
      },
      h: {
        lessIsMore : '\"\\.\"',
        lessIsMore2 : "\\."
      },
      i: {},
      j: {
        yes: "true",
        yes2: '\"true\"',
        no: "false",
        no2: '\"false\"'
      },
      k: {
        array: "[ a; b; c; d ] #inline",
        array2: "[a ; b ; c ; ] #false positive"
      }
    },
    {
      global: "string",
      "hel lo": "w o r l d",
      url: "http://1270.0.0.1#div",
      '"[disturbing]"': "hey you never know",
      update_lang: {},
      a: {
        override : false
      },
      "b.c": {
        b : "string",
        c : "string",
        d : "string",
        e : "string",
        eq : "eq=eq",
        f : "\'string\'",
        g : '\"string\"'
      },
      d: {
        d: "125",
        e: "0x125",
        f: '\"125\"',
        g: "0123456",
        h: "8M"
      },
      e: {
        path: '"var/lib/path/to"',
        win32: '"C:\\\\Windows\\\\System32"'
      },
      f: {
        "void" : "",
        empty: '""',
        mixed: `"something'`
      },
      h: {
        lessIsMore : '\"\\.\"',
        lessIsMore2 : "\\."
      },
      i: {},
      j: {
        yes: true,
        yes2: '\"true\"',
        no: false,
        no2: '\"false\"'
      },
      k:{
        array: "[ a; b; c; d ]",
        array2: "[a"
      },
      Database: {
        password: "some very*difficult=password:",
        "database-name": "my-project-db"
      }
    }
  ];

t.test('basic', t => {

  const sample = path.resolve("./test/sample/basic.ini");
  const content = fs.readFileSync(sample,"utf8");

  t.same(ini.parse(content), expected[0], 'parsing default option');
  t.same(ini.parse(content, {translate: true}), expected[1], 'translate on');
  t.same(ini.parse(content, {translate: {bool: true, number: true, unquote: true}}), expected[1], 'translate all');
  t.same(ini.parse(content, {translate: false, sectionFilter: ["Database"], ignoreGlobalSection: true}), expected[2], 'translate off and filter and no global');
  t.same(ini.parse(content, {removeInline: true }), expected[3], 'illegal inline comment');
  t.end();
});

t.test('read write read equivalence', t => {
  const originalFile = path.resolve("./test/sample/php.ini");
  const originalData = ini.parse(fs.readFileSync(originalFile,"utf8"));
  const data = ini.parse(ini.stringify(originalData));
  t.strictSame(data, originalData, 'is stringify producing same result as original');

  t.same(ini.parse(ini.stringify({hello: "world"},{quoteString: true})),{hello: '\"world\"'},"quoted");
  t.end();
});