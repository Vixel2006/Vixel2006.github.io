/* Custom highlight.js language registrations: Zig + Odin */
;(function(hljs){
var zig = (function() {
/** @type LanguageFn */
function zig(hljs) {
  const regex = hljs.regex;
  const IDENT_RE = /[a-zA-Z_][a-zA-Z0-9_]*/;

  const BUILTINS = [
    '@import', '@compileLog', '@panic', '@assert', '@field', '@offsetOf', '@memberCount',
    '@typeInfo', '@TypeOf', '@setRuntimeSafety', '@setFloatMode', '@setAlignStack',
    '@frame', '@frameAddress', '@returnAddress', '@breakpoint', '@trap', '@inlineCall',
    '@noInlineCall', '@sqrt', '@sin', '@cos', '@exp', '@log', '@pow', '@floor', '@ceil',
    '@trunc', '@round', '@fabs', '@fma', '@abs', '@clz', '@ctz', '@popCount',
    '@shlExact', '@shrExact', '@shl', '@shr', '@bitCast', '@bitOffsetOf',
    '@splat', '@reduce', '@addWithOverflow', '@subWithOverflow', '@mulWithOverflow',
    '@shlWithOverflow', '@shrWithOverflow', '@cImport', '@cInclude', '@cTypedef',
    '@cChar', '@cInt', '@cLong', '@cLongLong', '@cLongDouble', '@cFloat', '@cDouble',
    '@cVoid', '@cBool', '@sizeOf', '@alignOf', '@memberType', '@max', '@min',
    '@memcpy', '@memset', '@memcmp', '@strlen', '@sliceToPtr', '@ptrToInt', '@intToPtr',
    '@intToFloat', '@floatToInt', '@floatCast', '@intCast', '@intToEnum', '@enumToInt',
    '@errorName', '@errorFromUserGlobal', '@tagName', '@tagType', '@errorSetHas',
    '@as', '@resolve', '@dest', '@src', '@this', '@parent', '@child', '@byteOffset',
    '@embedFile', '@export', '@wasmMemorySize', '@wasmMemoryGrow'
  ];

  const BUILTIN_TYPES = [
    'i8', 'i16', 'i32', 'i64', 'i128', 'isize',
    'u8', 'u16', 'u32', 'u64', 'u128', 'usize',
    'f16', 'f32', 'f64',
    'void', 'bool', 'noreturn', 'anyopaque', 'anytype',
    'comptime_int', 'comptime_float'
  ];

  const LITERALS = ['true', 'false', 'null', 'undefined'];

  const KEYWORDS = [
    'fn', 'const', 'var', 'if', 'else', 'while', 'for', 'return', 'break', 'continue',
    'switch', 'case', 'defer', 'errdefer', 'try', 'catch', 'async', 'await', 'suspend',
    'resume', 'struct', 'enum', 'union', 'opaque', 'type',
    'pub', 'export', 'extern', 'inline', 'noinline', 'volatile', 'allowzero', 'packed',
    'comptime', 'noskip', 'align', 'section',
    'test', 'usingnamespace', 'asm',
    'error', 'and', 'or', 'orelse', 'mod'
  ];

  const STRING_ESCAPE = {
    className: 'string.escape',
    begin: /\\[\s\S]/
  };

  const LINE_COMMENT = hljs.C_LINE_COMMENT_MODE;

  const BLOCK_COMMENT = hljs.COMMENT('/\\*', '\\*/', { contains: [ 'self' ] });

  const DOC_COMMENT = {
    className: 'comment.doc',
    begin: /\/\/\//,
    end: /\r?\n/
  };

  const INNER_DOC = {
    className: 'comment.doc',
    begin: /\/\/!/,
    end: /\r?\n/
  };

  const STRING_MODE = {
    className: 'string',
    variants: [
      { begin: /c?"/, end: /"/, contains: [STRING_ESCAPE] },
      { begin: /c'/, end: /'/, contains: [STRING_ESCAPE] },
      { begin: /\\{/, end: /\\}/ }
    ]
  };

  const CHAR_LITERAL = {
    className: 'string',
    begin: /'[\\a-zA-Z0-9_]/,
    end: /'/
  };

  const NUMBER_MODE = {
    className: 'number',
    variants: [
      { begin: /\b\d+\.\d+([eE][+-]?\d+)?\b/ },
      { begin: /\b\d+\.\b/ },
      { begin: /\b\d+\.?[eE][+-]?\d+\b/ },
      { begin: /\b0x[0-9a-fA-F_]+/ },
      { begin: /\b0b[01_]+/ },
      { begin: /\b0o[0-7_]+/ },
      { begin: /\b\d[0-9_]*\b/ }
    ],
    relevance: 0
  };

  const ATTRIBUTE = {
    className: 'meta',
    begin: /@\[/,
    end: /\]/,
    contains: [
      STRING_MODE,
      NUMBER_MODE,
      { begin: IDENT_RE, className: 'string' }
    ]
  };

  const BUILTIN_CALL = {
    className: 'built_in',
    begin: /@[\w]+/,
    keywords: {
      built_in: BUILTINS
    }
  };

  const TYPE_NAME = {
    className: 'type',
    begin: /\b[A-Z][a-zA-Z0-9_]*\b/
  };

  const BUILTIN_TYPE_NAME = {
    className: 'type',
    begin: /\b(i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f16|f32|f64|void|bool|noreturn|anyopaque|anytype|comptime_int|comptime_float)\b/
  };

  const KEYWORD_WORD = {
    className: 'keyword',
    begin: /\b(const|var|if|else|while|for|return|break|continue|switch|case|defer|errdefer|try|catch|async|await|suspend|resume|struct|enum|union|opaque|pub|export|extern|inline|noinline|volatile|allowzero|packed|comptime|noskip|align|section|test|usingnamespace|asm|error|and|or|orelse|mod|type)\b/
  };

  const FN_KEYWORD = {
    className: 'keyword',
    begin: /\bfn\b/
  };

  const LABEL = {
    className: 'symbol',
    begin: regex.concat(IDENT_RE, /:\s*(while|for|switch|block)/)
  };

  const FUNCTION_CALL = {
    className: 'title.function',
    begin: regex.concat(/\b/, IDENT_RE, /\s*\(/),
    relevance: 0
  };

  return {
    name: 'Zig',
    aliases: [ 'zig' ],
    keywords: {
      $pattern: IDENT_RE,
      keyword: KEYWORDS,
      type: BUILTIN_TYPES,
      literal: LITERALS,
      built_in: BUILTINS
    },
    contains: [
      LINE_COMMENT,
      BLOCK_COMMENT,
      DOC_COMMENT,
      INNER_DOC,

      STRING_MODE,
      CHAR_LITERAL,

      ATTRIBUTE,

      BUILTIN_CALL,

      BUILTIN_TYPE_NAME,

      FN_KEYWORD,

      {
        begin: [
          /\b(struct|enum|union|opaque|error)\b/,
          /\s+/,
          IDENT_RE
        ],
        className: {
          1: 'keyword',
          3: 'title.class'
        }
      },

      {
        begin: [
          /\btype\b/,
          /\s+/,
          IDENT_RE
        ],
        className: {
          1: 'keyword',
          3: 'title.class'
        }
      },

      KEYWORD_WORD,

      {
        begin: [
          /\b(const|var)\b/,
          /\s+/,
          IDENT_RE
        ],
        className: {
          1: 'keyword',
          3: 'variable'
        }
      },

      LABEL,

      FUNCTION_CALL,

      NUMBER_MODE,

      {
        className: 'operator',
        begin: /[+\-*/%&|^!<>=]=?|->|\.\.=?|\?:|@@|\.\./
      },

      {
        className: 'punctuation',
        begin: /[{}()\[\];,.]/
      },

      TYPE_NAME,

      {
        className: 'type',
        begin: /</,
        end: />/,
        contains: ['self', TYPE_NAME]
      },

      IDENT_RE
    ],
    exports: {
      BUILTINS,
      KEYWORDS,
      BUILTIN_TYPES
    },
    illegal: /^\s*#(?!include)/
  };
}

return zig;
})();
hljs.registerLanguage('zig', zig);
hljs.registerLanguage('odin', function(hljs){
  const LITERALS = [
    "true",
    "false",
    "nil"
  ];

  const BUILT_INS = [
    "abs",
    "align_of",
    "append",
    "append_elem",
    "append_elems",
    "append_string",
    "assert",
    "assign_at",
    "assign_at_elems",
    "cap",
    "clamp",
    "complex",
    "conj",
    "copy",
    "copy_from_string",
    "copy_slice",
    "delete",
    "delete_dynamic_array",
    "delete_map",
    "delete_slice",
    "ensure",
    "imag",
    "inject_at",
    "inject_at_elems",
    "len",
    "make",
    "make_dynamic_array",
    "make_map",
    "make_slice",
    "map_entry",
    "map_insert",
    "map_upsert",
    "max",
    "min",
    "new",
    "new_clone",
    "offset_of",
    "offset_of_by_string",
    "offset_of_member",
    "offset_of_selector",
    "ordered_remove",
    "panic",
    "pop",
    "pop_front",
    "pop_front_safe",
    "pop_safe",
    "quaternion",
    "raw_data",
    "raw_soa_footer_dynamic_array",
    "raw_soa_footer_slice",
    "real",
    "remove_range",
    "reserve",
    "reserve_map",
    "resize_dynamic_array",
    "shrink_map",
    "size_of",
    "soa_unzip",
    "soa_zip",
    "swizzle",
    "type_info_of",
    "type_of",
    "typeid_of",
    "unimplemented",
    "unordered_remove"
  ];

  const TYPES = [
    "Maybe",
    "Objc_Block",
    "any",
    "b16",
    "b32",
    "b64",
    "b8",
    "bool",
    "byte",
    "complex128",
    "complex32",
    "complex64",
    "cstring",
    "f16",
    "f16be",
    "f16le",
    "f32",
    "f32be",
    "f32le",
    "f64",
    "f64be",
    "f64le",
    "i128",
    "i128be",
    "i128le",
    "i16",
    "i16be",
    "i16le",
    "i32",
    "i32be",
    "i32le",
    "i64",
    "i64be",
    "i64le",
    "i8",
    "int",
    "matrix",
    "quaternion128",
    "quaternion256",
    "quaternion64",
    "rawptr",
    "rune",
    "string",
    "typeid",
    "u128",
    "u128be",
    "u128le",
    "u16",
    "u16be",
    "u16le",
    "u32",
    "u32be",
    "u32le",
    "u64",
    "u64be",
    "u64le",
    "u8",
    "uint",
    "uintptr"
  ];

  const KEYWORDS = [
    "asm",
    "auto_cast",
    "break",
    "case",
    "cast",
    "context",
    "continue",
    "defer",
    "distinct",
    "do",
    "dynamic",
    "else",
    "enum",
    "fallthrough",
    "for",
    "foreign",
    "if",
    "import",
    "in",
    "map",
    "matrix",
    "not_in",
    "or_else",
    "or_return",
    "package",
    "proc",
    "return",
    "struct",
    "switch",
    "transmute",
    "type",
    "union",
    "using",
    "when",
    "where"
  ];

  return {
    name: 'Odin',
    aliases: [ 'odinlang' ],
    keywords: {
      keyword: KEYWORDS,
      type: TYPES,
      literal: LITERALS,
      built_in: BUILT_INS
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        scope: 'string',
        variants: [
          hljs.QUOTE_STRING_MODE,
          {
            begin: /`/,
            end: /`/
          }
        ]
      },
      {
        scope: 'string',
        match: /'(?:\\(?:.|[0Uux][0-9A-Fa-f]{1,6})|[^\n\r'\\])'/
      },
      {
        scope: 'number',
        variants: [
          { match: /\b0b[01_]+\b/ },
          { match: /\b0o[0-7_]+\b/ },
          { match: /\b0x[\dA-F_a-f]+\b/ },
          { match: /\b\d+(?:\.\d*)?(?:[eE][+-]?\d+)?[ijk]?\b/ },
          { match: /-\.\d(_?\d)*([eE][+-]?\d+)?i?/ }
        ]
      },
      {
        match: [
          /\b[A-Za-z_]\w*/,
          /\s*::\s*/,
          /\bproc\b/
        ],
        scope: {
          1: "title.function",
          3: "keyword"
        }
      }
    ]
  };
});
})(window.hljs);
