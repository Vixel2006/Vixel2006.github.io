module Markdown exposing (Config, Heading, headings, render)

{-| A deliberately small markdown subset tuned for technical field notes:
headings, paragraphs, fenced code with an optional filename token, tables,
images on their own line, ordered/unordered lists, block quotes (with NOTE /
WARNING variants that render as asides), horizontal rules, and inline
bold / italic / code / links.
-}

import Char
import Components.CodeBlock as CodeBlock
import Html exposing (Html)
import Html.Attributes as Attr


-- TYPES ---------------------------------------------------------------------


type alias Config msg =
    { copyCode : { id : String, text : String } -> msg
    }


type Inline
    = Txt String
    | Bold (List Inline)
    | Italic (List Inline)
    | Code String
    | Link String (List Inline)


type QuoteKind
    = Pull
    | Note
    | Warn


type Block
    = Head Int String
    | Para String
    | CodeBlock_ (Maybe String) (Maybe String) String
    | ListBlock Bool (List String)
    | Quote QuoteKind String
    | Table (List String) (List (List String))
    | Image { alt : String, src : String }
    | Hr


type alias Heading =
    { level : Int
    , isSection : Bool
    , title : String
    , id : String
    }


{-| `isSection` marks top-level sections of the document (relative depth
zero) — the table of contents is built from those.
-}



-- PUBLIC --------------------------------------------------------------------


render : Config msg -> String -> Html msg
render cfg src =
    let
        blocks =
            parse src

        base =
            baseLevel blocks
    in
    Html.div [ Attr.class "md" ]
        (renderBlocks cfg base 0 blocks)


{-| Lowest markdown heading depth used in this document. That depth becomes
the top section level (h2) — documents may or may not carry a `#` title.
-}
baseLevel : List Block -> Int
baseLevel blocks =
    case List.filterMap levelOf blocks of
        [] ->
            1

        levels ->
            List.minimum levels |> Maybe.withDefault 1


levelOf : Block -> Maybe Int
levelOf block =
    case block of
        Head lvl _ ->
            Just lvl

        _ ->
            Nothing


headings : String -> List Heading
headings src =
    let
        blocks =
            parse src

        base =
            baseLevel blocks
    in
    blocks
        |> List.filterMap
            (\block ->
                case block of
                    Head lvl title ->
                        Just
                            { level = renderedLevel base lvl
                            , isSection = lvl == base
                            , title = plainTitle title
                            , id = slug title
                            }

                    _ ->
                        Nothing
            )


{-| Relative depth zero -> h2, one -> h3, two or more -> h4.
-}
renderedLevel : Int -> Int -> Int
renderedLevel base lvl =
    case lvl - base of
        0 ->
            2

        1 ->
            3

        _ ->
            4


plainTitle : String -> String
plainTitle s =
    s
        |> String.replace "**" ""
        |> String.replace "*" ""
        |> String.replace "`" ""


slug : String -> String
slug s =
    s
        |> String.toLower
        |> String.toList
        |> List.filter (\c -> Char.isAlphaNum c || c == ' ' || c == '-')
        |> List.map (\c -> if c == ' ' then '-' else c)
        |> String.fromList



-- BLOCK PARSING -------------------------------------------------------------


parse : String -> List Block
parse src =
    parseHelp (String.lines src) []


