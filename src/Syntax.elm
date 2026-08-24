module Syntax exposing (Kind(..), Line, Token, highlight, toLines)

{-| A small, dependency-free syntax highlighter for the languages that show
up in the field notes: zig, c/cpp/cuda, go, rust, python, elm, js/ts,
shell, json, yaml/toml — plus a generic fallback.

It is intentionally not a parser. The goal is the restrained highlighting
of a printed journal: comments recede, strings and numbers glow, keywords
get one color, types another. Correctness beats cleverness.
-}


-- TYPES ---------------------------------------------------------------------


type Kind
    = Plain
    | Comment
    | Str
    | Num
    | Kw
    | Ty
    | Fn
    | Deco


type alias Token =
    { kind : Kind
    , text : String
    }


type alias Line =
    List ( Kind, String )


type alias Lang =
    { keywords : List String
    , types : List String
    , literals : List String
    , lineComments : List String
    , blockOpen : Maybe String
    , blockClose : String
    , hashComment : Bool
    , preproc : Bool
    , atBuiltins : Bool
    }



-- LANGUAGES -----------------------------------------------------------------


langFor : Maybe String -> Lang
langFor name =
    case Maybe.map (String.toLower >> String.trim) name of
        Just l ->
            if List.member l [ "zig", "zon" ] then
                zig

            else if List.member l [ "c", "h", "cpp", "c++", "cxx", "hpp", "cc", "cuda", "cu", "hip" ] then
                cFamily

            else if List.member l [ "python", "py", "python3" ] then
                python

            else if l == "go" then
                go_

            else if List.member l [ "rust", "rs" ] then
                rust

            else if l == "elm" then
                elm

            else if List.member l [ "js", "ts", "javascript", "typescript", "jsx", "tsx" ] then
                javascript

            else if List.member l [ "sh", "bash", "shell", "zsh", "console" ] then
                shell

            else if l == "json" then
                json_

            else if List.member l [ "yaml", "yml", "toml" ] then
                data

            else
                generic

        Nothing ->
            generic


commonLiterals : List String
commonLiterals =
    [ "true", "false", "null", "undefined" ]


zig : Lang
zig =
    { keywords =
        [ "align", "allowzero", "and", "anyframe", "asm", "async", "await"
        , "break", "callconv", "catch", "comptime", "const", "continue"
        , "defer", "else", "enum", "errdefer", "error", "export", "extern"
        , "fn", "for", "if", "inline", "noalias", "nosuspend", "or"
        , "orelse", "packed", "pub", "resume", "return", "linksection"
        , "struct", "suspend", "switch", "test", "threadlocal", "try"
        , "union", "unreachable", "usingnamespace", "var", "volatile"
        , "while"
        ]
    , types =
        [ "bool", "f16", "f32", "f64", "f128", "i8", "i16", "i32", "i64"
        , "i128", "isize", "u1", "u8", "u16", "u32", "u64", "u128", "usize"
        , "void", "noreturn", "type", "anyerror", "anytype", "comptime_int"
        , "comptime_float", "c_short", "c_ushort", "c_int", "c_uint"
        , "c_long", "c_ulong", "c_longlong", "c_ulonglong"
        ]
    , literals = commonLiterals
    , lineComments = [ "//" ]
    , blockOpen = Nothing
    , blockClose = ""
    , hashComment = False
    , preproc = False
    , atBuiltins = True
    }


