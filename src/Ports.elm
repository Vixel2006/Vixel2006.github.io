port module Ports exposing (consoleArt, copyCode, scrollToId)


{-| Ask the host page to write text to the clipboard. `id` identifies the
originating widget so the JS side can flash its state.
-}
port copyCode : { id : String, text : String } -> Cmd msg


port scrollToId : String -> Cmd msg


{-| One-way channel into the devtools console. Used exactly once, for the
people who open it.
-}
port consoleArt : String -> Cmd msg
