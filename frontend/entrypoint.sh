#!/bin/bash
set -e

if [ ! -e "/frontend/package.json" ]; then
  echo 'nextjsを新規インストール'
  npm init -y
  npm install create-next-app
  npx create-next-app@latest neumann-client --use-npm --typescript
  rm -rf neumann-client/.gitignore
fi

if [ ! -d "/frontend/neumann-client/node_modules" ]; then
  echo 'neumann-clientの環境構築'
  npm install
fi

cd neumann-client

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"