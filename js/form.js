/* ==========================================
   form.js — お問い合わせフォーム AJAX送信 (T-501)

   【仕組み】
   .js-form クラスのフォームを監視し、Formspreeへ fetch で送信。
   送信中はボタンをdisabledにしてUX向上。
   成功/失敗を .form__result に表示。
   ========================================== */

'use strict';

document.querySelectorAll('.js-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn    = form.querySelector('.js-submit-btn');
    const result = form.querySelector('.form__result');
    const originalText = btn ? btn.textContent : '';

    // ── ローディング状態 ──
    if (btn) {
      btn.disabled    = true;
      btn.textContent = '送信中…';
    }
    if (result) {
      result.className = 'form__result';
      result.textContent = '';
    }

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        // ── 成功 ──
        form.reset();
        if (btn) {
          btn.textContent = '送信しました ✓';
          // 5秒後にボタンテキストを戻す
          setTimeout(() => {
            btn.disabled    = false;
            btn.textContent = originalText;
          }, 5000);
        }
        if (result) {
          result.className   = 'form__result success';
          result.textContent = 'お問い合わせありがとうございます。担当者より2営業日以内にご連絡いたします。';
        }
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Status ${res.status}`);
      }

    } catch (err) {
      // ── エラー ──
      console.warn('Form submit error:', err.message);
      if (btn) {
        btn.disabled    = false;
        btn.textContent = originalText;
      }
      if (result) {
        result.className   = 'form__result error';
        result.textContent = '送信に失敗しました。お手数ですが、しばらく経ってから再度お試しください。';
      }
    }
  });
});
