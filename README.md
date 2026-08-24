# VIXEL — field notes

Personal static site of [Vixel](https://github.com/Vixel2006):
robotics middleware, deep learning runtimes, world models, embedded
electronics — built in **Elm 0.19**, no other frontend framework.

## Build

```sh
./build.sh        # elm make --optimize + rss.xml + sitemap.xml + robots.txt
```

Requires `elm` (0.19.2) and `python3`. Output artifacts: `elm.js`,
`rss.xml`, `sitemap.xml`, `robots.txt` — everything else is static and
committed. Deploy by pushing; GitHub Pages serves the folder as-is
(hash routing means no server rewrites are needed).

Preview locally: `python3 -m http.server` then open `http://localhost:8000`.

## Architecture

```
src/
  Main.elm            wiring only: model, update, routing glue, easter eggs
  Router.elm          route type, parsing, document titles, crumbs
  Types.elm           shared domain types + status → color semantics
  Ports.elm           clipboard, scroll-into-view, console channel
  Markdown.elm        small markdown subset tuned for technical notes
  Components/
    Chrome.elm        masthead + colophon
    Palette.elm       "/" search (grep-style command palette)
    CodeBlock.elm     file-listing code blocks with copy button
    Ui.elm            section heads, status LEDs, spec tables
  Content/
    Posts.elm         THE notebook — add posts here
    Projects.elm      project dossiers + research threads + ascii diagrams
    Site.elm          identity, now-feed, spec rows, channels
  Pages/
    Home.elm          the index: hero, current work, field notes, status/now
    Writing.elm       full field-note index
    Post.elm          document layout: band, meta table, toc, neighbours
    Projects.elm      project + research pages
    About.elm         about document (markdown)
    NotFound.elm      404 terminal session
styles/site.css       design system: tokens → components → responsive → print
scripts/gen_meta.py   harvests post metadata from Content/Posts.elm for RSS/sitemap
```

## Adding a field note

1. Open `src/Content/Posts.elm`.
2. Add a body constant at the bottom (`name : String`, triple-quoted).
3. Prepend a record to the `posts` list (newest first). Keep the record
   layout exactly as formatted — `scripts/gen_meta.py` parses it to build
   `rss.xml` / `sitemap.xml`.
4. Slug must start with the ISO date: `2026-08-24-my-note`.
5. Run `./build.sh`.

Markdown subset: headings (`#`–`###`), paragraphs, `**bold**`, `*em*`,
`` `code` ``, `[links](url)`, fenced code blocks with an optional filename
token (```zig src/main.zig), pipe tables, images on their own line,
ordered/unordered lists, block quotes, `NOTE:` / `WARNING:` asides,
`---` rules.

Code fences are syntax-highlighted by a small pure-Elm tokenizer
(`src/Syntax.elm`) — zig, c/cpp/cuda, go, rust, python, elm, js/ts, shell,
json, yaml/toml, plus a generic fallback. Unlabeled fences get the generic
treatment. Token colors are Catppuccin Mocha, restrained on purpose.

## Easter eggs

- `/` — search · `Ctrl/Cmd-K` also works
- `g` then `h/w/p/r/a` — jump to page
- the famous konami sequence — try it
- the cat is real
