module Pages.NotFound exposing (view)

import Html exposing (Html, a, div, li, ol, p, span, text)
import Html.Attributes as Attr


view : String -> Html msg
view requestedPath =
    let
        path =
            if requestedPath == "" || requestedPath == "/" then
                "/dev/null"

            else
                requestedPath
    in
    Html.section [ Attr.class "wrap nf" ]
        [ div [ Attr.class "nf-term" ]
            [ p [ Attr.class "nf-line" ]
                [ span [ Attr.class "nf-prompt" ] [ text "vixel@www:~$ " ]
                , span [] [ text ("cat " ++ path) ]
                ]
            , p [ Attr.class "nf-line nf-err" ]
                [ text ("cat: " ++ path ++ ": No such file or directory") ]
            , p [ Attr.class "nf-line nf-err" ]
                [ text "[exit code 1 — one process reaped]" ]
            , div [ Attr.class "nf-block" ]
                [ p [ Attr.class "nf-halt" ]
                    [ text "ERROR 404 · REQUESTED OBJECT NOT FOUND" ]
                , p [ Attr.class "nf-sub dim" ]
                    [ text "core dumped. stack trace follows." ]
                ]
            , p [ Attr.class "nf-line nf-causes-head" ] [ text "possible causes:" ]
            , ol [ Attr.class "nf-causes" ]
                [ li [] [ span [ Attr.class "nf-no" ] [ text "01" ], text " typo — humans make them, even you" ]
                , li [] [ span [ Attr.class "nf-no" ] [ text "02" ], text " deleted — probably during a refactor it deserved" ]
                , li [] [ span [ Attr.class "nf-no" ] [ text "03" ], text " never existed — like that startup's moat" ]
                , li [] [ span [ Attr.class "nf-no" ] [ text "04" ], text " reality diverged — checkout a stable branch and try again" ]
                ]
            , p [ Attr.class "nf-line nf-links" ]
                [ span [ Attr.class "nf-prompt" ] [ text "$ " ]
                , text "cd "
                , a [ Attr.class "nf-link", Attr.href "#/" ] [ text "~/" ]
                , text " && ls "
                , a [ Attr.class "nf-link", Attr.href "#/writing" ] [ text "writing/" ]
                , text " || "
                , a [ Attr.class "nf-link", Attr.href "#/projects" ] [ text "projects/" ]
                ]
            , p [ Attr.class "nf-line" ]
                [ span [ Attr.class "nf-prompt" ] [ text "$ " ]
                , span [ Attr.class "cursor", Attr.attribute "aria-hidden" "true" ] []
                ]
            ]
        , p [ Attr.class "nf-foot dim" ]
            [ text "(the webmaster has been notified. the webmaster is also the one who broke it.)" ]
        ]
