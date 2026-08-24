module Components.Palette exposing
    ( Suggestion
    , Target(..)
    , filterSuggestions
    , suggestions
    , view
    )

import Content.Posts as Posts
import Html exposing (Html, div, input, li, span, text, ul)
import Html.Attributes as Attr
import Html.Events as Ev
import Json.Decode as Json
import Router exposing (Route(..))
import Utils.Date as Date


type Target
    = GoTo Route
    | External String


type alias Suggestion =
    { label : String
    , kind : String
    , detail : String
    , haystack : String
    , target : Target
    }


suggestions : List Suggestion
suggestions =
    [ Suggestion "index" "page" "start here" "home index start root ~/ landing"
        (GoTo Home)
    , Suggestion "writing" "page" "field notes, newest first" "writing blog posts notes field notebook"
        (GoTo Writing)
    , Suggestion "projects" "page" "glu · plast · argos · grf" "projects builds software glu plast argos grf"
        (GoTo Projects)
    , Suggestion "research" "page" "open problems and experiments" "research papers experiments world models representation learning"
        (GoTo Research)
    , Suggestion "about" "page" "who is behind this" "about bio who contact email"
        (GoTo About)
    , Suggestion "rss" "feed" "subscribe without an account" "rss feed subscribe atom xml"
        (External "rss.xml")
    , Suggestion "github" "link" "github.com/Vixel2006 ↗" "github source code repos vixel2006 git"
        (External "https://github.com/Vixel2006")
    ]
        ++ List.map postSuggestion Posts.posts


postSuggestion : Posts.Post -> Suggestion
postSuggestion post =
    Suggestion post.title
        ("fn-" ++ pad2 post.number)
        (Date.display post.slug ++ " · " ++ String.join ", " post.tags)
        (String.join " "
            [ post.slug
            , post.title
            , String.join " " post.tags
            , post.description
            ]
        )
        (GoTo (Post post.slug))


filterSuggestions : String -> List Suggestion
filterSuggestions query =
    let
        needle =
            String.toLower (String.trim query)

        words =
            String.words needle
    in
    if needle == "" then
        suggestions

    else
        List.filter
            (\s ->
                let
                    hay =
                        String.toLower s.haystack
                in
                List.all (\w -> String.contains w hay) words
            )
            suggestions


pad2 : Int -> String
pad2 n =
    String.fromInt n |> String.padLeft 2 '0'


view :
    { query : String
    , selected : Int
    , results : List Suggestion
    , onInput : String -> msg
    , onKey : String -> msg
    , onPick : Int -> msg
    , onHover : Int -> msg
    , onDismiss : msg
    , onSwallow : msg
    }
    -> Html msg
view { query, selected, results, onInput, onKey, onPick, onHover, onDismiss, onSwallow } =
    div
        [ Attr.class "palette-overlay"
        , Ev.onClick onDismiss
        ]
        [ div
            [ Attr.class "palette"
            , Attr.attribute "role" "dialog"
            , Attr.attribute "aria-modal" "true"
            , Attr.attribute "aria-label" "search"
            , Ev.stopPropagationOn "click" (Json.succeed ( onSwallow, True ))
            ]
            [ div [ Attr.class "palette-inputrow" ]
                [ span [ Attr.class "palette-prompt", Attr.attribute "aria-hidden" "true" ]
                    [ text "$ grep -i" ]
                , input
                    [ Attr.id "palette-input"
                    , Attr.class "palette-input"
                    , Attr.type_ "text"
                    , Attr.value query
                    , Attr.placeholder "query…"
                    , Attr.spellcheck False
                    , Attr.autocomplete False
                    , Attr.attribute "autocapitalize" "off"
                    , Attr.attribute "autocorrect" "off"
                    , Attr.attribute "role" "combobox"
                    , Attr.attribute "aria-expanded" "true"
                    , Attr.attribute "aria-controls" "palette-listbox"
                    , Attr.attribute "aria-autocomplete" "list"
                    , Attr.attribute "aria-label" "search the site"
                    , Ev.onInput onInput
                    , Ev.preventDefaultOn "keydown" (keyDecoder onKey)
                    ]
                    []
                ]
            , ul [ Attr.class "palette-list", Attr.id "palette-listbox", Attr.attribute "role" "listbox" ]
                (if List.isEmpty results then
                    [ li [ Attr.class "palette-item palette-empty", Attr.attribute "role" "option" ]
                        [ span [ Attr.class "pi-label" ] [ text "no matches — grep returned nothing" ] ]
                    ]

                 else
                    List.indexedMap (itemView selected onPick onHover) results
                )
            , div [ Attr.class "palette-foot" ]
                [ span [] [ text "↑↓ select · ⏎ open · esc close" ]
                , span [ Attr.class "palette-count" ]
                    [ text ((String.fromInt (List.length results) |> String.padLeft 2 '0') ++ " hits") ]
                ]
            ]
        ]


keyDecoder : (String -> msg) -> Json.Decoder ( msg, Bool )
keyDecoder tag =
    Json.field "key" Json.string
        |> Json.map
            (\key ->
                ( tag key
                , List.member key [ "Enter", "Tab", "ArrowDown", "ArrowUp" ]
                )
            )


itemView : Int -> (Int -> msg) -> (Int -> msg) -> Int -> Suggestion -> Html msg
itemView sel onPick onHover i s =
    li
        [ Attr.class
            ("palette-item"
                ++ (if sel == i then
                        " is-active"

                    else
                        ""
                   )
            )
        , Attr.attribute "role" "option"
        , Attr.attribute "aria-selected"
            (if sel == i then
                "true"

             else
                "false"
            )
        , Ev.onMouseEnter (onHover i)
        , Ev.onClick (onPick i)
        ]
        [ span [ Attr.class "pi-kind" ] [ text s.kind ]
        , span [ Attr.class "pi-label" ] [ text s.label ]
        , span [ Attr.class "pi-detail" ] [ text s.detail ]
        ]