cFamily : Lang
cFamily =
    { keywords =
        [ "break", "case", "catch", "class", "co_await", "co_return"
        , "co_yield", "const", "constexpr", "const_cast", "continue"
        , "decltype", "default", "delete", "do", "dynamic_cast", "else"
        , "enum", "explicit", "export", "extern", "false", "for", "friend"
        , "goto", "if", "inline", "mutable", "namespace", "new"
        , "noexcept", "nullptr", "operator", "override", "private"
        , "protected", "public", "reinterpret_cast", "requires"
        , "restrict", "return", "sizeof", "static", "static_assert"
        , "static_cast", "struct", "switch", "template", "this", "throw"
        , "true", "try", "typedef", "typename", "union", "using"
        , "virtual", "volatile", "while", "__global__", "__device__"
        , "__host__", "__shared__", "__constant__", "__managed__"
        , "__syncthreads", "__forceinline__"
        ]
    , types =
        [ "auto", "bool", "char", "char16_t", "char32_t", "dim3", "double"
        , "float", "int", "int8_t", "int16_t", "int32_t", "int64_t"
        , "long", "short", "signed", "size_t", "ssize_t", "unsigned"
        , "void", "wchar_t", "uint8_t", "uint16_t", "uint32_t"
        , "uint64_t", "uintptr_t", "ptrdiff_t", "half", "float2"
        , "float4"
        ]
    , literals = [ "NULL", "nullptr" ]
    , lineComments = [ "//" ]
    , blockOpen = Just "/*"
    , blockClose = "*/"
    , hashComment = False
    , preproc = True
    , atBuiltins = False
    }


python : Lang
python =
    { keywords =
        [ "and", "as", "assert", "async", "await", "break", "case"
        , "class", "continue", "def", "del", "elif", "else", "except"
        , "finally", "for", "from", "global", "if", "import", "in", "is"
        , "lambda", "match", "nonlocal", "not", "or", "pass", "raise"
        , "return", "try", "while", "with", "yield"
        ]
    , types =
        [ "bool", "bytes", "dict", "float", "frozenset", "int", "list"
        , "object", "set", "str", "tuple", "Exception", "BaseException"
        ]
    , literals = [ "True", "False", "None", "self", "cls" ]
    , lineComments = [ "#" ]
    , blockOpen = Nothing
    , blockClose = ""
    , hashComment = True
    , preproc = False
    , atBuiltins = True
    }


go_ : Lang
go_ =
    { keywords =
        [ "break", "case", "chan", "const", "continue", "default"
        , "defer", "else", "fallthrough", "for", "func", "go", "goto"
        , "if", "import", "interface", "map", "package", "range"
        , "return", "select", "struct", "switch", "type", "var"
        ]
    , types =
        [ "bool", "byte", "complex64", "complex128", "error", "float32"
        , "float64", "int", "int8", "int16", "int32", "int64", "rune"
        , "string", "uint", "uint8", "uint16", "uint32", "uint64"
        , "uintptr", "any"
        ]
    , literals = [ "nil", "true", "false", "iota" ]
    , lineComments = [ "//" ]
    , blockOpen = Just "/*"
    , blockClose = "*/"
    , hashComment = False
    , preproc = False
    , atBuiltins = False
    }


rust : Lang
rust =
    { keywords =
        [ "as", "async", "await", "break", "const", "continue", "crate"
        , "dyn", "else", "enum", "extern", "fn", "for", "if", "impl", "in"
        , "let", "loop", "match", "mod", "move", "mut", "pub", "ref"
        , "return", "self", "Self", "static", "struct", "super", "trait"
        , "type", "unsafe", "use", "where", "while"
        ]
    , types =
        [ "bool", "char", "f32", "f64", "i8", "i16", "i32", "i64", "i128"
        , "isize", "str", "u8", "u16", "u32", "u64", "u128", "usize"
        , "String", "Vec", "Option", "Result", "Box"
        ]
    , literals = commonLiterals
    , lineComments = [ "//" ]
    , blockOpen = Just "/*"
    , blockClose = "*/"
    , hashComment = False
    , preproc = False
    , atBuiltins = False
    }


elm : Lang
elm =
    { keywords =
        [ "if", "then", "else", "case", "of", "let", "in", "where"
        , "module", "import", "exposing", "type", "alias", "port", "as"
        ]
    , types = []
    , literals = [ "True", "False" ]
    , lineComments = [ "--" ]
    , blockOpen = Just "{-"
    , blockClose = "-}"
    , hashComment = False
    , preproc = False
    , atBuiltins = False
    }


