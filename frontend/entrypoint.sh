#!/bin/bash
set -e

if [ ! -e "/frontend/package.json" ]; then
  echo 'nextjsを新規インストール'
  rm -rf neumann-client/.gitkeep
  npm init -y
  npm install create-next-app
  npx create-next-app@latest neumann-client --ts --tailwind \
    --no-eslint --app --src-dir --import-alias '@/*'
  rm -rf neumann-client/.gitignore
  cd neumann-client
fi

if [ ! -d "/frontend/neumann-client/node_modules" ]; then
  echo 'neumann-clientの環境構築'
  cd neumann-client
  npm install
fi

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"