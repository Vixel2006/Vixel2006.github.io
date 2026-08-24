module Main exposing (main)

import Browser
import Browser.Dom
import Browser.Events
import Browser.Navigation as Nav
import Components.Chrome as Chrome
import Components.Palette as Palette
import Html exposing (Html, div, p, text)
import Html.Attributes as Attr
import Html.Keyed
import Json.Decode as Json
import Markdown
import Pages.About
import Pages.Home
import Pages.NotFound
import Pages.Post
import Pages.Projects
import Pages.Writing
import Ports
import Router exposing (Route(..))
import Task
import Time
import Url


konami : List String
konami =
    [ "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a" ]



-- MODEL ---------------------------------------------------------------------


type alias Model =
    { key : Nav.Key
    , route : Route
    , requestedPath : String
    , paletteOpen : Bool
    , query : String
    , selected : Int
    , pendingG : Bool
    , konamiIdx : Int
    , crt : Bool
    , now : Time.Posix
    }


type Msg
    = NoOp
    | UrlRequest Browser.UrlRequest
    | UrlChange Url.Url
    | Tick Time.Posix
    | GlobalKey KeyInfo
    | PaletteToggle
    | PaletteInput String
    | PaletteKey String
    | PalettePick Int
    | PaletteHover Int
    | PaletteSwallow
    | OverlayClick
    | CopyCode { id : String, text : String }
    | ScrollToId String


type alias KeyInfo =
    { key : String
    , ctrl : Bool
    , meta : Bool
    , inField : Bool
    }



-- INIT ----------------------------------------------------------------------


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    let
        route =
            Router.parse url
    in
    ( { key = key
      , route = route
      , requestedPath = requestedPathOf url route
      , paletteOpen = False
      , query = ""
      , selected = 0
      , pendingG = False
      , konamiIdx = 0
      , crt = False
      , now = Time.millisToPosix 0
      }
    , Cmd.none
    )


requestedPathOf : Url.Url -> Route -> String
requestedPathOf url route =
    case route of
        NotFound path ->
            if String.startsWith "/" path then
                path

            else
                "/" ++ path

        _ ->
            "/" ++ Maybe.withDefault "" url.fragment


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        , onUrlRequest = UrlRequest
        , onUrlChange = UrlChange
        }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onKeyDown (Json.map GlobalKey keyDecoder)
        , Time.every 30000 Tick
        ]


keyDecoder : Json.Decoder KeyInfo
keyDecoder =
    Json.map4 KeyInfo
        (Json.field "key" Json.string)
        (Json.field "ctrlKey" Json.bool)
        (Json.field "metaKey" Json.bool)
        (Json.oneOf
            [ Json.at [ "target", "tagName" ] Json.string
                |> Json.map (\tag -> tag == "INPUT" || tag == "TEXTAREA")
            , Json.succeed False
            ]
        )



-- UPDATE --------------------------------------------------------------------


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UrlRequest request ->
            case request of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChange url ->
            let
                route =
                    Router.parse url
            in
            ( { model
                | route = route
                , requestedPath = requestedPathOf url route
                , paletteOpen = False
                , pendingG = False
              }
            , Task.attempt (always NoOp) (Browser.Dom.setViewport 0 0)
            )

        Tick posix ->
            ( { model | now = posix }, Cmd.none )

        GlobalKey info ->
            globalKey info model

        PaletteToggle ->
            togglePalette model

        PaletteInput q ->
            ( { model | query = q, selected = 0 }, Cmd.none )

        PaletteKey key ->
            paletteKey key model

        PalettePick i ->
            case List.drop i (Palette.filterSuggestions model.query) |> List.head of
                Just s ->
                    executeTarget s.target model

                Nothing ->
                    ( model, Cmd.none )

        PaletteHover i ->
            ( { model | selected = i }, Cmd.none )

        PaletteSwallow ->
            ( model, Cmd.none )

        OverlayClick ->
            ( { model | paletteOpen = False }, Cmd.none )

        CopyCode payload ->
            ( model, Ports.copyCode payload )

        ScrollToId id ->
            ( model, Ports.scrollToId id )


togglePalette : Model -> ( Model, Cmd Msg )
togglePalette model =
    if model.paletteOpen then
        ( { model | paletteOpen = False }, Cmd.none )

    else
        ( { model | paletteOpen = True, query = "", selected = 0 }
        , Task.attempt (always NoOp) (Browser.Dom.focus "palette-input")
        )


globalKey : KeyInfo -> Model -> ( Model, Cmd Msg )
globalKey info model =
    if (info.ctrl || info.meta) && (info.key == "k" || info.key == "K") then
        togglePalette model

    else if info.key == "Escape" then
        if model.paletteOpen || model.pendingG then
            ( { model | paletteOpen = False, pendingG = False }, Cmd.none )

        else
            ( model, Cmd.none )

    else if model.paletteOpen || info.inField || info.ctrl || info.meta then
        ( model, Cmd.none )

    else if model.pendingG then
        case chordRoute info.key of
            Just route ->
                ( { model | pendingG = False }
                , Nav.pushUrl model.key (Router.href route)
                )

            Nothing ->
                ( { model | pendingG = False }, Cmd.none )

    else
        case info.key of
            "/" ->
                togglePalette model

            "g" ->
                ( { model | pendingG = True }, Cmd.none )

            _ ->
                konamiStep info.key model


