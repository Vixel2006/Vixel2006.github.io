#!/bin/sh
# Build everything: posts from markdown → Elm module + RSS/sitemap/robots → optimized elm.js
# Adding a field note = add .md file to posts/, then run this.
set -e
cd "$(dirname "$0")"

echo "→ build posts from markdown"
python3 scripts/build_posts.py

echo "→ elm make (optimized)"
elm make src/Main.elm --optimize --output=elm.js

echo "done."
