#!/usr/bin/env bash
# Copies the Tayal prototype into public/tayal so the existing GitHub Pages
# build serves it at /flat-bb/tayal/ (additive: the main app is untouched).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf public/tayal/img
mkdir -p public/tayal/img
cp prototype/img/*.webp public/tayal/img/
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  printf '<style>body{margin:0}[hidden]{display:none!important}</style>\n'
  cat prototype/tayal-booking.html
  printf '\n</html>\n'
} > public/tayal/index.html
echo "exported to public/tayal/"
