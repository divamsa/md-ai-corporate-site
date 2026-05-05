#!/usr/bin/env node
/**
 * fetch-blog.js — Notion API からブログ記事を取得して blog/posts.json に書き出す
 *
 * 【使い方】
 *   1. .env.local に NOTION_TOKEN と NOTION_DB_ID を設定（下記参照）
 *   2. node scripts/fetch-blog.js
 *
 * 【.env.local の書き方】
 *   NOTION_TOKEN=secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 *   NOTION_DB_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 *
 * 【動作環境】Node.js 18 以上（fetch 組み込み）
 */

'use strict';

const { writeFileSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');

// ── .env.local を手動パース（dotenvなしで動作させるため） ──
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(line => line && !line.startsWith('#'))
    .forEach(line => {
      const [key, ...vals] = line.split('=');
      if (key) process.env[key.trim()] = vals.join('=').trim();
    });
}

// ── 設定 ──
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;

if (!NOTION_TOKEN || NOTION_TOKEN === 'secret_XXXX') {
  console.error('❌ NOTION_TOKEN が未設定です。.env.local を確認してください。');
  process.exit(1);
}
if (!NOTION_DB_ID || NOTION_DB_ID === 'XXXX') {
  console.error('❌ NOTION_DB_ID が未設定です。.env.local を確認してください。');
  process.exit(1);
}

// ── Notion API ヘルパー ──
const NOTION_HEADERS = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

/** リッチテキスト配列 → HTML 文字列 */
function richTextToHtml(richTexts = []) {
  return richTexts.map(rt => {
    let text = rt.plain_text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    if (rt.annotations?.bold)          text = `<strong>${text}</strong>`;
    if (rt.annotations?.italic)        text = `<em>${text}</em>`;
    if (rt.annotations?.strikethrough) text = `<s>${text}</s>`;
    if (rt.annotations?.underline)     text = `<u>${text}</u>`;
    if (rt.annotations?.code)          text = `<code>${text}</code>`;
    if (rt.href) text = `<a href="${rt.href}" target="_blank" rel="noopener">${text}</a>`;
    return text;
  }).join('');
}

/** Notion Blocks 配列 → HTML 文字列 */
function blocksToHtml(blocks = []) {
  const html = [];
  let ulOpen  = false;
  let olOpen  = false;

  const closeList = () => {
    if (ulOpen) { html.push('</ul>'); ulOpen = false; }
    if (olOpen) { html.push('</ol>'); olOpen = false; }
  };

  for (const block of blocks) {
    const type = block.type;
    const b    = block[type] || {};

    // リスト以外のブロックが来たらリストを閉じる
    if (type !== 'bulleted_list_item' && ulOpen) { html.push('</ul>'); ulOpen = false; }
    if (type !== 'numbered_list_item' && olOpen) { html.push('</ol>'); olOpen = false; }

    switch (type) {
      case 'paragraph':
        html.push(`<p>${richTextToHtml(b.rich_text)}</p>`);
        break;

      case 'heading_1':
        html.push(`<h2>${richTextToHtml(b.rich_text)}</h2>`);
        break;
      case 'heading_2':
        html.push(`<h3>${richTextToHtml(b.rich_text)}</h3>`);
        break;
      case 'heading_3':
        html.push(`<h4>${richTextToHtml(b.rich_text)}</h4>`);
        break;

      case 'bulleted_list_item':
        if (!ulOpen) { html.push('<ul>'); ulOpen = true; }
        html.push(`<li>${richTextToHtml(b.rich_text)}</li>`);
        break;

      case 'numbered_list_item':
        if (!olOpen) { html.push('<ol>'); olOpen = true; }
        html.push(`<li>${richTextToHtml(b.rich_text)}</li>`);
        break;

      case 'quote':
        html.push(`<blockquote>${richTextToHtml(b.rich_text)}</blockquote>`);
        break;

      case 'code':
        html.push(`<pre><code class="language-${b.language || 'plaintext'}">${richTextToHtml(b.rich_text)}</code></pre>`);
        break;

      case 'callout':
        html.push(`<div class="callout">${b.icon?.emoji || '💡'} ${richTextToHtml(b.rich_text)}</div>`);
        break;

      case 'divider':
        html.push('<hr>');
        break;

      case 'image': {
        const src = b.type === 'external' ? b.external?.url : b.file?.url;
        const alt = richTextToHtml(b.caption) || '';
        if (src) html.push(`<figure><img src="${src}" alt="${alt}" loading="lazy"><figcaption>${alt}</figcaption></figure>`);
        break;
      }

      default:
        // 未対応ブロックはスキップ
        break;
    }
  }

  closeList();
  return html.join('\n');
}

/** ページ本文（blocks）を取得して HTML に変換 */
async function fetchPageBody(pageId) {
  try {
    const res = await fetch(
      `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`,
      { headers: NOTION_HEADERS }
    );
    if (!res.ok) return '';
    const data = await res.json();
    return blocksToHtml(data.results || []);
  } catch {
    return '';
  }
}

// ── メイン ──
async function fetchPosts() {
  console.log('📡 Notion API に接続中...');

  const res = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`,
    {
      method: 'POST',
      headers: NOTION_HEADERS,
      body: JSON.stringify({
        filter: { property: '公開', checkbox: { equals: true } },
        sorts: [{ property: '公開日', direction: 'descending' }],
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Notion API エラー (${res.status}): ${errText}`);
  }

  const data = await res.json();

  console.log(`📝 ${data.results.length} 件の記事を取得、本文を取得中...`);

  const posts = await Promise.all(
    data.results.map(async page => {
      const p = page.properties;
      const body = await fetchPageBody(page.id);
      return {
        id:       page.id,
        slug:     p['スラッグ']?.rich_text?.[0]?.plain_text  || page.id,
        title:    p['タイトル']?.title?.[0]?.plain_text       || '（タイトルなし）',
        category: p['カテゴリ']?.select?.name                 || '',
        date:     p['公開日']?.date?.start                    || '',
        excerpt:  p['概要']?.rich_text?.[0]?.plain_text       || '',
        body,
      };
    })
  );

  const outPath = join(__dirname, '..', 'blog', 'posts.json');
  writeFileSync(outPath, JSON.stringify({ posts }, null, 2), 'utf8');

  console.log(`✅ ${posts.length} 件を blog/posts.json に書き出しました`);
  posts.forEach((p, i) => console.log(`   ${i + 1}. [${p.category}] ${p.title} (${p.date})`));
}

fetchPosts().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
