/* ==========================================
   notion.js — ブログ記事描画 (T-401〜T-404)

   【仕組み】
   Notion API は CORS制限のためブラウザから直接呼べないため、
   scripts/fetch-blog.js（Node.js）でビルド時に取得した
   blog/posts.json を fetch して描画する。

   【記事更新手順】
   1. Notionで記事を書いて「公開」をチェック
   2. node scripts/fetch-blog.js  → blog/posts.json が更新される
   3. git add blog/posts.json && git commit -m "ブログ更新" && git push
   ========================================== */

'use strict';

// ─── posts.json のパスを現在のページ位置から自動判定 ───
// index.html（ルート）→ blog/posts.json
// blog/index.html    → posts.json
const _onBlogPage = location.pathname.includes('/blog/');
const POSTS_JSON  = _onBlogPage ? 'posts.json' : 'blog/posts.json';

/**
 * ブログ記事をDOMに描画する
 * @param {string} containerId - 描画先要素のID（デフォルト: 'blogGrid'）
 * @param {number} limit        - 表示件数（0 = 全件）
 */
async function renderBlogPosts(containerId = 'blogGrid', limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<p class="loading">記事を読み込み中...</p>';

  try {
    const res = await fetch(POSTS_JSON);
    if (!res.ok) throw new Error(`posts.json の取得に失敗しました (${res.status})`);

    const { posts } = await res.json();
    const items = (limit > 0) ? posts.slice(0, limit) : posts;

    if (!items.length) {
      container.innerHTML = '<p class="loading">記事がありません</p>';
      return;
    }

    container.innerHTML = items.map(postToCard).join('');

    // IntersectionObserver で fade-in を再トリガー
    container.querySelectorAll('.fade-in').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('visible');
      }
    });

  } catch (err) {
    console.warn('Blog fetch:', err.message);
    // フォールバック: サンプル記事を表示
    container.innerHTML = _placeholderPosts(limit || 3).map(postToCard).join('');
  }
}

/**
 * 記事オブジェクト → カードHTML
 */
function postToCard(p) {
  const href = _onBlogPage
    ? `post.html?id=${encodeURIComponent(p.slug)}`
    : `blog/post.html?id=${encodeURIComponent(p.slug)}`;

  const formattedDate = p.date
    ? new Date(p.date).toLocaleDateString('ja-JP')
    : '';

  return `
    <article class="blog-card fade-in">
      <div class="blog-card__body">
        ${p.category ? `<span class="blog-card__category">${p.category}</span>` : ''}
        <h3 class="blog-card__title">
          <a href="${href}">${p.title}</a>
        </h3>
        ${p.excerpt ? `<p class="blog-card__excerpt">${p.excerpt}</p>` : ''}
        <time class="blog-card__date" datetime="${p.date}">${formattedDate}</time>
      </div>
    </article>
  `.trim();
}

/**
 * posts.json 未生成時のフォールバックデータ
 */
function _placeholderPosts(limit) {
  return [
    {
      slug: '#', category: '活用事例',
      title: '中小企業でのChatGPT活用術5選',
      date: '2026-02-01',
      excerpt: 'ChatGPTを使って業務効率化を実現した中小企業の具体的な事例を5つご紹介します。',
    },
    {
      slug: '#', category: 'AI基礎',
      title: '生成AIツール比較：ChatGPT vs Claude vs Gemini',
      date: '2026-01-20',
      excerpt: '主要3ツールの特徴・料金・使い分けを徹底比較します。',
    },
    {
      slug: '#', category: '導入Tips',
      title: '失敗しないAI導入のための3つのチェックポイント',
      date: '2026-01-10',
      excerpt: 'AI導入を成功させるための重要なポイントを解説します。',
    },
  ].slice(0, limit);
}

/* ─── エントリーポイント ─── */
document.addEventListener('DOMContentLoaded', () => {
  // ブログ一覧ページ → 全件、トップページ → 3件
  renderBlogPosts('blogGrid', _onBlogPage ? 0 : 3);
});
