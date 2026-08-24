module Components.Ui exposing (crumbLine, sectionHead, specTable, statusLed)

import Html exposing (Html, div, dl, dd, dt, h2, p, span, text)
import Html.Attributes as Attr
import Types exposing (statusClass)


{-| Section header built like a technical drawing label:
`[01]  CURRENT WORK ────────────────────── 04 PROCESSES`
-}
sectionHead : String -> String -> String -> Html msg
sectionHead index title note =
    div [ Attr.class "sec-head" ]
        [ span [ Attr.class "sec-index", Attr.attribute "aria-hidden" "true" ] [ text ("[" ++ index ++ "]") ]
        , h2 [ Attr.class "sec-title" ] [ text title ]
        , span [ Attr.class "sec-rule", Attr.attribute "aria-hidden" "true" ] []
        , if note == "" then
            text ""

          else
            span [ Attr.class "sec-count" ] [ text note ]
        ]


statusLed : String -> Html msg
statusLed s =
    span [ Attr.class ("status st-" ++ statusClass s) ]
        [ span [ Attr.class "status-led", Attr.attribute "aria-hidden" "true" ] []
        , text s
        ]


specTable : List { key : String, value : String } -> Html msg
specTable rows =
    dl [ Attr.class "spec" ] (List.map row rows)


row : { key : String, value : String } -> Html msg
row r =
    div [ Attr.class "spec-row" ]
        [ dt [ Attr.class "spec-key" ] [ text r.key ]
        , dd [ Attr.class "spec-val" ] [ text r.value ]
        ]


crumbLine : String -> Html msg
crumbLine path =
    p [ Attr.class "crumb", Attr.attribute "aria-label" "location" ]
        [ text path ]
