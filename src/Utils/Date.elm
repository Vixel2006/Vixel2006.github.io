module Utils.Date exposing (display, iso, year)


{-| Post slugs start with ISO dates: "2026-07-21-slug".
-}
iso : String -> String
iso slug =
    String.left 10 slug


{-| "2026.07.21" — the house style for showing dates.
-}
display : String -> String
display slug =
    String.replace "-" "." (iso slug)


year : String -> String
year slug =
    String.left 4 slug
