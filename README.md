# md-ai-corporate-site

マネーデザイン 生成AI導入支援 コーポレートサイト

## 技術スタック

- 静的HTML / CSS / JavaScript（フレームワークなし）
- GitHub Pages でホスティング
- Notion API 連携（お問い合わせフォーム）

## ディレクトリ構成

```
md-ai-corporate-site/
├── index.html          # トップページ
├── about.html          # 会社情報
├── services.html       # サービス
├── cases.html          # 事例
├── contact.html        # お問い合わせ
├── blog/               # ブログ
├── css/                # スタイルシート
├── js/                 # JavaScript
├── images/             # 画像
└── scripts/            # Node.jsスクリプト
```

## ローカル開発

Node.js 18以上が必要です。

```bash
# 依存パッケージのインストール（serve コマンド用）
npm install
# または
pnpm install
```

```bash
# ローカルサーバー起動（http://localhost:3000）
pnpm dev
```

## デプロイ

このサイトはビルド不要の静的サイトです。HTMLファイルをそのままホスティングします。

```bash
# GitHub Pages / Vercel / Netlify などに直接デプロイ可能
# ビルドコマンドは不要（またはそのまま下記を使用）
pnpm build
```

## 環境変数

お問い合わせフォームのNotion API連携に必要です。

```
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```
