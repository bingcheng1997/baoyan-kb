/* 共享脚本 · 移动端汉堡菜单（所有页面都引用） */
(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.main-nav-inner');
    if (!btn || !menu) return;
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!menu.contains(e.target) && e.target !== btn) {
        menu.classList.remove('open');
      }
    });
  });
})();