module Router exposing (Route(..), crumb, href, parse, title)

import Content.Posts as Posts
import Url exposing (Url)


type Route
    = Home
    | Writing
    | Post String
    | Projects
    | Research
    | About
    | NotFound String


parse : Url -> Route
parse url =
    parseFragment url.fragment


parseFragment : Maybe String -> Route
parseFragment fragment =
    let
        raw =
            case fragment of
                Just f ->
                    if String.startsWith "/" f then
                        f

                    else
                        "/" ++ f

                Nothing ->
                    "/"

        parts =
            String.split "?" raw |> List.head |> Maybe.withDefault raw
    in
    case String.split "/" parts |> List.filter (\p -> p /= "") of
        [] ->
            Home

        [ "writing" ] ->
            Writing

        [ "writing", slug ] ->
            if List.any (\p -> p.slug == slug) Posts.posts then
                Post slug

            else
                NotFound ("/writing/" ++ slug)

        [ "projects" ] ->
            Projects

        [ "research" ] ->
            Research

        [ "about" ] ->
            About

        [ "home" ] ->
            Home

        _ ->
            NotFound raw


href : Route -> String
href route =
    case route of
        Home ->
            "#/"

        Writing ->
            "#/writing"

        Post slug ->
            "#/writing/" ++ slug

        Projects ->
            "#/projects"

        Research ->
            "#/research"

        About ->
            "#/about"

        NotFound _ ->
            "#/404"


title : Route -> String
title route =
    case route of
        Home ->
            "VIXEL — machines, systems, ideas"

        Writing ->
            "Field Notes — VIXEL"

        Post slug ->
            case List.filter (\p -> p.slug == slug) Posts.posts |> List.head of
                Just post ->
                    post.title ++ " — VIXEL"

                Nothing ->
                    "Not found — VIXEL"

        Projects ->
            "Projects — VIXEL"

        Research ->
            "Research — VIXEL"

        About ->
            "About — VIXEL"

        NotFound _ ->
            "404 — VIXEL"


crumb : Route -> String
crumb route =
    case route of
        Home ->
          "~/index"

        Writing ->
            "~/writing"

        Post slug ->
            "~/writing/" ++ slug

        Projects ->
            "~/projects"

        Research ->
            "~/research"

        About ->
            "~/about"

        NotFound path ->
            path
