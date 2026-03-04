/* ==========================================
   main.js - 共通JS
   T-101: ヘッダースクロール挙動
   T-103: ハンバーガーメニュー
   T-203: カウントアップアニメーション
   ========================================== */

'use strict';

/* --- ヘッダー スクロール判定 --- */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* --- ハンバーガーメニュー (T-103) --- */
const hamburger = document.getElementById('hamburger');
const globalNav = document.getElementById('globalNav');

if (hamburger && globalNav) {

  // モバイルメニュー内にCTAボタンを動的追加
  const headerCta = document.querySelector('.header__cta');
  if (headerCta && !globalNav.querySelector('.nav__cta')) {
    const mobileCta = document.createElement('div');
    mobileCta.className = 'nav__cta';
    mobileCta.innerHTML = `<a href="${headerCta.href}" class="btn btn--primary" style="width:100%;justify-content:center;">${headerCta.textContent}</a>`;
    globalNav.appendChild(mobileCta);
  }

  // オーバーレイ生成
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    hamburger.classList.add('active');
    globalNav.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';  // スクロールロック
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    globalNav.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';  // スクロールロック解除
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('active') ? closeMenu() : openMenu();
  });

  // オーバーレイクリックで閉じる
  overlay.addEventListener('click', closeMenu);

  // Escキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // ナビリンクをクリックしたらメニューを閉じる
  globalNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --- フェードインアニメーション --- */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // 子要素が複数ある場合はディレイをずらす
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => observer.observe(el));
}

/* --- カウントアップ (T-203) --- */
function countUp(el, target, duration = 1800) {
  const unitEl = el.querySelector('.stats__unit');
  const unitHTML = unitEl ? unitEl.outerHTML : '';
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutQuart
    const eased = 1 - Math.pow(1 - progress, 4);
    const num = progress < 1 ? Math.floor(eased * target) : target;
    el.innerHTML = num + unitHTML;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stats__num');
if (statNums.length > 0) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count, 10);
        if (!isNaN(target)) countUp(entry.target, target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statsObserver.observe(el));
}