javascript : Lang
javascript =
    { keywords =
        [ "async", "await", "break", "case", "catch", "class", "const"
        , "continue", "debugger", "default", "delete", "do", "else"
        , "export", "extends", "finally", "for", "from", "function", "if"
        , "import", "in", "instanceof", "let", "new", "of", "return"
        , "static", "super", "switch", "this", "throw", "try", "typeof"
        , "var", "void", "while", "with", "yield", "interface", "enum"
        , "implements", "readonly", "namespace", "declare"
        ]
    , types =
        [ "boolean", "number", "string", "symbol", "bigint", "object"
        , "unknown", "never", "Array", "Promise", "Map", "Set"
        ]
    , literals = commonLiterals
    , lineComments = [ "//" ]
    , blockOpen = Just "/*"
    , blockClose = "*/"
    , hashComment = False
    , preproc = False
    , atBuiltins = False
    }


shell : Lang
shell =
    { keywords =
        [ "if", "then", "elif", "else", "fi", "for", "while", "until"
        , "do", "done", "case", "esac", "function", "in", "select"
        , "time", "coproc", "return", "break", "continue", "exit", "set"
        , "unset", "export", "local", "readonly", "declare"
        ]
    , types = []
    , literals = [ "true", "false" ]
    , lineComments = [ "#" ]
    , blockOpen = Nothing
    , blockClose = ""
    , hashComment = True
    , preproc = False
    , atBuiltins = False
    }


json_ : Lang
json_ =
    { keywords = []
    , types = []
    , literals = [ "true", "false", "null" ]
    , lineComments = []
    , blockOpen = Nothing
    , blockClose = ""
    , hashComment = False
    , preproc = False
    , atBuiltins = False
    }


data : Lang
data =
    { keywords = []
    , types = []
    , literals = [ "true", "false", "null", "yes", "no", "on", "off" ]
    , lineComments = [ "#" ]
    , blockOpen = Nothing
    , blockClose = ""
    , hashComment = True
    , preproc = False
    , atBuiltins = False
    }


generic : Lang
generic =
    { keywords =
        [ "break", "case", "catch", "class", "const", "continue"
        , "default", "def", "do", "elif", "else", "enum", "except"
        , "fn", "for", "foreach", "func", "function", "if", "import"
        , "in", "lambda", "let", "match", "module", "namespace", "new"
        , "package", "private", "protected", "public", "pub", "return"
        , "static", "struct", "switch", "trait", "try", "type", "typedef"
        , "union", "using", "var", "while", "with"
        ]
    , types =
        [ "bool", "char", "double", "float", "int", "long", "short"
        , "string", "void"
        ]
    , literals = commonLiterals
    , lineComments = [ "//" ]
    , blockOpen = Just "/*"
    , blockClose = "*/"
    , hashComment = False
    , preproc = False
    , atBuiltins = False
    }



-- TOKENIZING ----------------------------------------------------------------


{-| Tokens come out in source order. (The walker accumulates backwards;
the final reverse puts the source back together.)
-}
highlight : Maybe String -> String -> List Token
highlight langName src =
    List.reverse (tokHelp (langFor langName) (String.toList src) [] [])


