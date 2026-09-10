/* 全局 command palette（Ctrl+K 触发） */
(function() {
  'use strict';

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // 搜索源
  const SOURCES = {
    schools: { title: '院校', url: 'pages/schools.html?q=', data: () => (window.SCHOOLS_DATA && window.SCHOOLS_DATA.schools || []).slice(0, 10) },
    glossary: { title: '黑话', url: 'pages/glossary.html?q=', data: () => (window.SCHOOLS_DATA && window.SCHOOLS_DATA.schools || []).slice(0, 0) }, // 暂无全局
    faq: { title: '问答', url: 'pages/faq.html?q=', data: () => [] }
  };

  function buildIndex() {
    // 简单索引：院校数据
    const items = [];
    if (window.SCHOOLS_DATA && window.SCHOOLS_DATA.schools) {
      window.SCHOOLS_DATA.schools.forEach(s => {
        items.push({ title: s.name, subtitle: s.region, type: '院校', url: 'pages/schools.html?q=' + encodeURIComponent(s.name) });
      });
    }
    return items;
  }

  function openPalette() {
    let overlay = document.getElementById('cmd-palette');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'cmd-palette';
      overlay.className = 'cmd-palette';
      overlay.innerHTML = `
        <div class="cmd-palette-box">
          <input type="search" id="cmd-palette-input" placeholder="搜索院校、黑话、问答..." autocomplete="off">
          <div class="cmd-palette-results" id="cmd-palette-results"></div>
          <div class="cmd-palette-hint">
            <span>↑↓ 选择</span>
            <span>↵ 打开</span>
            <span>ESC 关闭</span>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      const input = document.getElementById('cmd-palette-input');
      const results = document.getElementById('cmd-palette-results');

      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { results.innerHTML = ''; return; }
        const all = buildIndex();
        const matched = all.filter(it => it.title.toLowerCase().includes(q) || it.subtitle.toLowerCase().includes(q)).slice(0, 8);
        results.innerHTML = matched.length
          ? matched.map(m => `<a href="${esc(m.url)}" class="cmd-palette-item"><span class="cmd-palette-item-title">${esc(m.title)}</span><span class="cmd-palette-item-type">${esc(m.type)} · ${esc(m.subtitle)}</span></a>`).join('')
          : '<div class="cmd-palette-empty">没有匹配结果</div>';
      });

      overlay.addEventListener('click', e => {
        if (e.target === overlay) closePalette();
      });
    }
    overlay.classList.add('open');
    const input = document.getElementById('cmd-palette-input');
    if (input) setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    const overlay = document.getElementById('cmd-palette');
    if (overlay) overlay.classList.remove('open');
  }

  // 触发器
  function setupTrigger() {
    document.querySelectorAll('.search-trigger').forEach(btn => {
      btn.addEventListener('click', openPalette);
    });
    // Ctrl+K / Cmd+K
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openPalette();
      } else if (e.key === 'Escape') {
        closePalette();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTrigger);
  } else {
    setupTrigger();
  }
})();