parseHelp : List String -> List Block -> List Block
parseHelp lines acc =
    case lines of
        [] ->
            List.reverse acc

        line :: rest ->
            if String.startsWith "```" line then
                let
                    fence =
                        takeFence line rest
                in
                parseHelp fence.rest (CodeBlock_ fence.lang fence.file fence.body :: acc)

            else if isTableRow line then
                let
                    ( rows, rest2 ) =
                        takeTable line rest
                in
                case parseTable rows of
                    Just t ->
                        parseHelp rest2 (t :: acc)

                    Nothing ->
                        parseHelp rest2 (Para (String.join " " rows) :: acc)

            else if headingLevel line > 0 then
                let
                    lvl =
                        headingLevel line
                in
                parseHelp rest
                    (Head lvl (String.trim (String.dropLeft lvl line)) :: acc)

            else if isHr line then
                parseHelp rest (Hr :: acc)

            else if isBullet line then
                let
                    ( items, rest2 ) =
                        takeList line rest
                in
                parseHelp rest2 (ListBlock False (List.map stripBullet items) :: acc)

            else if isOrderedLine line then
                let
                    ( items, rest2 ) =
                        takeList line rest
                in
                parseHelp rest2 (ListBlock True (List.map stripOrdered items) :: acc)

            else if String.startsWith ">" line then
                let
                    ( paras, rest2 ) =
                        takeQuote line rest
                in
                parseHelp rest2 (Quote (quoteKind paras) (String.join "\n" paras) :: acc)

            else if String.trim line == "" then
                parseHelp rest acc

            else
                let
                    ( paras, rest2 ) =
                        takePara line rest
                in
                case imageOf paras of
                    Just img ->
                        parseHelp rest2 (Image img :: acc)

                    Nothing ->
                        parseHelp rest2 (Para (String.join " " paras) :: acc)


type alias Fence =
    { lang : Maybe String
    , file : Maybe String
    , body : String
    , rest : List String
    }


takeFence : String -> List String -> Fence
takeFence opener rest =
    let
        tokens =
            opener
                |> String.dropLeft 3
                |> String.trim
                |> String.filter (\c -> c /= '`')
                |> String.words

        lang =
            List.head tokens |> Maybe.andThen nonEmpty

        file =
            case tokens of
                _ :: f :: _ ->
                    nonEmpty f

                _ ->
                    Nothing
    in
    fenceHelp lang file [] rest


nonEmpty : String -> Maybe String
nonEmpty s =
    if s == "" then
        Nothing

    else
        Just s


fenceHelp : Maybe String -> Maybe String -> List String -> List String -> Fence
fenceHelp lang file acc rest =
    case rest of
        [] ->
            { lang = lang, file = file, body = String.join "\n" (List.reverse acc), rest = [] }

        line :: more ->
            if String.startsWith "```" (String.trimLeft line) then
                { lang = lang, file = file, body = String.join "\n" (List.reverse acc), rest = more }

            else
                fenceHelp lang file (line :: acc) more


isTableRow : String -> Bool
isTableRow line =
    String.startsWith "|" line && String.endsWith "|" (String.trim line)


takeTable : String -> List String -> ( List String, List String )
takeTable first rest =
    tableHelp [ first ] rest


tableHelp : List String -> List String -> ( List String, List String )
tableHelp acc rest =
    case rest of
        [] ->
            ( List.reverse acc, [] )

        line :: more ->
            if isTableRow line then
                tableHelp (line :: acc) more

            else
                ( List.reverse acc, rest )


parseTable : List String -> Maybe Block
parseTable rows =
    case rows of
        header :: sep :: bodyRows ->
            let
                cells =
                    List.map splitRow rows

                headerCells =
                    splitRow header

                isSep =
                    splitRow sep
                        |> List.all (\c -> String.all (\ch -> ch == '-' || ch == ':' || ch == ' ') c && c /= "")
            in
            if isSep then
                Just (Table headerCells (List.drop 1 cells))

            else
                Nothing

        _ ->
            Nothing


splitRow : String -> List String
splitRow row =
    row
        |> String.trim
        |> String.split "|"
        |> List.drop 1
        |> List.reverse
        |> List.drop 1
        |> List.reverse
        |> List.map String.trim


imageOf : List String -> Maybe { alt : String, src : String }
imageOf paras =
    case paras of
        [ single ] ->
            let
                trimmed =
                    String.trim single
            in
            if String.startsWith "![" trimmed && String.endsWith ")" trimmed then
                let
                    inner =
                        trimmed
                            |> String.dropLeft 2
                            |> String.dropRight 1
                in
                case String.indexes "](" inner of
                    [ i ] ->
                        Just
                            { alt = String.left i inner
                            , src = String.dropLeft (i + 2) inner
                            }

                    _ ->
                        Nothing

            else
                Nothing

        _ ->
            Nothing


