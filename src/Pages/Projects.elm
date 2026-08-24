module Pages.Projects exposing (projectsView, researchView)

import Components.Ui as Ui
import Content.Projects exposing (gluTopology, projects, research)
import Html exposing (Html, a, aside, div, figure, h2, h3, li, p, span, text, ul)
import Html.Attributes as Attr
import Types


projectsView : () -> Html msg
projectsView _ =
    Html.section [ Attr.class "wrap page" ]
        [ p [ Attr.class "crumb" ] [ text "~/projects" ]
        , Html.h1 [ Attr.class "page-title" ] [ text "PROJECTS" ]
        , p [ Attr.class "page-intro" ]
            [ text """Technical artifacts, not demos. Each one exists because I wanted to
understand a layer of the stack by building it myself."""
            ]
        , div [ Attr.class "dossiers" ] (List.indexedMap dossier projects)
        ]


researchView : () -> Html msg
researchView _ =
    Html.section [ Attr.class "wrap page" ]
        [ p [ Attr.class "crumb" ] [ text "~/research" ]
        , Html.h1 [ Attr.class "page-title" ] [ text "OPEN THREADS" ]
        , p [ Attr.class "page-intro" ]
            [ text """A lab notebook, not a publication database: questions I'm actively pulling on,
in various states of being wrong about."""
            ]
        , div [ Attr.class "research-list" ] (List.map researchEntry research)
        ]


dossier : Int -> Types.Project -> Html msg
dossier i proj =
    Html.article [ Attr.class "dossier", Attr.id ("proj-" ++ proj.id) ]
        [ aside [ Attr.class "dos-rail" ]
            [ span [ Attr.class "dos-no", Attr.attribute "aria-hidden" "true" ] [ text ("P." ++ pad2 (i + 1)) ]
            , Ui.statusLed proj.status
            , Ui.specTable
                [ { key = "domain", value = proj.domain }
                , { key = "lang", value = proj.lang }
                , { key = "period", value = proj.period }
                ]
            , div [ Attr.class "dos-stack" ]
                (List.map (\s -> span [ Attr.class "tag" ] [ text s ]) proj.stack)
            ]
        , div [ Attr.class "dos-main" ]
            [ div [ Attr.class "dos-name-row" ]
                [ h2 [ Attr.class "dos-name" ] [ text proj.name ]
                , a
                    [ Attr.class "ext-link"
                    , Attr.href proj.url
                    , Attr.target "_blank"
                    , Attr.rel "noopener"
                    , Attr.attribute "aria-label" (proj.name ++ " on " ++ proj.urlLabel)
                    ]
                    [ text (proj.urlLabel ++ " ↗") ]
                ]
            , p [ Attr.class "dos-tagline" ] [ text proj.tagline ]
            , h3 [ Attr.class "mini-head" ] [ text "WHY IT EXISTS" ]
            , p [ Attr.class "dos-why" ] [ text proj.why ]
            , h3 [ Attr.class "mini-head" ] [ text "ENGINEERING" ]
            , ul [ Attr.class "eng-list" ] (List.map engItem proj.engineering)
            , if proj.id == "glu" then
                figure [ Attr.class "ascii-diagram" ]
                    [ Html.pre [] [ text gluTopology ]
                    , Html.figcaption [] [ text "fig.01 — glu process topology. drawn in ascii because it was good enough for plan9." ]
                    ]

              else
                text ""
            ]
        ]


engItem : String -> Html msg
engItem item =
    li []
        [ span [ Attr.class "eng-mark", Attr.attribute "aria-hidden" "true" ] [ text "▸" ]
        , text item
        ]


researchEntry : Types.ResearchEntry -> Html msg
researchEntry entry =
    Html.article [ Attr.class "research-entry" ]
        [ div [ Attr.class "re-head" ]
            [ span [ Attr.class "re-kind" ] [ text entry.kind ]
            , Ui.statusLed entry.status
            ]
        , h3 [ Attr.class "re-title" ] [ text entry.title ]
        , p [ Attr.class "re-abstract" ] [ text entry.abstract ]
        , ul [ Attr.class "eng-list" ] (List.map engItem entry.notes)
        , div [ Attr.class "related-row" ]
            (span [ Attr.class "dim related-label" ] [ text "related:" ]
                :: List.map relatedLink entry.related
                ++ externalLinks entry.links
            )
        ]


externalLinks : List ( String, String ) -> List (Html msg)
externalLinks links =
    List.map
        (\( label, url ) ->
            a [ Attr.class "related-link is-ext", Attr.href url, Attr.target "_blank", Attr.rel "noopener" ]
                [ text (label ++ " ↗") ]
        )
        links


relatedLink : ( String, String ) -> Html msg
relatedLink ( label, url ) =
    a [ Attr.class "related-link", Attr.href url ] [ text label ]


pad2 : Int -> String
pad2 n =
    String.fromInt n |> String.padLeft 2 '0'
