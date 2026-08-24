module Pages.Writing exposing (view)

import Content.Posts as Posts
import Html exposing (Html, a, div, p, span, text)
import Html.Attributes as Attr
import Router exposing (Route(..))
import Types exposing (statusClass)
import Utils.Date as Date
import Utils.Text


view : () -> Html msg
view _ =
    let
        count =
            List.length Posts.posts

        words =
            Utils.Text.totalWords (List.map .body Posts.posts)
    in
    Html.section [ Attr.class "wrap page" ]
        [ p [ Attr.class "crumb" ] [ text "~/writing" ]
        , Html.h1 [ Attr.class "page-title" ] [ text "FIELD NOTES" ]
        , p [ Attr.class "page-intro" ]
            [ text """An engineering notebook: build logs, post-mortems, opinions with receipts.
Everything documented while the scars are still fresh."""
            ]
        , div [ Attr.class "index-stats", Attr.attribute "aria-hidden" "true" ]
            [ span [] [ text (pad2 count ++ " entries") ]
            , span [ Attr.class "dim" ] [ text " · " ]
            , span [] [ text ("~" ++ String.fromInt (words // 100) ++ "00 words") ]
            , span [ Attr.class "dim" ] [ text " · newest first" ]
            ]
        , div [ Attr.class "fn-index" ]
            (List.map entry Posts.posts)
        ]


entry : Posts.Post -> Html msg
entry post =
    a [ Attr.class "fni-row", Attr.href (Router.href (Post post.slug)) ]
        [ div [ Attr.class "fni-meta" ]
            [ span [ Attr.class "fni-no" ] [ text ("FN-" ++ pad2 post.number) ]
            , span [ Attr.class "dim" ] [ text " / " ]
            , Html.time [ Attr.datetime (Date.iso post.slug) ] [ text (Date.display post.slug) ]
            , span [ Attr.class "dim" ] [ text " · " ]
            , text ((String.fromInt (Utils.Text.readMinutes post.body)) ++ " min")
            , span [ Attr.class ("fni-status st-" ++ statusClass post.status) ] [ text post.status ]
            ]
        , span [ Attr.class "fni-title" ] [ text post.title ]
        , p [ Attr.class "fni-desc" ] [ text post.description ]
        , div [ Attr.class "fni-tags" ]
            (List.map (\t -> span [ Attr.class "tag" ] [ text t ]) post.tags)
        , span [ Attr.class "wr-arr fni-arr", Attr.attribute "aria-hidden" "true" ] [ text "→" ]
        ]


pad2 : Int -> String
pad2 n =
    String.fromInt n |> String.padLeft 2 '0'
