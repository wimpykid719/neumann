#!/bin/bash
set -e

bundle install
bundle exec rails db:create RAILS_ENV=test
bundle exec rails db:migrate

if [ ! -e "/backend/config/routes.rb" ]; then
  echo 'rails new APIモード を実行する'
  # --skip入れないとpgのgemないってエラーが出る
  rails new . --force --api --database=mysql --skip-git --skip-bundle
  bundle install
fi

# Remove a potentially pre-existing server.pid for Rails.
rm -f /backend/tmp/pids/server.pid

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"