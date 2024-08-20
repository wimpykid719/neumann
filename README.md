
## BizRank

本と人をつなぐサービスを作ろうと思い、BizRankを開発しました。
ビジネスについて影響力ある人が薦める、おすすめの一冊を
独自アルゴリズムで評価して紹介するサービスです。

![BizRank - モック](https://github.com/user-attachments/assets/3b8decdd-942d-49ee-a1b7-92a8a0ab3110)


## 機能

 - ランキング生成: 独自アルゴリズムによる書籍の評価とランキング表示
 - ユーザー認証: Google認証を用いたログイン機能
 - インタラクション: 書籍へのいいね機能
 - プロフィール管理: ユーザープロフィールの作成と編集
 - SNS連携: Twitter（X）でのコメント投稿機能
 - レスポンシブデザイン: モバイルからデスクトップまで対応
 - ダークモード対応

## 技術スタック

![構成図](https://github.com/user-attachments/assets/14c146db-fa7b-4f16-a0fd-fd2cc9506bbd)

 - フロントエンド
   - Next.js
     - biome（リンター・フォーマッター）
     - Jest（テスト）
 - バックエンド
   - Ruby on Rails
     - jwt（認証）
     - rubocop（リンター）
     - RSpec（テスト）
 - プロキシーサーバー
    - TypeScript
        - biome
 - データベース
    - MySQL（RDB）
    - Firestore（NoSQL）
 - 書籍データ取得基盤
   - Node.js
      - Puppeteer (ウェブスクレイピング)
      - biome
      - Jest
- その他
  - Docker
  - GitHub Actions（CI/CD）
  - Cloud Run（デプロイメント）
  - Cloudflare R2（ストレージ）
  - Cloudflare Workers（プロキシーサーバー・Cron）
  - Cloudflare CDN

## 環境構築

**前提条件**

Dockerがインストールされていること

dockerを使ってローカルで起動させる。
リポジトリを好きなフォルダにcloneする。

```zsh
git clone https://github.com/wimpykid719/neumann.git
```

コンテナ起動前、下記のコマンドを実行する。
2つのコンテナ群で使用する共有のネットワークを作成する。

```zsh
docker network create interconnect
```

2つのコンテナ群で共通のネットワークを作成してそこにコンテナを入れる。
バックエンド、フロントエンドコンテナのサーバ側で双方向のhttp通信を行う事ができるようになる。

### 環境変数

`.env.example` ファイルを `.env` にコピーし、必要な変数を設定してください。

### バックエンド

**用意するもの**

 - `master.key` ファイルを `backend/config` ディレクトリに配置
 - 新しい `credentials.yml.enc` を作成し、secret_key_baseを設定

コンテナの起動

```zsh
# 初回起動時のコマンド
docker compose -f docker-compose.backend.yml -p backend up --build
```

[localhost:8080](http://localhost:8080) にアクセスすればrailsにアクセス出来る。



### フロントエンド

下記のコマンドを実行すると [localhost:3000](http://localhost:3000) でNext.jsに接続出来るようになる。

```zsh
# 初回起動時
docker compose -f docker-compose.frontend.yml -p frontend up --build
```

### リバースプロキシー

`PROXY_MODE=true` にして
下記のコマンドを実行すると [localhost:3100](http://localhost:3100) でNext.jsに接続出来るようになる。

```zsh
# 初回起動時
docker compose -f docker-compose.proxy.yml -p proxy up --build
```


### 書籍データ取得基盤
BizRankではNoteAPIからビジネス書籍に関連する記事を取得して、影響力ある人が薦める、おすすめの一冊を収集・評価しています。
そして収集したデータはFirestoreに保存されるようになっています。

```zsh
# 初回起動時のコマンド
docker compose -f docker-compose.bot.yml -p bot up --build
```
媒体取得基盤はコンテナ内に入って操作をします。

```zsh
docker exec -it bot /bin/bash

# データ収集が始まります
npm run start

# Jestが実行されます
npm run test
```

## 開発ツール設定

開発を行う際の便利な設定

### バックエンド

```zsh
# ビルド後こちらで起動する
docker compose -f docker-compose.backend.yml -p backend up

# コンテナに入る際は
docker exec -it backend-rails-api /bin/bash

# そこからDBにアクセスする
# ここからSQL構文で自由にデータ操作出来る
rails dbconsole

# 書籍追加時のレイアウト確認行いたい場合、下記のコマンドを実行するとテストデータを追加する
bundle exec rails r scripts/amount_of_book.rb

# コンテナの削除
docker compose -f docker-compose.backend.yml -p backend down
```

**rubocopの設定**

コンテナ内にインストールされたrubocopを使用する用の設定を読み込ませます。
※ローカル環境は汚したくないので、コンテナ内で完結するようにしています。
下記のコマンドを実行

```zsh
cp pre-commit.sh .git/hooks/pre-commit
```

これでコミット時にコンテナ内のrubocopを使って変更予定のファイルを解析します。

**RSpecの設定**

BizRankでは開発時に[vscode-run-rspec-file](https://marketplace.visualstudio.com/items?itemName=Thadeu.vscode-run-rspec-file)という拡張機能を使ってエディターからコンテナ内のRSpecを実行して開発を進めています。

下記の設定をするとRSpecファイルの好きな行で `cmd + ctr + l` を入力する事で素早くRSpecを実行して動作確認を行う事ができます。

```json:settings.json
"vscode-run-rspec-file.custom-command": "docker exec -it backend-rails-api bundle exec rspec",
"vscode-run-rspec-file.folder": "backend/spec",
```

### フロントエンド

```zsh
# ビルド後こちらで起動する
docker compose -f docker-compose.frontend.yml -p frontend up

# コンテナに入る際は
docker exec -it frontend-nextjs /bin/bash

# コンテナの削除
docker compose -f docker-compose.frontend.yml -p frontend down
```

**biomeの設定**

コンテナ内にインストールされたbiomeを使用する設定をします。
※ローカル環境は汚したくないので、コンテナ内で完結するようにしています。

この設定はVSCode, Cursorのみでしか設定出来ないものになります。
[Run on Save](https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave) という拡張機能をインストールします。
その後、下記の設定を行います。

```json:settings.json
"emeraldwalk.runonsave": {
  "commands": [
      {
        "match": "frontend/.*\\.(js|jsx|ts|tsx|json)$",
        "cmd": "echo '${relativeFile}' | sed -e 's:frontend/::; s/(/\\\\(/g; s/)/\\\\)/g;' | xargs -0 -I{} sh -c 'docker compose -f docker-compose.frontend.yml -p frontend exec -T frontend npx @biomejs/biome check --apply {}'"
      }
  ]
}
```

これでコード保存時に整形を行います。

### リバースプロキシー

```zsh
# ビルド後こちらで起動する
docker compose -f docker-compose.proxy.yml -p proxy up

# コンテナに入る際は
docker exec -it proxy /bin/bash

# コンテナの削除
docker compose -f docker-compose.proxy.yml -p proxy down
```

**biomeの設定**

コンテナ内にインストールされたbiomeを使用する設定をします。
※ローカル環境は汚したくないので、コンテナ内で完結するようにしています。

この設定はVSCode, Cursorのみでしか設定出来ないものになります。
[Run on Save](https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave) という拡張機能をインストールします。
その後、下記の設定を行います。

```json:settings.json
"emeraldwalk.runonsave": {
  "commands": [
        {
          "match": "proxy/.*\\.(js|jsx|ts|tsx|json)$",
          "cmd": "echo '${relativeFile}' | sed -e 's:proxy/::; s/(/\\\\(/g; s/)/\\\\)/g;' | xargs -0 -I{} sh -c 'docker compose -f docker-compose.proxy.yml -p proxy exec -T proxy npx @biomejs/biome check --apply {}'"
        },
  ]
}
```

これでコード保存時に整形を行います。

### 書籍データ取得基盤

**Jest**

ショートカットから実行出来るようにします。
下記の設定が `.vscode/tasks.json` に設定されているのでこちらをショートカットキーで呼び出せるようにします。

```json:.vscode/tasks.json
"tasks": [
  {
    "label": "Run Jest on Current File",
    "type": "shell",
    "command": "docker exec -it bot npx jest ${relativeFile}",
    "problemMatcher": [],
    "group": {
        "kind": "test",
        "isDefault": true
    }
  },
]
```

`cmd + shift + p` で Open Keybord Shortcuts（JSON）を開きます。
下記の設定を追加

```json:keybindings.json
{
    "key": "cmd+j",
    "command": "workbench.action.tasks.runTask",
    "args": "Run Jest on Current File"
}
```

これで任意のjestファイルで `cmd + j` を実行するとそのファイルに書かれたテストが実行されます。
※RSpecみたいに1箇所ずつの指定は出来ないです。

**biomeの設定**

コンテナ内にインストールされたbiomeを使用する設定をします。
※ローカル環境は汚したくないので、コンテナ内で完結するようにしています。

この設定はVSCode, Cursorのみでしか設定出来ないものになります。
[Run on Save](https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave) という拡張機能をインストールします。
その後、下記の設定を行います。

```json:settings.json
"emeraldwalk.runonsave": {
  "commands": [
      {
        "match": "bot/.*\\.(js|jsx|ts|tsx|json)$",
        "cmd": "echo '${relativeFile}' | sed -e 's:bot/::; s/(/\\\\(/g; s/)/\\\\)/g;' | xargs -0 -I{} sh -c 'docker compose -f docker-compose.bot.yml -p bot exec -T bot npx @biomejs/biome check --apply {}'"
      },
  ]
}
```

## 結合テスト

[実施内容 - スプレッドシート](https://docs.google.com/spreadsheets/d/1NNmBQheygvedELX9dXe8L_FCsSsIPmWdRzR_7lVsv50/edit?usp=sharing)

## UI設計

[BizRank UI](https://www.figma.com/design/UGugSfQCkplaBzaCzS6MC7/BizRank-UI?t=raAITMBgXsV28qXH-1)