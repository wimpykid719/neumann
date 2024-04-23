#!/bin/bash
set -e

echo 'bundle install 実行'
bundle install
echo 'db create 実行'
bundle exec rails db:create RAILS_ENV=test
echo 'db マイグレーション 実行'
bundle exec rails db:migrate

echo 'フォルダ構成'
echo "$(ls)"

# Remove a potentially pre-existing server.pid for Rails.
rm -f /backend/tmp/pids/server.pid

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"