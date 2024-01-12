#!/bin/sh

# ファイルパスの取得
file_paths=$(git diff --cached --name-only --diff-filter=AM | grep '\.rb$' | cut -d'/' -f2-)

# ファイルが存在するかチェック
if [ -n "$file_paths" ]; then
  echo '---Rubocopで警告がないかチェック---'
  echo "$file_paths" | xargs docker compose -f docker-compose.backend.yml -p backend exec -T backend rubocop --force-exclusion --display-only-fail-level-offenses
fi