module Components.CodeBlock exposing (view)

import Html exposing (Html, button, code, figure, figcaption, pre, span, text)
import Html.Attributes as Attr
import Html.Events as Ev
import Syntax


{-| A code block that behaves like a file listing: filename left, language
right, copy affordance, line numbers in the gutter, tokens colored by the
site's restrained palette. The `id` is echoed back through the copy port so
the host page can flash the button state.
-}
view :
    { index : Int
    , lang : Maybe String
    , filename : Maybe String
    , body : String
    , onCopy : { id : String, text : String } -> msg
    }
    -> Html msg
view { index, lang, filename, body, onCopy } =
    let
        cbId =
            "cb-" ++ String.fromInt index

        lines =
            Syntax.toLines (Syntax.highlight lang body)
    in
    figure [ Attr.class "cb" ]
        [ figcaption [ Attr.class "cb-head" ]
            [ span [ Attr.class "cb-file" ]
                [ text (Maybe.withDefault "" filename) ]
            , span [ Attr.class "cb-tools" ]
                [ span [ Attr.class "cb-lang" ] [ text (Maybe.withDefault "text" lang) ]
                , button
                    [ Attr.class "cb-copy"
                    , Attr.type_ "button"
                    , Attr.attribute "data-cb-id" cbId
                    , Attr.title "copy to clipboard"
                    , Attr.attribute "aria-label" ("copy code" ++ suffix filename)
                    , Ev.onClick (onCopy { id = cbId, text = body })
                    ]
                    [ text "copy" ]
                ]
            ]
        , pre [ Attr.class "cb-pre", Attr.tabindex 0 ]
            [ code [ Attr.class "cb-code" ] (List.map lineView lines) ]
        ]


suffix : Maybe String -> String
suffix filename =
    case filename of
        Just f ->
            " (" ++ f ++ ")"

        Nothing ->
            ""


lineView : Syntax.Line -> Html msg
lineView spans =
    Html.node "span" [ Attr.class "cb-ln" ]
        [ Html.node "span" [ Attr.class "cb-no", Attr.attribute "aria-hidden" "true" ] []
        , span [ Attr.class "cb-tx" ] (pieceViews spans)
        ]


pieceViews : Syntax.Line -> List (Html msg)
pieceViews spans =
    let
        meaningful =
            List.filter (\( _, s ) -> s /= "") spans
    in
    if List.isEmpty meaningful then
        [ text "\u{00A0}" ]

    else
        List.map pieceView meaningful


pieceView : ( Syntax.Kind, String ) -> Html msg
pieceView ( kind, txt ) =
    case kindClass kind of
        "" ->
            text txt

        cls ->
            span [ Attr.class cls ] [ text txt ]


kindClass : Syntax.Kind -> String
kindClass kind =
    case kind of
        Syntax.Plain ->
            ""

        Syntax.Comment ->
            "tk-cm"

        Syntax.Str ->
            "tk-st"

        Syntax.Num ->
            "tk-nu"

        Syntax.Kw ->
            "tk-kw"

        Syntax.Ty ->
            "tk-ty"

        Syntax.Fn ->
            "tk-fn"

        Syntax.Deco ->
            "tk-de"