chordRoute : String -> Maybe Route
chordRoute key =
    case key of
        "h" ->
            Just Home

        "w" ->
            Just Writing

        "p" ->
            Just Projects

        "r" ->
            Just Research

        "a" ->
            Just About

        _ ->
            Nothing


{-| The famous sequence. What it does is between me and the view layer.
-}
konamiStep : String -> Model -> ( Model, Cmd Msg )
konamiStep key model =
    let
        expected =
            List.drop model.konamiIdx konami |> List.head

        nextIdx =
            if expected == Just key then
                model.konamiIdx + 1

            else if Just key == List.head konami then
                1

            else
                0
    in
    if nextIdx == List.length konami then
        ( { model | konamiIdx = 0, crt = not model.crt }
        , Ports.consoleArt
            (String.join "\n"
                [ "┌─────────────────────────────────────────┐"
                , "│ 10 PRINT \"VIXEL\"                        │"
                , "│ 20 GOTO 10                              │"
                , "│ RUN                                     │"
                , "└── phosphor mode engaged ────────────────┘"
                ]
            )
        )

    else
        ( { model | konamiIdx = nextIdx }, Cmd.none )


paletteKey : String -> Model -> ( Model, Cmd Msg )
paletteKey key model =
    let
        list =
            Palette.filterSuggestions model.query

        count =
            List.length list

        cur =
            model.selected
    in
    case key of
        "ArrowDown" ->
            ( { model | selected = min (count - 1) (cur + 1) }, Cmd.none )

        "ArrowUp" ->
            ( { model | selected = max 0 (cur - 1) }, Cmd.none )

        "Enter" ->
            case List.drop cur list |> List.head of
                Just s ->
                    executeTarget s.target model

                Nothing ->
                    ( model, Cmd.none )

        _ ->
            ( model, Cmd.none )


executeTarget : Palette.Target -> Model -> ( Model, Cmd Msg )
executeTarget target model =
    let
        closed =
            { model | paletteOpen = False, query = "", selected = 0, pendingG = False }
    in
    case target of
        Palette.GoTo route ->
            ( closed, Nav.pushUrl model.key (Router.href route) )

        Palette.External url ->
            ( closed, Nav.load url )



-- VIEW ----------------------------------------------------------------------


view : Model -> Browser.Document Msg
view model =
    { title = Router.title model.route
    , body =
        [ div
            [ Attr.class "app"
            , Attr.classList [ ( "app--crt", model.crt ) ]
            ]
            [ skipLink
            , Chrome.masthead
                { route = model.route
                , now = model.now
                , onSearch = PaletteToggle
                }
            , Html.main_
                [ Attr.class "site-main"
                , Attr.id "content"
                ]
                [ Html.Keyed.node "div" [ Attr.class "page-swap" ]
                    [ ( routeKey model.route, pageView model ) ]
                ]
            , Chrome.footerView
            , if model.paletteOpen then
                paletteView model

              else
                text ""
            ]
        ]
    }


routeKey : Route -> String
routeKey route =
    case route of
        Post slug ->
            "post:" ++ slug

        NotFound path ->
            "404:" ++ path

        other ->
            Router.href other


skipLink : Html Msg
skipLink =
    Html.a [ Attr.class "skip-link", Attr.href "#content" ] [ text "skip to content" ]


pageView : Model -> Html Msg
pageView model =
    case model.route of
        Home ->
            Pages.Home.view ()

        Writing ->
            Pages.Writing.view ()

        Post slug ->
            Pages.Post.view
                { copyCode = CopyCode
                , tocClick = ScrollToId
                }
                slug

        Projects ->
            Pages.Projects.projectsView ()

        Research ->
            Pages.Projects.researchView ()

        About ->
            aboutPage

        NotFound _ ->
            Pages.NotFound.view model.requestedPath


aboutPage : Html Msg
aboutPage =
    Html.section [ Attr.class "wrap page doc doc--page" ]
        [ p [ Attr.class "crumb" ] [ text "~/about" ]
        , Html.h1 [ Attr.class "page-title" ] [ text "ABOUT THE OPERATOR" ]
        , div [ Attr.class "md doc-body doc-body--wide" ]
            [ Markdown.render { copyCode = CopyCode } Pages.About.about ]
        ]


paletteView : Model -> Html Msg
paletteView model =
    Palette.view
        { query = model.query
        , selected = model.selected
        , results = Palette.filterSuggestions model.query
        , onInput = PaletteInput
        , onKey = PaletteKey
        , onPick = PalettePick
        , onHover = PaletteHover
        , onDismiss = OverlayClick
        , onSwallow = PaletteSwallow
        }
