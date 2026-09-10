/* 面试指南页渲染器 */

(function() {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // ===== 综合面试数据 =====
  const INTERVIEWS = [
    { school: '清华大学', dept: '计算机系', count: 23, types: ['专业面', '机考', 'PPT'], english: '雅思 7+', type: 'all' },
    { school: '北京大学', dept: '光华管理学院', count: 18, types: ['专业面', '压力面', 'PPT'], english: '雅思 7+', type: 'all' },
    { school: '上海交大', dept: '安泰经管', count: 14, types: ['专业面', 'PPT'], english: '六级 520+', type: 'all' },
    { school: '复旦大学', dept: '经济学院', count: 15, types: ['专业面', '压力面'], english: '六级 550+', type: 'all' },
    { school: '浙江大学', dept: '计算机学院', count: 12, types: ['机考', '专业面'], english: '六级 500+', type: '机考' },
    { school: '南京大学', dept: '文学院', count: 10, types: ['专业面', 'PPT'], english: '六级 520+', type: '专业面' },
    { school: '中科大', dept: '物理学院', count: 9, types: ['机考', '专业面'], english: '六级 500+', type: '机考' },
    { school: '哈工大', dept: '机电学院', count: 8, types: ['专业面'], english: '六级 500+', type: '专业面' }
  ];

  // ===== Tab 切换 =====
  function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-content').forEach(c => {
          c.classList.remove('active');
          c.setAttribute('hidden', '');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const target = $('tab-' + tab);
        if (target) {
          target.classList.add('active');
          target.removeAttribute('hidden');
        }
      });
    });
  }

  // ===== 综合面试渲染 =====
  function renderInterviews(filter) {
    const grid = $('interview-grid');
    if (!grid) return;
    const items = INTERVIEWS.filter(it => {
      if (filter === 'all') return true;
      return it.types.some(t => t === filter);
    });
    grid.innerHTML = items.map(it => `
      <div class="interview-card">
        <div class="interview-school"><b>${esc(it.school)}</b> · ${esc(it.dept)}</div>
        <div class="interview-types">
          ${it.types.map(t => `<span class="type-pill">${esc(t)}</span>`).join('')}
        </div>
        <div class="interview-english">英语门槛：${esc(it.english)}</div>
        <div class="interview-count">${it.count} 道真题</div>
        <a href="intro.html#chapter-interview" class="row-link">查看完整真题 →</a>
      </div>
    `).join('');
  }

  // ===== 筛选 =====
  function setupFilters() {
    document.querySelectorAll('.filter-pills').forEach(group => {
      const key = group.dataset.filterGroup;
      if (!key) return;
      group.addEventListener('click', e => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;
        group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderInterviews(pill.dataset.value);
      });
    });
  }

  setupTabs();
  setupFilters();
  renderInterviews('all');
  console.log('[Interview Page] 已加载 · 8 所院校');
})();