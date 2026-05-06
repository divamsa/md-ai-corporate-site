# md-ai-corporate-site

マネーデザイン 生成AI導入支援 コーポレートサイト

## 技術スタック

- 素のHTML / CSS / JavaScript（フレームワークなし）
- Node.js 18+（`scripts/fetch-blog.js` のみ使用）
- Notion API（ブログ記事の管理）
- Web3Forms（お問い合わせフォーム）
- GitHub Pages（ステージング）→ XServer（本番）

## ファイル構成

```
.
├── index.html          # トップページ
├── about.html          # 会社概要
├── services.html       # サービス
├── cases.html          # 導入事例
├── contact.html        # お問い合わせ
├── blog/
│   ├── index.html      # ブログ一覧
│   ├── post.html       # ブログ詳細（?id=SLUG で動的表示）
│   └── posts.json      # ブログ記事データ（fetch-blog.js が生成）
├── css/
│   ├── style.css       # グローバルスタイル
│   └── components.css  # コンポーネントスタイル
├── js/
│   ├── main.js         # ナビゲーション等
│   ├── notion.js       # ブログ一覧レンダリング
│   └── form.js         # お問い合わせフォーム（Web3Forms）
├── images/
│   └── ogp.png         # OGPサムネイル（1200×630）
└── scripts/
    ├── fetch-blog.js   # Notion API → posts.json 生成スクリプト
    └── deploy-ftp.sh   # XServer FTP デプロイスクリプト
```

## ローカル確認

`npm install` は不要。HTMLファイルをブラウザで直接開くか、任意のローカルサーバーで確認できます。

```bash
# Python がある場合
python3 -m http.server 8080

# Node.js がある場合
npx serve .
```

## ブログ記事の更新

今後、記事を順次追加していくときの標準手順です。

### 前提

`.env.local` ファイルをプロジェクトルートに作成し、以下を記載：

```
NOTION_TOKEN=secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NOTION_DB_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 手順（Notion から追加する場合）

1. Notion で記事を公開状態にする（タイトル・カテゴリ・概要を確認）。
2. `node scripts/fetch-blog.js` を実行して `blog/posts.json` を再生成する。
3. `blog/index.html` を開いて、記事カードが増えているか確認する。
4. `blog/post.html?id=<slug>` を開いて、本文表示に問題がないか確認する。
5. 問題なければ FTP デプロイと Git 反映を行う（下の「デプロイ」参照）。

### 実行コマンド

```bash
node scripts/fetch-blog.js
# または
npm run fetch-blog
```

実行後、`blog/posts.json` が更新されます。

### 手順（手動で記事を追加する場合）

1. `blog/` に記事 HTML を作成する（例: `your-article.html`）。
2. `blog/posts.json` に 1 件追加する（`slug` / `title` / `category` / `date` / `excerpt` / `body`）。
3. `body` は次のどちらかにする。
   - 記事本文を直接入れる（HTML文字列）
   - ファイル参照にする（例: `"body": "your-article.html"`）
4. `blog/index.html` と `blog/post.html?id=<slug>` で表示確認する。
5. 問題なければ FTP デプロイと Git 反映を行う。

## デプロイ

### GitHub Pages（ステージング）

`main` ブランチに push すると自動反映されます。

```
https://divamsa.github.io/md-ai-corporate-site/
```

### XServer FTP（本番）

`.env.local` に FTP 認証情報を追加後、スクリプトを実行：

```
FTP_HOST=XXXXXXXX.xsrv.jp
FTP_USER=XXXXXXXX
FTP_PASS=XXXXXXXX
FTP_DIR=.
```

`FTP_DIR=.` は「FTP ログイン直後のフォルダ」を意味します。  
このプロジェクトでは、ログイン直後が公開ディレクトリ（`public_html` 相当）です。

```bash
bash scripts/deploy-ftp.sh
# または
npm run deploy
```

### 公開確認（毎回）

1. `https://aimoneydesign.com/blog/posts.json` を開き、記事件数と追加記事の `slug` を確認。
2. `https://aimoneydesign.com/blog/` を開き、一覧カードが増えているか確認。
3. 追加記事の詳細 URL（`/blog/post.html?id=<slug>` または `/blog/<file>.html`）を開いて確認。

### Git 反映（毎回）

```bash
git add .
git commit -m "Add blog article: <slug>"
git push origin main
```

本番 URL: `https://aimoneydesign.com`

## 自動公開（1日1本ペースで反映したい場合）

GitHub Actions で「毎日1回、Notion → `blog/posts.json` 更新 → XserverへFTPデプロイ」を自動実行できます。

### 仕組み

- ワークフロー: `.github/workflows/daily-publish.yml`
- 動作:
  - `npm run fetch-blog`（Notion から `blog/posts.json` を再生成）
  - `blog/posts.json` に変更があれば自動コミット＆push
  - `npm run deploy`（XserverへFTPデプロイ）

### 事前準備（GitHubのSecrets）

GitHub リポジトリの Settings → Secrets and variables → Actions に、以下を登録します。

- `NOTION_TOKEN`
- `NOTION_DB_ID`
- `FTP_HOST`
- `FTP_USER`
- `FTP_PASS`
- `FTP_DIR`（推奨: `.`）

### 実行タイミング

ワークフローは **毎日 00:15（JST）** に動きます（必要なら `daily-publish.yml` の `cron` を変更）。

## 環境変数一覧

| 変数名 | 説明 |
|---|---|
| `NOTION_TOKEN` | Notion Integration Token |
| `NOTION_DB_ID` | ブログ記事 Notion データベース ID |
| `FTP_HOST` | XServer FTP ホスト名 |
| `FTP_USER` | FTP ユーザー名 |
| `FTP_PASS` | FTP パスワード |
| `FTP_DIR` | FTP アップロード先ディレクトリ |