quoteKind : List String -> QuoteKind
quoteKind lines =
    case List.head lines of
        Nothing ->
            Pull

        Just first ->
            let
                up =
                    String.toLower (String.trim first)
            in
            if
                String.startsWith "note" up
                    || String.startsWith "[!note]" up
            then
                Note

            else if
                String.startsWith "warn" up
                    || String.startsWith "[!warning]" up
                    || String.startsWith "[!warn]" up
            then
                Warn

            else
                Pull


takePara : String -> List String -> ( List String, List String )
takePara line rest =
    paraHelp [ line ] rest


paraHelp : List String -> List String -> ( List String, List String )
paraHelp acc rest =
    case rest of
        [] ->
            ( List.reverse acc, [] )

        line :: more ->
            if String.trim line == "" then
                ( List.reverse acc, more )

            else
                paraHelp (line :: acc) more


takeList : String -> List String -> ( List String, List String )
takeList first rest =
    listHelp [ first ] rest


listHelp : List String -> List String -> ( List String, List String )
listHelp acc rest =
    case rest of
        [] ->
            ( List.reverse acc, [] )

        line :: more ->
            if isBullet line || isOrderedLine line then
                listHelp (line :: acc) more

            else
                ( List.reverse acc, rest )


takeQuote : String -> List String -> ( List String, List String )
takeQuote first rest =
    quoteHelp [ stripQuote first ] rest


quoteHelp : List String -> List String -> ( List String, List String )
quoteHelp acc rest =
    case rest of
        [] ->
            ( List.reverse acc, [] )

        line :: more ->
            if String.startsWith ">" line then
                quoteHelp (stripQuote line :: acc) more

            else
                ( List.reverse acc, rest )


stripQuote : String -> String
stripQuote line =
    let
        rest =
            String.dropLeft 1 line
    in
    if String.startsWith " " rest then
        String.dropLeft 1 rest

    else
        rest


headingLevel : String -> Int
headingLevel line =
    if String.startsWith "#" line then
        let
            n =
                countHashes line
        in
        if n <= 6 then n else 0

    else
        0


countHashes : String -> Int
countHashes line =
    if String.startsWith "#" line then
        1 + countHashes (String.dropLeft 1 line)

    else
        0


isHr : String -> Bool
isHr line =
    List.member (String.trim line) [ "---", "***", "___" ]


isBullet : String -> Bool
isBullet line =
    String.startsWith "- " line || String.startsWith "* " line


stripBullet : String -> String
stripBullet line =
    String.dropLeft 2 line


isOrderedLine : String -> Bool
isOrderedLine line =
    case String.indexes ". " line |> List.head of
        Just i ->
            String.toInt (String.trim (String.left i line)) /= Nothing

        Nothing ->
            False


stripOrdered : String -> String
stripOrdered line =
    case String.indexes ". " line |> List.head of
        Just i ->
            String.dropLeft (i + 2) line

        Nothing ->
            line



-- INLINE PARSING ------------------------------------------------------------


inline : String -> List Inline
inline str =
    if String.startsWith "**" str then
        case segment "**" (String.dropLeft 2 str) of
            Just ( body, rest ) ->
                Bold (inline body) :: inline rest

            Nothing ->
                Txt "**" :: inline (String.dropLeft 2 str)

    else if String.startsWith "*" str then
        case segment "*" (String.dropLeft 1 str) of
            Just ( body, rest ) ->
                Italic (inline body) :: inline rest

            Nothing ->
                Txt "*" :: inline (String.dropLeft 1 str)

    else if String.startsWith "`" str then
        case segment "`" (String.dropLeft 1 str) of
            Just ( body, rest ) ->
                Code body :: inline rest

            Nothing ->
                Txt "`" :: inline (String.dropLeft 1 str)

    else if String.startsWith "[" str then
        case linkSplit str of
            Just ( url, label, rest ) ->
                Link url (inline label) :: inline rest

            Nothing ->
                Txt "[" :: inline (String.dropLeft 1 str)

    else
        case firstMarker str of
            Just i ->
                Txt (String.left i str) :: inline (String.dropLeft i str)

            Nothing ->
                [ Txt str ]


