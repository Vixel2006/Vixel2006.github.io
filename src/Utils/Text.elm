module Utils.Text exposing (readMinutes, totalWords)


{-| Reading time at ~220 wpm, minimum one minute.
-}
readMinutes : String -> Int
readMinutes body =
    max 1 ((String.words body |> List.length) + 219) // 220


{-| Total word count across bodies — for nerd statistics.
-}
totalWords : List String -> Int
totalWords bodies =
    List.foldl (\b acc -> acc + List.length (String.words b)) 0 bodies
