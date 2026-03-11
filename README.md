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

Notion データベースから `posts.json` を再生成するスクリプトです。

### 前提

`.env.local` ファイルをプロジェクトルートに作成し、以下を記載：

```
NOTION_TOKEN=secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NOTION_DB_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 実行

```bash
node scripts/fetch-blog.js
# または
npm run fetch-blog
```

実行後、`blog/posts.json` が更新されます。

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
FTP_DIR=/home/XXXXXXXX/ai.moneydesign.co.jp/public_html
```

```bash
bash scripts/deploy-ftp.sh
# または
npm run deploy
```

本番 URL: `https://ai.moneydesign.co.jp`

## 環境変数一覧

| 変数名 | 説明 |
|---|---|
| `NOTION_TOKEN` | Notion Integration Token |
| `NOTION_DB_ID` | ブログ記事 Notion データベース ID |
| `FTP_HOST` | XServer FTP ホスト名 |
| `FTP_USER` | FTP ユーザー名 |
| `FTP_PASS` | FTP パスワード |
| `FTP_DIR` | FTP アップロード先ディレクトリ |