segment : String -> String -> Maybe ( String, String )
segment marker str =
    case String.indexes marker str |> List.head of
        Just i ->
            Just ( String.left i str, String.dropLeft (i + String.length marker) str )

        Nothing ->
            Nothing


linkSplit : String -> Maybe ( String, String, String )
linkSplit str =
    case segment "](" (String.dropLeft 1 str) of
        Just ( label, rest ) ->
            case segment ")" rest of
                Just ( url, rest2 ) ->
                    Just ( url, label, rest2 )

                Nothing ->
                    Nothing

        Nothing ->
            Nothing


firstMarker : String -> Maybe Int
firstMarker str =
    List.map (\m -> String.indexes m str |> List.head) [ "**", "*", "`", "[" ]
        |> List.filterMap identity
        |> List.minimum



-- RENDERING -----------------------------------------------------------------


renderBlocks : Config msg -> Int -> Int -> List Block -> List (Html msg)
renderBlocks cfg base index blocks =
    case blocks of
        [] ->
            []

        b :: rest ->
            let
                ( html, nextIndex ) =
                    viewBlock cfg base index b
            in
            html :: renderBlocks cfg base nextIndex rest


viewBlock : Config msg -> Int -> Int -> Block -> ( Html msg, Int )
viewBlock cfg base index block =
    case block of
        Head lvl rawTitle ->
            ( headingTag (renderedLevel base lvl) rawTitle, index )

        Para s ->
            ( Html.p [] (renderInlineAll s), index )

        CodeBlock_ lang file body ->
            ( CodeBlock.view
                { index = index
                , lang = lang
                , filename = file
                , body = body
                , onCopy = cfg.copyCode
                }
            , index + 1
            )

        ListBlock ordered items ->
            ( if ordered then
                Html.ol [ Attr.class "md-ol" ]
                    (List.indexedMap
                        (\i item ->
                            Html.li []
                                (Html.span [ Attr.class "md-num", Attr.attribute "aria-hidden" "true" ]
                                    [ Html.text (pad2 (i + 1)) ]
                                :: renderInlineAll item
                                )
                        )
                        items
                    )

              else
                Html.ul [ Attr.class "md-ul" ]
                    (List.map
                        (\item ->
                            Html.li []
                                (Html.span [ Attr.class "md-dash", Attr.attribute "aria-hidden" "true" ]
                                    [ Html.text "▪" ]
                                :: renderInlineAll item
                                )
                        )
                        items
                    )
            , index
            )

        Quote kind s ->
            ( case kind of
                Pull ->
                    Html.blockquote [ Attr.class "md-quote" ]
                        (List.map (\line -> Html.p [] (renderInlineAll line))
                            (String.split "\n" s)
                        )

                Note ->
                    Html.aside [ Attr.class "md-note md-note-info" ]
                        (Html.span [ Attr.class "md-note-tag" ] [ Html.text "NOTE" ]
                            :: noteLines s
                        )

                Warn ->
                    Html.aside [ Attr.class "md-note md-note-warn" ]
                        (Html.span [ Attr.class "md-note-tag" ] [ Html.text "WARNING" ]
                            :: noteLines s
                        )
            , index
            )

        Table header rows ->
            ( Html.figure [ Attr.class "md-table-wrap" ]
                [ Html.table [ Attr.class "md-table" ]
                    (Html.thead [] [ Html.tr [] (List.map thCell header) ]
                        :: List.map tbodyRow rows
                    )
                ]
            , index
            )

        Image img ->
            ( Html.figure [ Attr.class "md-img" ]
                [ Html.img
                    [ Attr.src img.src
                    , Attr.alt img.alt
                    , Attr.attribute "loading" "lazy"
                    ]
                    []
                , Html.figcaption [] [ Html.text img.alt ]
                ]
            , index
            )

        Hr ->
            ( Html.hr [ Attr.class "md-hr" ] [], index )


