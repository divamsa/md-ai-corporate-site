/**
 * 資料請求 自動返信スクリプト
 * 株式会社マネーデザイン
 *
 * 機能: 資料請求フォームからの問い合わせメールを検知し、
 *       PDFを自動添付して申込者へ返信する
 *
 * 仕組み: 10分ごとに自動起動 → Gmail検索 → Reply-Toアドレスへ送信
 *         → 「資料請求-送信済み」ラベルを付与（二重送信防止）
 */

// ══════════════════════════════════════════════
//  設定（ここを編集してください）
// ══════════════════════════════════════════════
const CONFIG = {

  // ① Google Drive にアップロードした PDF のファイルID
  //    取得方法: Drive でファイルを右クリック →「共有可能なリンクをコピー」
  //    → URL の /d/ と /view の間にある文字列（例: 1aBcDeFgHiJkLmNoPqRsTuVwXyZ）
  DRIVE_FILE_ID: '1dg2ydg3ieYUAF5_tluUd7Po308k0wa7t',

  // ② 添付ファイル名（相手に届く際のファイル名）
  PDF_FILENAME: 'マネーデザイン_AI導入支援_会社紹介資料.pdf',

  // ③ 処理済みラベル名（Gmailに自動作成される）
  PROCESSED_LABEL: '資料請求-送信済み',

  // ④ 検索クエリ（資料請求メールを識別する条件）
  //    Web3Forms経由の未読メール全件を対象にする場合:
  SEARCH_QUERY: 'from:noreply@web3forms.com is:unread label:INBOX',
  //
  //    ※ 件名で絞りたい場合はコメントアウトを切り替え:
  //    SEARCH_QUERY: 'subject:資料請求 is:unread label:INBOX',

  // ⑤ 送信者名（メールの差出人として表示される）
  SENDER_NAME: '株式会社マネーデザイン',

  // ⑥ 返信メールの件名
  REPLY_SUBJECT: '【株式会社マネーデザイン】AI導入支援サービス資料のご送付',
};

// ──────────────────────────────────────────────
//  返信メール本文（HTML形式）
// ──────────────────────────────────────────────
const REPLY_HTML = `
<div style="font-family: 'Hiragino Sans', Arial, sans-serif; color: #1a1816; max-width: 620px; line-height: 1.8;">

  <p>このたびは株式会社マネーデザインの生成AI導入支援サービスにご関心をお持ちいただき、誠にありがとうございます。</p>

  <p>ご請求いただきました<strong>会社紹介・サービス資料</strong>を本メールに添付してお送りいたします。<br>
  ぜひご一読いただけますと幸いです。</p>

  <div style="border-left: 4px solid #9c7a4e; padding: 12px 20px; margin: 24px 0; background: #f9f6f1;">
    <p style="margin: 0 0 8px 0;"><strong>📋 資料でわかること</strong></p>
    <ul style="margin: 0; padding-left: 20px;">
      <li>生成AI導入で実際に何時間・何円のコストが削減できるか（実績データ）</li>
      <li>「導入したが使われない」失敗を防ぐ6ステップのプロセス</li>
      <li>業種別の導入事例（製造業・コンサル・EC）と具体的なROI</li>
      <li>料金プランと投資回収期間の目安</li>
    </ul>
  </div>

  <p>資料をご覧になった上でご質問がございましたら、お気軽にご返信ください。</p>

  <p>また、<strong>60分の無料相談</strong>も随時承っております。<br>
  「自社でAIを使えるかどうか不安」という段階でも大歓迎です。<br>
  現状をお聞きし、御社に合った可能性をご提示します。</p>

  <p style="color: #9c7a4e;"><strong>費用が発生するのは、正式契約後からです。</strong><br>
  どうぞお気軽にご相談ください。</p>

  <hr style="border: none; border-top: 1px solid #dddddd; margin: 28px 0;">

  <p style="color: #6b6560; font-size: 13px; line-height: 1.7;">
    <strong style="color: #1a2d4a; font-size: 14px;">株式会社マネーデザイン</strong><br>
    代表取締役　中村 伸一<br>
    〒170-0003　東京都豊島区駒込6-26-10-302<br>
    Email: scb.tokyo@gmail.com
  </p>

</div>
`;

