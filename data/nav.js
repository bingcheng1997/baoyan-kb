/* 共享脚本 · 移动端汉堡菜单（带 ARIA 状态） */
(function() {
  'use strict';
  function setupNavToggle() {
    const btn = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.main-nav-inner');
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'main-nav-inner');
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', function(e) {
      if (!menu.contains(e.target) && e.target !== btn) {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNavToggle);
  } else {
    setupNavToggle();
  }
})();