noteLines : String -> List (Html msg)
noteLines s =
    s
        |> String.split "\n"
        |> stripMarkerLine
        |> List.map (\line -> Html.p [] (renderInlineAll line))


{-| The NOTE / WARNING tag can sit on its own line or lead the first line
("NOTE: currently on the bench…"). Either way it must not reach the body.
-}
stripMarkerLine : List String -> List String
stripMarkerLine lines =
    case lines of
        first :: rest ->
            case markerRemainder first of
                Just "" ->
                    rest

                Just remainder ->
                    remainder :: rest

                Nothing ->
                    lines

        [] ->
            []


markerRemainder : String -> Maybe String
markerRemainder line =
    let
        trimmed =
            String.trim line

        lowered =
            String.toLower trimmed

        body =
            -- detect on the lowercased copy, cut from the original (keeps case)
            if String.startsWith "[!" lowered then
                case String.indexes "]" lowered of
                    i :: _ ->
                        Just (String.dropLeft (i + 1) trimmed)

                    [] ->
                        Nothing

            else if
                String.startsWith "note " lowered
                    || String.startsWith "warning " lowered
                    || String.startsWith "warn " lowered
                    || String.startsWith "note:" lowered
                    || String.startsWith "warning:" lowered
                    || String.startsWith "warn:" lowered
            then
                Just (afterFirstWord trimmed)

            else if
                lowered == "note"
                    || lowered == "warning"
                    || lowered == "warn"
                    || lowered == "[!note]"
                    || lowered == "[!warning]"
                    || lowered == "[!warn]"
            then
                Just ""

            else
                Nothing
    in
    Maybe.map (trimLeadingPunct >> String.trim) body


afterFirstWord : String -> String
afterFirstWord s =
    s
        |> String.words
        |> List.drop 1
        |> String.join " "


trimLeadingPunct : String -> String
trimLeadingPunct s =
    if String.startsWith ":" s || String.startsWith "-" s || String.startsWith "—" s || String.startsWith " " s then
        trimLeadingPunct (String.dropLeft 1 s)

    else
        s


headingTag : Int -> String -> Html msg
headingTag rendered rawTitle =
    let
        kids =
            renderInlineAll rawTitle

        attrs =
            [ Attr.id (slug rawTitle) ]
    in
    case rendered of
        2 ->
            Html.h2 (Attr.class "md-h1" :: attrs) kids

        3 ->
            Html.h3 (Attr.class "md-h2" :: attrs) kids

        _ ->
            Html.h4 (Attr.class "md-h3" :: attrs) kids


thCell : String -> Html msg
thCell cell =
    Html.th [ Attr.scope "col" ] (renderInlineAll cell)


tbodyRow : List String -> Html msg
tbodyRow cells =
    Html.tr [] (List.map tdCell cells)


tdCell : String -> Html msg
tdCell cell =
    Html.td [] (renderInlineAll cell)


pad2 : Int -> String
pad2 n =
    String.fromInt n |> String.padLeft 2 '0'


renderInlineAll : String -> List (Html msg)
renderInlineAll s =
    List.map renderInline (inline s)


renderInline : Inline -> Html msg
renderInline i =
    case i of
        Txt s ->
            Html.text s

        Bold c ->
            Html.strong [] (List.map renderInline c)

        Italic c ->
            Html.em [] (List.map renderInline c)

        Code c ->
            Html.code [] [ Html.text c ]

        Link url c ->
            if String.startsWith "#/" url then
                -- internal hash route: keep it in-app
                Html.a [ Attr.href url ] (List.map renderInline c)

            else
                Html.a [ Attr.href url, Attr.target "_blank", Attr.rel "noopener" ]
                    (List.map renderInline c)