// ══════════════════════════════════════════════
//  メイン処理（トリガーで10分ごとに自動実行）
// ══════════════════════════════════════════════
function sendAutoReply() {

  // 処理済みラベルを取得（なければ自動作成）
  let processedLabel = GmailApp.getUserLabelByName(CONFIG.PROCESSED_LABEL);
  if (!processedLabel) {
    processedLabel = GmailApp.createLabel(CONFIG.PROCESSED_LABEL);
    Logger.log('ラベルを作成しました: ' + CONFIG.PROCESSED_LABEL);
  }

  // Google DriveからPDFを取得
  let pdfBlob;
  try {
    const file = DriveApp.getFileById(CONFIG.DRIVE_FILE_ID);
    pdfBlob = file.getBlob().setName(CONFIG.PDF_FILENAME);
    Logger.log('PDF取得成功: ' + file.getName());
  } catch (e) {
    Logger.log('【エラー】PDFが取得できません。DRIVE_FILE_IDを確認してください。\n詳細: ' + e);
    return;
  }

  // 条件に合うメールスレッドを検索
  const threads = GmailApp.search(CONFIG.SEARCH_QUERY);
  Logger.log('検索結果: ' + threads.length + ' 件');

  if (threads.length === 0) {
    Logger.log('新着の資料請求メールはありません。');
    return;
  }

  let sentCount = 0;

  threads.forEach(function(thread) {

    // 処理済みラベルが付いていればスキップ（二重送信防止）
    const labels = thread.getLabels();
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].getName() === CONFIG.PROCESSED_LABEL) {
        Logger.log('スキップ（処理済み）: ' + thread.getFirstMessageSubject());
        return;
      }
    }

    const firstMessage = thread.getMessages()[0];

    // 送信先アドレスを特定
    // Web3Forms はフォーム送信者のアドレスを Reply-To に設定する
    let recipientEmail = firstMessage.getReplyTo();

    // Reply-To がない場合は From を使用
    if (!recipientEmail || recipientEmail.trim() === '') {
      recipientEmail = firstMessage.getFrom();
    }

    // "氏名 <email@example.com>" 形式からアドレスのみ抽出
    const match = recipientEmail.match(/<([^>]+)>/);
    if (match) recipientEmail = match[1];
    recipientEmail = recipientEmail.trim();

    // メールアドレスの簡易バリデーション
    if (!recipientEmail || !recipientEmail.includes('@')) {
      Logger.log('無効なアドレスのためスキップ: ' + recipientEmail);
      thread.addLabel(processedLabel);
      return;
    }

    // 自分自身へのメール（テスト送信など）は返信しない
    if (recipientEmail === Session.getActiveUser().getEmail()) {
      Logger.log('自分宛メールのためスキップ: ' + recipientEmail);
      thread.addLabel(processedLabel);
      thread.markRead();
      return;
    }

    Logger.log('送信中 → ' + recipientEmail);

    try {
      GmailApp.sendEmail(recipientEmail, CONFIG.REPLY_SUBJECT, '', {
        name: CONFIG.SENDER_NAME,
        htmlBody: REPLY_HTML,
        attachments: [pdfBlob],
        replyTo: 'scb.tokyo@gmail.com',
      });

      Logger.log('✅ 送信完了: ' + recipientEmail);
      sentCount++;

      // 処理済みラベル付与 & 既読にする
      thread.addLabel(processedLabel);
      thread.markRead();

    } catch (e) {
      Logger.log('【送信エラー】' + recipientEmail + '\n詳細: ' + e);
    }
  });

  Logger.log('─────── 処理完了 ───────');
  Logger.log('今回の送信数: ' + sentCount + ' 件');
}

// ══════════════════════════════════════════════
//  初期設定（初回1回だけ実行してください）
// ══════════════════════════════════════════════
function setup() {
  // 既存の sendAutoReply トリガーを削除して再作成
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'sendAutoReply') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // 10分ごとに自動実行するトリガーを設定
  ScriptApp.newTrigger('sendAutoReply')
    .timeBased()
    .everyMinutes(10)
    .create();

  Logger.log('✅ セットアップ完了！10分ごとに自動で資料を送信します。');
}

// ══════════════════════════════════════════════
//  テスト実行（設定確認用）
// ══════════════════════════════════════════════
function testSend() {
  // テスト送信先（自分のアドレスに送って内容を確認）
  const TEST_EMAIL = 'scb.tokyo@gmail.com';

  let pdfBlob;
  try {
    const file = DriveApp.getFileById(CONFIG.DRIVE_FILE_ID);
    pdfBlob = file.getBlob().setName(CONFIG.PDF_FILENAME);
  } catch (e) {
    Logger.log('【エラー】PDFが取得できません: ' + e);
    return;
  }

  GmailApp.sendEmail(TEST_EMAIL, '[テスト送信] ' + CONFIG.REPLY_SUBJECT, '', {
    name: CONFIG.SENDER_NAME,
    htmlBody: REPLY_HTML,
    attachments: [pdfBlob],
  });

  Logger.log('✅ テスト送信完了 → ' + TEST_EMAIL);
  Logger.log('メールの受信ボックスを確認してください。');
}
