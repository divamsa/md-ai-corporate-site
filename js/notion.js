/* ==========================================
   notion.js - Notion API連携 (T-401〜T-403)
   現時点: プレースホルダー
   実装予定: T-401 でAPIキー設定後に完成
   ========================================== */

'use strict';

// ⚠️ T-401 実装時に設定
const NOTION_TOKEN   = 'YOUR_NOTION_INTEGRATION_TOKEN'; // 要設定
const NOTION_DB_ID   = 'YOUR_NOTION_DATABASE_ID';       // 要設定
const NOTION_API_URL = 'https://api.notion.com/v1';

/**
 * ブログ記事一覧を取得してDOMに描画
 * @param {string} containerId - 描画先要素のID
 * @param {number} limit        - 表示件数
 */
async function renderBlogPosts(containerId = 'blogGrid', limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // T-401 実装前はプレースホルダー記事を表示
  if (NOTION_TOKEN === 'YOUR_NOTION_INTEGRATION_TOKEN') {
    container.innerHTML = renderPlaceholderPosts(limit);
    return;
  }

  try {
    container.innerHTML = '<p class="loading">記事を読み込み中...</p>';

    const res = await fetch(`${NOTION_API_URL}/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { property: '公開', checkbox: { equals: true } },
        sorts: [{ property: '公開日', direction: 'descending' }],
        page_size: limit,
      }),
    });

    if (!res.ok) throw new Error(`Notion API error: ${res.status}`);
    const data = await res.json();
    container.innerHTML = data.results.map(pageToCard).join('') || '<p class="loading">記事がありません</p>';

  } catch (err) {
    console.error('Notion fetch error:', err);
    container.innerHTML = renderPlaceholderPosts(limit);
  }
}

/**
 * Notion ページオブジェクト → カードHTML
 */
function pageToCard(page) {
  const props = page.properties;
  const title    = props['タイトル']?.title?.[0]?.plain_text ?? '（タイトルなし）';
  const category = props['カテゴリ']?.select?.name ?? '';
  const date     = props['公開日']?.date?.start ?? '';
  const slug     = page.id;

  const formattedDate = date ? new Date(date).toLocaleDateString('ja-JP') : '';

  return `
    <article class="blog-card fade-in">
      <div class="blog-card__body">
        ${category ? `<span class="blog-card__category">${category}</span>` : ''}
        <h3 class="blog-card__title">
          <a href="blog/post.html?id=${slug}">${title}</a>
        </h3>
        <time class="blog-card__date" datetime="${date}">${formattedDate}</time>
      </div>
    </article>
  `;
}

/**
 * APIキー未設定時のプレースホルダー
 */
function renderPlaceholderPosts(limit) {
  const samples = [
    { category: '活用事例', title: '中小企業でのChatGPT活用術5選', date: '2025-02-01' },
    { category: 'AI基礎', title: '生成AIツール比較：ChatGPT vs Claude vs Gemini', date: '2025-01-20' },
    { category: '導入Tips', title: '失敗しないAI導入のための3つのチェックポイント', date: '2025-01-10' },
  ];

  return samples.slice(0, limit).map(p => `
    <article class="blog-card fade-in">
      <div class="blog-card__body">
        <span class="blog-card__category">${p.category}</span>
        <h3 class="blog-card__title">${p.title}</h3>
        <time class="blog-card__date">${new Date(p.date).toLocaleDateString('ja-JP')}</time>
      </div>
    </article>
  `).join('');
}

/* 実行 */
document.addEventListener('DOMContentLoaded', () => {
  renderBlogPosts('blogGrid', 3);
});
