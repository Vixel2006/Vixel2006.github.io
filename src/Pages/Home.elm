module Pages.Home exposing (view)

import Components.Ui as Ui
import Content.Posts as Posts
import Content.Projects exposing (projects)
import Content.Site as Site
import Html exposing (Html, a, aside, div, h1, p, span, text)
import Html.Attributes as Attr
import Router exposing (Route(..))
import Types exposing (statusClass)
import Utils.Date as Date
import Utils.Text


view : () -> Html msg
view _ =
    div [ Attr.class "home" ]
        [ hero
        , currentWork
        , fieldNotes
        , statusNow
        ]



-- HERO ----------------------------------------------------------------------


hero : Html msg
hero =
    Html.section [ Attr.class "wrap hero" ]
        [ div [ Attr.class "hero-main" ]
            [ p [ Attr.class "hero-kicker" ]
                [ text "~/index "
                , span [ Attr.class "dim" ] [ text ("· " ++ Site.uptimeLine) ]
                ]
            , h1 [ Attr.class "hero-name" ]
                [ text "VIXEL"
                , span [ Attr.class "cursor", Attr.attribute "aria-hidden" "true" ] []
                ]
            , p [ Attr.class "hero-statement" ] [ text Site.statement ]
            , p [ Attr.class "hero-domains" ] [ text Site.domains ]
            , p [ Attr.class "hero-lede" ]
                [ text """Curious enough to take things apart. Arrogant enough to rebuild them.
Disciplined enough to document what happens. This site is the documentation half —
a lab notebook of middleware, runtimes, world models, embedded hardware,
and the failures between the commits."""
                ]
            , div [ Attr.class "hero-cta" ]
                [ a [ Attr.class "cta cta-solid", Attr.href (Router.href Writing) ]
                    [ text "read field notes", span [ Attr.class "cta-arr" ] [ text "→" ] ]
                , a [ Attr.class "cta", Attr.href (Router.href Projects) ]
                    [ text "inspect projects" ]
                , a [ Attr.class "cta cta-dim", Attr.href "https://github.com/Vixel2006", Attr.target "_blank", Attr.rel "noopener" ]
                    [ text "github ↗" ]
                ]
            ]
        , aside [ Attr.class "hero-side" ]
            [ div [ Attr.class "spec-box" ]
                [ div [ Attr.class "spec-head" ]
                    [ span [] [ text "SPEC.SYS" ]
                    , span [ Attr.class "live", Attr.attribute "aria-hidden" "true" ] [ text "●" ]
                    ]
                , Ui.specTable Site.spec
                , p [ Attr.class "spec-foot" ]
                    [ span [ Attr.class "dim" ] [ text "$ " ]
                    , text "whoami"
                    , span [ Attr.class "dim" ] [ text " → vixel" ]
                    ]
                ]
            ]
        ]



-- CURRENT WORK ---------------------------------------------------------------


currentWork : Html msg
currentWork =
    Html.section [ Attr.class "wrap home-sec" ]
        [ Ui.sectionHead "01" "CURRENT WORK" ((pad2 (List.length projects)) ++ " PROCESSES")
        , div [ Attr.class "work-table", Attr.attribute "role" "list" ]
            (List.indexedMap workRow projects)
        ]


workRow : Int -> Types.Project -> Html msg
workRow i proj =
    a
        [ Attr.class "work-row"
        , Attr.href (Router.href Projects)
        , Attr.attribute "role" "listitem"
        , Attr.attribute "aria-label" (proj.name ++ ": " ++ proj.tagline)
        ]
        [ span [ Attr.class "wr-no", Attr.attribute "aria-hidden" "true" ] [ text (pad2 (i + 1)) ]
        , Ui.statusLed proj.status
        , span [ Attr.class "wr-name" ] [ text proj.name ]
        , span [ Attr.class "wr-desc" ] [ text proj.tagline ]
        , span [ Attr.class "wr-stack" ] [ text (String.join " · " (List.take 3 proj.stack)) ]
        , span [ Attr.class "wr-arr", Attr.attribute "aria-hidden" "true" ] [ text "→" ]
        ]


fieldNotes : Html msg
fieldNotes =
    Html.section [ Attr.class "wrap home-sec" ]
        [ Ui.sectionHead "02" "FIELD NOTES" "LATEST"
        , div [ Attr.class "fn-list" ]
            (List.map fnRow (List.take 4 Posts.posts))
        , div [ Attr.class "more-row" ]
            [ a [ Attr.class "more-link", Attr.href (Router.href Writing) ]
                [ text "full notebook → ", span [ Attr.class "dim" ] [ text (String.fromInt (List.length Posts.posts) ++ " entries") ] ]
            ]
        ]


fnRow : Posts.Post -> Html msg
fnRow post =
    a [ Attr.class "fn-row", Attr.href (Router.href (Post post.slug)) ]
        [ span [ Attr.class "fnr-date" ] [ text (Date.display post.slug) ]
        , span [ Attr.class "fnr-no" ] [ text ("FN-" ++ pad2 post.number) ]
        , span [ Attr.class "fnr-title" ]
            [ text post.title ]
        , span [ Attr.class "fnr-time" ] [ text ((String.fromInt (Utils.Text.readMinutes post.body) ++ " min")) ]
        , span [ Attr.class "wr-arr", Attr.attribute "aria-hidden" "true" ] [ text "→" ]
        ]



-- NOW -----------------------------------------------------------------------


statusNow : Html msg
statusNow =
    let
        totalWords =
            List.foldl (\p acc -> acc + List.length (String.words p.body)) 0 Posts.posts
    in
    Html.section [ Attr.class "wrap home-sec" ]
        [ Ui.sectionHead "03" "STATUS / NOW" "RUNTIME"
        , div [ Attr.class "now-grid" ]
            [ div [ Attr.class "now-col" ]
                [ p [ Attr.class "col-label" ] [ text "OCCUPYING THE WORKBENCH" ]
                , Html.ul [ Attr.class "now-list" ]
                    (List.map nowItem Site.nowFeed)
                ]
            , div [ Attr.class "now-col" ]
                [ p [ Attr.class "col-label" ] [ text "NOTEBOOK" ]
                , Ui.specTable
                    [ { key = "entries", value = String.fromInt (List.length Posts.posts) }
                    , { key = "words", value = "~" ++ String.fromInt (totalWords // 1000) ++ "k" }
                    , { key = "latest", value = Date.display (latestSlug ()) }
                    , { key = "feed", value = "rss.xml" }
                    ]
                , p [ Attr.class "now-note" ]
                    [ text """No comments section. If something here is wrong,
that is what email is for.""" ]
                ]
            ]
        ]


nowItem : { topic : String, detail : String, status : String } -> Html msg
nowItem item =
    Html.li [ Attr.class "now-item" ]
        [ div [ Attr.class "now-top" ]
            [ span [ Attr.class "now-topic" ] [ text item.topic ]
            , Ui.statusLed item.status
            ]
        , p [ Attr.class "now-detail" ] [ text item.detail ]
        ]


latestSlug : () -> String
latestSlug _ =
    case List.head Posts.posts of
        Just p ->
            p.slug

        Nothing ->
            ""


pad2 : Int -> String
pad2 n =
    String.fromInt n |> String.padLeft 2 '0'
