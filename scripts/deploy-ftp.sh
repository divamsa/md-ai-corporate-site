#!/bin/bash
# ============================================================
# deploy-ftp.sh — XServer に FTP でサイトを一括アップロード
#
# 【使い方】
#   1. このスクリプトと同じ階層に .env.local を作成
#      FTP_HOST=sv****.xserver.jp
#      FTP_USER=アカウント名
#      FTP_PASS=FTPパスワード
#      FTP_DIR=.   （ログイン直下が public_html の場合。デプロイ開始時に FTP で cd してから mirror）
#
#   2. lftp がインストールされていること
#      Mac:   brew install lftp
#      Linux: sudo apt install lftp
#
#   3. 実行
#      bash scripts/deploy-ftp.sh
# ============================================================

set -euo pipefail

# ── .env.local 読み込み ──
ENV_FILE="$(dirname "$0")/../.env.local"
if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

# ── 必須変数チェック ──
: "${FTP_HOST:?FTP_HOST が未設定です。.env.local を確認してください}"
: "${FTP_USER:?FTP_USER が未設定です。.env.local を確認してください}"
: "${FTP_PASS:?FTP_PASS が未設定です。.env.local を確認してください}"
: "${FTP_DIR:?FTP_DIR が未設定です。.env.local を確認してください}"

SITE_DIR="$(dirname "$0")/.."

echo "🚀 FTP アップロード開始"
echo "   host : $FTP_HOST"
echo "   user : $FTP_USER"
echo "   dir  : $FTP_DIR"
echo ""

lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" << LFTP_CMDS
set ftp:ssl-allow yes
set ssl:verify-certificate no
set net:timeout 30
set net:max-retries 3

cd $FTP_DIR
# 過去に誤ってアップロードされた開発用フォルダをサーバーから削除（無い場合でも続行）
rm -r -f .git
rm -r -f .claude

# ─ アップロード（差分のみ／以下は最低限サーバーへ載せない）
#   .git  .claude  .env  .env.local  .env.*  .DS_Store  node_modules  scripts
# 注: ディレクトリは --exclude（正規表現）で根から除外。（--exclude-glob だけでは漏れることがある）
#     ファイル類は名前パターンを正規表現でどの階層でも除外。
mirror --reverse \
       --parallel=5 \
       --delete \
       --verbose \
       --exclude '^\.git(/|$)' \
       --exclude '^\.claude(/|$)' \
       --exclude '^node_modules(/|$)' \
       --exclude '^scripts(/|$)' \
       --exclude '(^|/)\.env$' \
       --exclude '(^|/)\.env\.' \
       --exclude '(^|/)\.DS_Store$' \
       --exclude-glob .git \
       --exclude-glob .claude \
       --exclude-glob .env \
       --exclude-glob .env.local \
       --exclude-glob '.env.*' \
       --exclude-glob .DS_Store \
       --exclude-glob scripts/ \
       --exclude-glob node_modules/ \
       --exclude-glob .gitignore \
       --exclude-glob README.md \
       "$SITE_DIR/" \
       .

bye
LFTP_CMDS

echo ""
echo "✅ アップロード完了！"
echo "   https://aimoneydesign.com/ を確認してください"
