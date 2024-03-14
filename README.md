## 最初に

Next.jsとRailsの組み合わせでサービスを作成して見たかったのでたった2つのコマンドで環境を構築出来るようにしました。

## 環境構築

リポジトリを好きなフォルダにcloneする。

コンテナ起動前下記のコマンドを実行する。
2つのコンテナ群で使用する共有のネットワークを作成する。

```bash
docker network create interconnect
```

2つのコンテナ群で共通のネットワークを作成してそこにコンテナを入れる。
バックエンド、フロントエンドコンテナのサーバ側で双方向のhttp通信を行う事ができるようになる。

### バックエンド

バックエンドのコンテナをビルドして起動するには

```bash
# 初回起動時のコマンド
docker compose -f docker-compose.backend.yml -p backend up --build
```

このコマンド一つでいい感じに環境を作ってサーバを起動してくれる。

あとは `[localhost:8080](http://localhost:8080)` にアクセスすればrailsにアクセス出来る。

ただしデータベースの接続設定をしていないのでエラーページが返る。

後述で設定する。

バックエンドのログとフロントエンドのログを別々で確認したいので、docker-composeファイルを分けて起動している。そのため `-p backend` でプロジェクト名を付けてないとコンテナが混合していると警告が出る。

環境構築後に使用するコマンド群

```yaml
# ビルド後こちらで起動する
docker compose -f docker-compose.backend.yml -p backend up

# コンテナに入る際は
docker exec -it backend-rails-api /bin/bash
# そこからDBにアクセスする
# ここからSQL構文で自由にデータ操作出来る
rails dbconsole

# コンテナの削除
docker compose -f docker-compose.backend.yml -p backend rm
```

データベースの設定

`rails new` によって `config/datebase.yml` が作成されていると思うので下記設定に置き換えるとPostgresqlに接続出来るようになる。再びコンテナを止めて `docker-compose -f docker-compose.backend.yml -p backend up` で起動して  `[localhost:8080](http://localhost:8080)` にアクセスするとrailsのページが今度はエラーなしで返ってくる。所どころ `neumann` と名前が出てくるがこれは個人的にサービス名に使いたい名前なので作りたいサービスに合わせて変更して貰えればと思う。その際は `docker-compose.backend.yml` 等にも記述されているので全てを変更する必要がある。

**config/datebase.yml**

```yaml
# PostgreSQL. Versions 9.3 and up are supported.
#
# Install the pg driver:
#   gem install pg
# On macOS with Homebrew:
#   gem install pg -- --with-pg-config=/usr/local/bin/pg_config
# On macOS with MacPorts:
#   gem install pg -- --with-pg-config=/opt/local/lib/postgresql84/bin/pg_config
# On Windows:
#   gem install pg
#       Choose the win32 build.
#       Install PostgreSQL and put its /bin directory on your path.
#
# Configure Using Gemfile
# gem "pg"
#
default: &default
  adapter: postgresql
  encoding: unicode
  host: db
  username: neumann
  password: password
  # For details on connection pooling, see Rails configuration guide
  # https://guides.rubyonrails.org/configuring.html#database-pooling
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>

development:
  <<: *default
  database: neumann_development

  # The specified database role being used to connect to postgres.
  # To create additional roles in postgres see `$ createuser --help`.
  # When left blank, postgres will use the default role. This is
  # the same name as the operating system user running Rails.
  #username: backend

  # The password associated with the postgres role (username).
  #password:

  # Connect on a TCP socket. Omitted by default since the client uses a
  # domain socket that doesn't need configuration. Windows does not have
  # domain sockets, so uncomment these lines.
  #host: localhost

  # The TCP port the server listens on. Defaults to 5432.
  # If your server runs on a different port number, change accordingly.
  #port: 5432

  # Schema search path. The server defaults to $user,public
  #schema_search_path: myapp,sharedapp,public

  # Minimum log levels, in increasing order:
  #   debug5, debug4, debug3, debug2, debug1,
  #   log, notice, warning, error, fatal, and panic
  # Defaults to warning.
  #min_messages: notice

# Warning: The database defined as "test" will be erased and
# re-generated from your development database when you run "rake".
# Do not set this db to the same as development or production.
test:
  <<: *default
  database: neumann_test

# As with config/credentials.yml, you never want to store sensitive information,
# like your database password, in your source code. If your source code is
# ever seen by anyone, they now have access to your database.
#
# Instead, provide the password or a full connection URL as an environment
# variable when you boot the app. For example:
#
#   DATABASE_URL="postgres://myuser:mypass@localhost/somedatabase"
#
# If the connection URL is provided in the special DATABASE_URL environment
# variable, Rails will automatically merge its configuration values on top of
# the values provided in this file. Alternatively, you can specify a connection
# URL environment variable explicitly:
#
#   production:
#     url: <%= ENV["MY_APP_DATABASE_URL"] %>
#
# Read https://guides.rubyonrails.org/configuring.html#configuring-a-database
# for a full overview on how database connection configuration can be specified.
#
production:
  <<: *default
  database: neumann_production
  username: backend
  password: <%= ENV["BACKEND_DATABASE_PASSWORD"] %>
```

### フロントエンド

Next.jsの環境を作るコンテナ

下記のコマンドを実行すると `[localhost:3000](http://localhost:3000)` でNext.jsに接続出来るようになる。

```bash
# 初回起動時
docker compose -f docker-compose.frontend.yml -p frontend up --build
```

環境構築後に使用するコマンド群

```bash
# ビルド後こちらで起動する
docker compose -f docker-compose.frontend.yml -p frontend up

# コンテナに入る際は
docker exec -it frontend-nextjs /bin/bash

# コンテナの削除
docker compose -f docker-compose.frontend.yml -p frontend rm
```

これで環境構築が出来る。

たった2つのコマンドで環境構築が出来る。一個だけ気になるのが、ctr+cでコンテナを終了する際に `exit 137` でコンテナを終了して正常終了してくれない。調べるとメモリが足りない等の記事が出る。しかし8GBもあげているので別の問題だと思われる。

試しにサーバを起動しない状態でコンテナを起動して `ctr+c` したら正常に終了したので

おそらく rails, next.js等のサーバを起動したままコンテナを終了しているのが原因かと思われる。

会社の開発環境でも `exit 137` で終了していたのでこれは仕方なさそう。解決方法ご存知の方いらしたら教えて下さい。

何がともあれこれでバンバン開発ライフを送れる。

### 参照

[たった2つのコマンドでNext.js、Rails環境を構築できるようにした。](https://zenn.dev/unemployed/articles/nextjs-rails-postgresql-docker)