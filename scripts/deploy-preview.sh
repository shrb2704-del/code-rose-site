#!/usr/bin/env bash
# Собирает сайт для предпросмотра на GitHub Pages и выкладывает его в ветку gh-pages.
# Адрес: https://shrb2704-del.github.io/code-rose-site/
set -euo pipefail
cd "$(dirname "$0")/.."
REPO=https://github.com/shrb2704-del/code-rose-site.git
export MSYS_NO_PATHCONV=1
BASE_PATH=/code-rose-site SITE_URL=https://shrb2704-del.github.io PUBLIC_NOINDEX=1 npm run build
cd dist
touch .nojekyll
rm -rf .git
git init -q -b gh-pages
git config user.name "Code&Rose"
git config user.email "shrb2704@gmail.com"
git add -A
git commit -q -m "Предпросмотр сайта"
git push -q -f "$REPO" gh-pages
rm -rf .git
echo "Готово: https://shrb2704-del.github.io/code-rose-site/"
