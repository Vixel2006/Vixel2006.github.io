#!/bin/sh
# Build everything: optimized elm.js + rss/sitemap/robots.
# Adding a field note = edit src/Content/Posts.elm, then run this.
set -e
cd "$(dirname "$0")"

echo "→ elm make (optimized)"
elm make src/Main.elm --optimize --output=elm.js

echo "→ static metadata"
python3 scripts/gen_meta.py

echo "done."
