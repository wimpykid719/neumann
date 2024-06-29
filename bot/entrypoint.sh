#!/bin/bash
set -e

if [ ! -e "/bot/package.json" ]; then
  echo 'npm初期化'
  npm init -y
fi

if [ ! -d "/bot/node_modules" ]; then
  echo 'npmインストール実行'
  npm install
fi

exec "$@"