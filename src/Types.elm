module Types exposing
    ( NowItem
    , Project
    , ResearchEntry
    , Social
    , SpecRow
    , statusClass
    )

{-| Shared domain types. Status is kept as a String in content modules so
adding an entry never requires touching this file; `statusClass` maps it onto
the meaning-coded accent colors: green = stable, amber = experimental,
cyan = research, gray = dormant.
-}


type alias Social =
    { label : String
    , url : String
    }


type alias NowItem =
    { topic : String
    , detail : String
    }


type alias SpecRow =
    { key : String
    , value : String
    }


type alias Project =
    { id : String
    , name : String
    , tagline : String
    , domain : String
    , lang : String
    , status : String
    , period : String
    , url : String
    , urlLabel : String
    , why : String
    , engineering : List String
    , stack : List String
    }


type alias ResearchEntry =
    { id : String
    , kind : String
    , title : String
    , abstract : String
    , status : String
    , links : List ( String, String )
    , notes : List String
    , related : List ( String, String )
    }


statusClass : String -> String
statusClass s =
    case s of
        "active" ->
            "ok"

        "production" ->
            "ok"

        "stable" ->
            "ok"

        "complete" ->
            "ok"

        "experimental" ->
            "warn"

        "building" ->
            "warn"

        "redesigning" ->
            "warn"

        "drafting" ->
            "warn"

        "unfinished" ->
            "warn"

        "research" ->
            "info"

        "preprint" ->
            "info"

        "exploring" ->
            "info"

        "researching" ->
            "info"

        "ongoing" ->
            "info"

        _ ->
            "dim"
