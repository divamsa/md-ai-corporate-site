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

// ── Notion API 呼び出し ──
async function fetchPosts() {
  console.log('📡 Notion API に接続中...');

  const res = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
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

  const posts = data.results.map(page => {
    const p = page.properties;
    return {
      id:       page.id,
      slug:     p['スラッグ']?.rich_text?.[0]?.plain_text  || page.id,
      title:    p['タイトル']?.title?.[0]?.plain_text       || '（タイトルなし）',
      category: p['カテゴリ']?.select?.name                 || '',
      date:     p['公開日']?.date?.start                    || '',
      excerpt:  p['概要']?.rich_text?.[0]?.plain_text       || '',
    };
  });

  const outPath = join(__dirname, '..', 'blog', 'posts.json');
  writeFileSync(outPath, JSON.stringify({ posts }, null, 2), 'utf8');

  console.log(`✅ ${posts.length} 件を blog/posts.json に書き出しました`);
  posts.forEach((p, i) => console.log(`   ${i + 1}. [${p.category}] ${p.title} (${p.date})`));
}

fetchPosts().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
