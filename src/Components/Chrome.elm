module Components.Chrome exposing (footerView, masthead)

import Components.Ui as Ui
import Content.Site as Site
import Html exposing (Html, a, div, footer, header, nav, p, span, text, time)
import Html.Attributes as Attr
import Html.Events as Ev
import Router exposing (Route(..))
import Time


navItems : List ( String, String, Route )
navItems =
    [ ( "01", "index", Home )
    , ( "02", "writing", Writing )
    , ( "03", "projects", Projects )
    , ( "04", "research", Research )
    , ( "05", "about", About )
    ]


masthead : { route : Route, now : Time.Posix, onSearch : msg } -> Html msg
masthead { route, now, onSearch } =
    header [ Attr.class "masthead" ]
        [ div [ Attr.class "wrap mast-row" ]
            [ a [ Attr.class "brand", Attr.href (Router.href Home) ]
                [ span [ Attr.class "brand-mark", Attr.attribute "aria-hidden" "true" ] [ text "▮" ]
                , span [ Attr.class "brand-name" ] [ text "VIXEL" ]
                ]
            , nav [ Attr.class "site-nav", Attr.attribute "aria-label" "primary" ]
                (List.map (navLink route) navItems)
            , div [ Attr.class "head-tools" ]
                [ time [ Attr.class "clock", Attr.datetime (clockIso now) ]
                    [ text ("UTC " ++ clockText now) ]
                , Html.button
                    [ Attr.class "search-btn"
                    , Attr.type_ "button"
                    , Ev.onClick onSearch
                    , Attr.title "search (/)"
                    , Attr.attribute "aria-label" "open search"
                    ]
                    [ span [ Attr.class "search-glyph", Attr.attribute "aria-hidden" "true" ] [ text "⌕" ]
                    , span [ Attr.class "search-key" ] [ text "/" ]
                    ]
                ]
            ]
        ]


navLink : Route -> ( String, String, Route ) -> Html msg
navLink current ( num, label, route ) =
    let
        isActive =
            case ( route, current ) of
                ( Home, Home ) ->
                    True

                ( Writing, Writing ) ->
                    True

                ( Writing, Post _ ) ->
                    True

                ( Projects, Projects ) ->
                    True

                ( Research, Research ) ->
                    True

                ( About, About ) ->
                    True

                _ ->
                    False
    in
    a
        [ Attr.class "nav-link"
        , Attr.href (Router.href route)
        , if isActive then
            Attr.attribute "aria-current" "page"

          else
            Attr.class ""
        ]
        [ span [ Attr.class "nav-num", Attr.attribute "aria-hidden" "true" ] [ text num ]
        , text label
        ]


footerView : Html msg
footerView =
    footer [ Attr.class "colophon" ]
        [ div [ Attr.class "wrap colo-grid" ]
            [ div [ Attr.class "colo-id" ]
                [ Html.pre [ Attr.class "cat", Attr.attribute "aria-hidden" "true", Attr.title "it's a cat" ]
                    [ text catArt ]
                , p [ Attr.class "colo-line" ]
                    [ text "© 2026 vixel — hand-built, no framework survived." ]
                ]
            , nav [ Attr.class "colo-col", Attr.attribute "aria-label" "colophon index" ]
                (p [ Attr.class "colo-head" ] [ text "INDEX" ]
                    :: List.map
                        (\( _, label, route ) ->
                            a [ Attr.class "colo-link", Attr.href (Router.href route) ] [ text label ]
                        )
                        navItems
                )
            , div [ Attr.class "colo-col" ]
                (p [ Attr.class "colo-head" ] [ text "CHANNELS" ]
                    :: List.map socialLink Site.elsewhere
                )
            , div [ Attr.class "colo-col" ]
                [ p [ Attr.class "colo-head" ] [ text "SYSTEM" ]
                , p [ Attr.class "colo-line" ] [ text "elm 0.19 · zero js frameworks" ]
                , p [ Attr.class "colo-line" ] [ text "no cookies · no analytics · no tracking" ]
                , a [ Attr.class "colo-link", Attr.href "rss.xml" ] [ text "rss feed ↗" ]
                ]
            ]
        , div [ Attr.class "wrap colo-keys", Attr.attribute "aria-hidden" "true" ]
            [ text "keys:  / search  ·  g h index  ·  g w writing  ·  esc close" ]
        ]


socialLink : { label : String, url : String } -> Html msg
socialLink s =
    a
        [ Attr.class "colo-link"
        , Attr.href s.url
        , if String.startsWith "mailto:" s.url then
            Attr.class ""

          else
            Attr.target "_blank"
        , Attr.rel "noopener me"
        ]
        [ text (s.label ++ " ↗") ]


catArt : String
catArt =
    """ /\\_/\\
( o.o )
 > ^ <"""


clockText : Time.Posix -> String
clockText posix =
    pad (Time.toHour Time.utc posix) ++ ":" ++ pad (Time.toMinute Time.utc posix)


clockIso : Time.Posix -> String
clockIso posix =
    String.fromInt (Time.toYear Time.utc posix)
        ++ "-"
        ++ pad (monthNumber (Time.toMonth Time.utc posix))
        ++ "-"
        ++ pad (Time.toDay Time.utc posix)
        ++ "T"
        ++ clockText posix
        ++ ":00Z"


monthNumber : Time.Month -> Int
monthNumber month =
    case month of
        Time.Jan ->
            1

        Time.Feb ->
            2

        Time.Mar ->
            3

        Time.Apr ->
            4

        Time.May ->
            5

        Time.Jun ->
            6

        Time.Jul ->
            7

        Time.Aug ->
            8

        Time.Sep ->
            9

        Time.Oct ->
            10

        Time.Nov ->
            11

        Time.Dec ->
            12


pad : Int -> String
pad n =
    String.fromInt n |> String.padLeft 2 '0'
