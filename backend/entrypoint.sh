#!/bin/bash
set -e

# 本番環境以外で実行された場合はテストDBを作成
if [ "$RAILS_ENV" != "production" ]; then
  echo '開発環境用のGemをインストール'
  bundle install

  echo 'RSpec用のテストDBを作成'
  bundle exec rails db:create RAILS_ENV=test

else
  echo '本番環境用のGemをインストール'
  bundle install --without development test
fi

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