tokHelp : Lang -> List Char -> List Char -> List Token -> List Token
tokHelp lang cursor buf acc =
    case cursor of
        [] ->
            flush buf acc

        '\\' :: rest ->
            tokHelp lang rest ('\\' :: buf) acc

        c :: rest ->
            if c == '\n' then
                tokHelp lang rest ('\n' :: buf) acc

            else if startsAny lang.lineComments cursor then
                let
                    ( body, remaining ) =
                        takeToEol cursor []
                in
                push Comment body lang remaining buf acc

            else if memberStart lang.blockOpen cursor then
                let
                    opener =
                        Maybe.withDefault "" lang.blockOpen

                    afterOpen =
                        List.drop (String.length opener) cursor

                    ( body, remaining ) =
                        takeUntilStr lang.blockClose afterOpen []
                in
                push Comment (opener ++ body) lang remaining buf acc

            else if c == '"' || c == '\'' || c == '`' then
                let
                    ( body, remaining ) =
                        takeString c (List.drop 1 cursor) [ c ]
                in
                push Str body lang remaining buf acc

            else if isDigit c || (c == '.' && nextIsDigit rest) then
                let
                    ( chars, remaining ) =
                        takeNumber cursor []
                in
                push Num chars lang remaining buf acc

            else if isIdentStart c then
                let
                    ( wordChars, remaining ) =
                        takeWord cursor []

                    word =
                        String.fromList wordChars

                    kind =
                        classifyWord lang word remaining
                in
                push kind word lang remaining buf acc

            else if c == '@' && lang.atBuiltins && nextIsIdentStart rest then
                let
                    ( wordChars, remaining ) =
                        takeWord rest [ '@' ]
                in
                push Deco (String.fromList wordChars) lang remaining buf acc

            else if c == '#' && (lang.hashComment || (lang.preproc && atLineStart buf)) then
                let
                    ( body, remaining ) =
                        takeToEol cursor []
                in
                push (if lang.hashComment then Comment else Deco) body lang remaining buf acc

            else
                tokHelp lang rest (c :: buf) acc


{-| Flush any pending plain-text buffer first, then place the special token
on top — this keeps source order intact.
-}
push : Kind -> String -> Lang -> List Char -> List Char -> List Token -> List Token
push kind text lang remaining buf acc =
    tokHelp lang remaining [] (Token kind text :: flush buf acc)


atLineStart : List Char -> Bool
atLineStart buf =
    case buf of
        [] ->
            True

        c :: _ ->
            c == '\n'


flush : List Char -> List Token -> List Token
flush buf acc =
    if List.isEmpty buf then
        acc

    else
        Token Plain (String.fromList (List.reverse buf)) :: acc


startsAny : List String -> List Char -> Bool
startsAny patterns cursor =
    List.any (\p -> startsStr p cursor) patterns


memberStart : Maybe String -> List Char -> Bool
memberStart opener cursor =
    case opener of
        Just o ->
            startsStr o cursor

        Nothing ->
            False


startsStr : String -> List Char -> Bool
startsStr prefix cursor =
    hasPrefix (String.toList prefix) cursor


hasPrefix : List Char -> List Char -> Bool
hasPrefix expected actual =
    case ( expected, actual ) of
        ( [], _ ) ->
            True

        ( e :: es, a :: as_ ) ->
            if e == a then
                hasPrefix es as_

            else
                False

        ( _ :: _, [] ) ->
            False


takeToEol : List Char -> List Char -> ( String, List Char )
takeToEol cursor acc =
    case cursor of
        [] ->
            ( String.fromList (List.reverse acc), [] )

        '\n' :: rest ->
            ( String.fromList (List.reverse ('\n' :: acc)), rest )

        c :: rest ->
            takeToEol rest (c :: acc)


takeUntilStr : String -> List Char -> List Char -> ( String, List Char )
takeUntilStr closer cursor acc =
    if startsStr closer cursor then
        ( String.fromList (List.reverse acc ++ String.toList closer)
        , List.drop (String.length closer) cursor
        )

    else
        case cursor of
            [] ->
                ( String.fromList (List.reverse acc), [] )

            c :: rest ->
                takeUntilStr closer rest (c :: acc)


takeString : Char -> List Char -> List Char -> ( String, List Char )
takeString quote cursor acc =
    case cursor of
        [] ->
            ( String.fromList (List.reverse acc), [] )

        '\n' :: rest ->
            -- strings do not survive a newline; keeps failures local
            ( String.fromList (List.reverse ('\n' :: acc)), rest )

        '\\' :: esc :: rest ->
            takeString quote rest (esc :: '\\' :: acc)

        c :: rest ->
            if c == quote then
                ( String.fromList (List.reverse (c :: acc)), rest )

            else
                takeString quote rest (c :: acc)


