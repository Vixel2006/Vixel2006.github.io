#!/bin/sh
set -e

echo "building site..."

# build the zig ssg
zig build -Doptimize=ReleaseSafe

# run it
./zig-out/bin/sitegen

echo "done. site/ directory ready."
