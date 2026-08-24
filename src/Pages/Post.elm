module Pages.Post exposing (view)

import Components.Ui as Ui
import Content.Posts as Posts
import Html exposing (Html, a, div, footer, h1, header, nav, p, span, text)
import Html.Attributes as Attr
import Html.Events as Ev
import Json.Decode as Json
import Markdown
import Router exposing (Route(..))
import Types exposing (statusClass)
import Utils.Date as Date
import Utils.Text


type alias Handlers msg =
    { copyCode : { id : String, text : String } -> msg
    , tocClick : String -> msg
    }


view : Handlers msg -> String -> Html msg
view handlers slug =
    case List.filter (\p -> p.slug == slug) Posts.posts |> List.head of
        Nothing ->
            text ""

        Just post ->
            let
                bodySrc =
                    stripTitle post.body

                toc =
                    Markdown.headings bodySrc |> List.filter .isSection

                neighbours =
                    neighboursOf slug
            in
            Html.article [ Attr.class "wrap doc" ]
                [ header [ Attr.class "doc-head" ]
                    [ p [ Attr.class "crumb" ]
                        [ a [ Attr.class "crumb-link", Attr.href (Router.href Writing) ] [ text "~/writing" ]
                        , text ("/" ++ slug)
                        ]
                    , div [ Attr.class "doc-band" ]
                        [ span [ Attr.class "field-no" ]
                            [ text ("FIELD NOTE " ++ pad2 post.number) ]
                        , span [ Attr.class ("status st-" ++ statusClass post.status) ]
                            [ span [ Attr.class "status-led", Attr.attribute "aria-hidden" "true" ] []
                            , text post.status
                            ]
                        ]
                    , h1 [ Attr.class "doc-title" ] [ text post.title ]
                    , Ui.specTable
                        [ { key = "published", value = Date.display post.slug }
                        , { key = "reading", value = String.fromInt (Utils.Text.readMinutes post.body) ++ " min" }
                        , { key = "topics", value = String.join " / " post.tags }
                        , { key = "index", value = "fn-" ++ pad2 post.number }
                        ]
                    ]
                , div [ Attr.class "doc-layout" ]
                    [ div [ Attr.class "md doc-body" ]
                        [ Markdown.render { copyCode = handlers.copyCode } bodySrc ]
                    , if List.length toc >= 2 then
                        navToc handlers.tocClick toc

                      else
                        text ""
                    ]
                , footer [ Attr.class "doc-end" ]
                    [ span [ Attr.attribute "aria-hidden" "true" ] [ text ("■ END OF DOCUMENT · FN-" ++ pad2 post.number ++ " ■") ] ]
                , nav [ Attr.class "doc-neighbours", Attr.attribute "aria-label" "more field notes" ]
                    ([ case neighbours.older of
                        Just older ->
                            a [ Attr.class "nb nb-prev", Attr.href (Router.href (Post older.slug)) ]
                                [ span [ Attr.class "nb-dir" ] [ text "← older" ]
                                , span [ Attr.class "nb-title" ] [ text older.title ]
                                ]

                        Nothing ->
                            span [ Attr.class "nb nb-empty" ] []
                     ]
                        ++ [ a [ Attr.class "nb nb-index", Attr.href (Router.href Writing) ]
                                [ span [ Attr.class "nb-dir" ] [ text "↑" ]
                                , span [ Attr.class "nb-title" ] [ text "all field notes" ]
                                ]
                           ]
                        ++ [ case neighbours.newer of
                                Just newer ->
                                    a [ Attr.class "nb nb-next", Attr.href (Router.href (Post newer.slug)) ]
                                        [ span [ Attr.class "nb-dir" ] [ text "newer →" ]
                                        , span [ Attr.class "nb-title" ] [ text newer.title ]
                                        ]

                                Nothing ->
                                    span [ Attr.class "nb nb-empty" ] []
                           ]
                    )
                ]


navToc : (String -> msg) -> List Markdown.Heading -> Html msg
navToc onClick items =
    Html.aside
        [ Attr.class "toc"
        , Attr.attribute "aria-label" "table of contents"
        ]
        [ p [ Attr.class "toc-head" ] [ text "§ CONTENTS" ]
        , Html.ol [ Attr.class "toc-list" ]
            (List.map (tocItem onClick) items)
        ]


tocItem : (String -> msg) -> Markdown.Heading -> Html msg
tocItem onClick h =
    Html.li []
        [ a
            [ Attr.href ("#" ++ h.id)
            , Ev.preventDefaultOn "click" (Json.succeed ( onClick h.id, True ))
            ]
            [ text h.title ]
        ]



-- helpers


stripTitle : String -> String
stripTitle body =
    case String.lines body of
        first :: rest ->
            if String.startsWith "# " first then
                String.join "\n" rest

            else
                body

        [] ->
            body


{-| Posts are stored newest-first: "newer" sits before the current entry,
"older" after it.
-}
neighboursOf : String -> { newer : Maybe Posts.Post, older : Maybe Posts.Post }
neighboursOf slug =
    let
        indexed =
            List.indexedMap Tuple.pair Posts.posts
    in
    case List.filter (\( _, p ) -> p.slug == slug) indexed |> List.head of
        Just ( i, _ ) ->
            { newer = lookupAt (i - 1) indexed
            , older = lookupAt (i + 1) indexed
            }

        Nothing ->
            { newer = Nothing, older = Nothing }


lookupAt : Int -> List ( Int, Posts.Post ) -> Maybe Posts.Post
lookupAt i indexed =
    List.filter (\( j, _ ) -> j == i) indexed
        |> List.head
        |> Maybe.map Tuple.second


pad2 : Int -> String
pad2 n =
    String.fromInt n |> String.padLeft 2 '0'