takeNumber : List Char -> List Char -> ( String, List Char )
takeNumber cursor acc =
    case cursor of
        c :: rest ->
            if
                isDigit c
                    || isHexDigit c
                    || c == '_'
                    || c == '.'
                    || ((c == 'x' || c == 'X') && List.all (\ch -> ch == '0') acc)
            then
                takeNumber rest (c :: acc)

            else
                ( String.fromList (List.reverse acc), cursor )

        [] ->
            ( String.fromList (List.reverse acc), [] )


takeWord : List Char -> List Char -> ( List Char, List Char )
takeWord cursor acc =
    case cursor of
        c :: rest ->
            if isIdentChar c then
                takeWord rest (c :: acc)

            else
                ( List.reverse acc, cursor )

        [] ->
            ( List.reverse acc, [] )


classifyWord : Lang -> String -> List Char -> Kind
classifyWord lang word rest =
    if memberStr word lang.keywords then
        Kw

    else if memberStr word lang.types then
        Ty

    else if memberStr word lang.literals then
        Num

    else if allCaps word then
        Num

    else if startsUpper word then
        Ty

    else if nextNonSpaceIs '(' rest then
        Fn

    else
        Plain


nextNonSpaceIs : Char -> List Char -> Bool
nextNonSpaceIs target rest =
    case rest of
        c :: more ->
            if c == ' ' || c == '\t' then
                nextNonSpaceIs target more

            else
                c == target

        [] ->
            False


memberStr : String -> List String -> Bool
memberStr s list =
    List.member s list


allCaps : String -> Bool
allCaps word =
    let
        letters =
            String.toList (String.filter Char.isAlpha word)
    in
    not (List.isEmpty letters)
        && List.all Char.isUpper letters


startsUpper : String -> Bool
startsUpper word =
    case String.uncons word of
        Just ( c, _ ) ->
            Char.isUpper c

        Nothing ->
            False


isIdentStart : Char -> Bool
isIdentStart c =
    Char.isAlpha c || c == '_'


isIdentChar : Char -> Bool
isIdentChar c =
    Char.isAlphaNum c || c == '_'


nextIsIdentStart : List Char -> Bool
nextIsIdentStart rest =
    case rest of
        c :: _ ->
            isIdentStart c

        [] ->
            False


nextIsDigit : List Char -> Bool
nextIsDigit rest =
    case rest of
        c :: _ ->
            isDigit c

        [] ->
            False


isDigit : Char -> Bool
isDigit c =
    c >= '0' && c <= '9'


isHexDigit : Char -> Bool
isHexDigit c =
    isDigit c || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')



-- LINE GROUPING ---------------------------------------------------------------


{-| Split the token stream into display lines, keeping each piece's class
so highlighting survives multi-line comments.
-}
toLines : List Token -> List Line
toLines tokens =
    let
        rawReversed =
            List.foldl addToken [] tokens

        lines =
            List.reverse rawReversed
    in
    case lines of
        last :: _ ->
            if allEmpty last && List.length lines > 1 then
                dropLast lines

            else
                lines

        [] ->
            []


dropLast : List a -> List a
dropLast xs =
    List.reverse (List.drop 1 (List.reverse xs))


allEmpty : Line -> Bool
allEmpty line =
    List.all (\( _, s ) -> s == "") line


addToken : Token -> List Line -> List Line
addToken token acc =
    addSegs token.kind 0 (String.split "\n" token.text) acc


{-| The first segment continues the open line; every later segment begins
after a newline, so it opens a fresh one. `acc` keeps the open line at the
head, in reverse document order.
-}
addSegs : Kind -> Int -> List String -> List Line -> List Line
addSegs kind index segs acc =
    case segs of
        [] ->
            acc

        seg :: rest ->
            let
                openedAcc =
                    if index == 0 then
                        acc

                    else
                        [] :: acc
            in
            addSegs kind (index + 1) rest (appendPiece kind seg openedAcc)


appendPiece : Kind -> String -> List Line -> List Line
appendPiece kind seg acc =
    case acc of
        current :: rest ->
            (current ++ [ ( kind, seg ) ]) :: rest

        [] ->
            [ [ ( kind, seg ) ] ]
