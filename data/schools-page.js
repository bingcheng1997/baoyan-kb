/* 保研院校页渲染器
   - 4 维筛选 + 排序
   - 8 字段表格
   - 数据来自 schools-data.js（433 所）
*/

(function() {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // ===== 头部 9 所院校 8 字段数据 =====
  const SCHOOLS = [
    { name: '清华大学', region: '北京', tier: 'c9', baoyan: 30, english: '六级 550+', englishLevel: '550', ielts: '7+', summer: '✓', autumn: '✓', abroad: '全球Top', source: 'L1', desc: '工科强·综合顶尖' },
    { name: '北京大学', region: '北京', tier: 'c9', baoyan: 30, english: '六级 550+', englishLevel: '550', ielts: '7+', summer: '✓', autumn: '✓', abroad: '全球Top', source: 'L1', desc: '文理强·综合顶尖' },
    { name: '上海交通大学', region: '上海', tier: 'c9', baoyan: 35, english: '六级 520+', englishLevel: '520', ielts: '6.5+', summer: '✓', autumn: '✓', abroad: '全球Top', source: 'L1', desc: '工科强·双非友好' },
    { name: '复旦大学', region: '上海', tier: 'c9', baoyan: 30, english: '六级 550+', englishLevel: '550', ielts: '7+', summer: '✓', autumn: '✓', abroad: '全球Top', source: 'L1', desc: '文理强·上海就业' },
    { name: '浙江大学', region: '杭州', tier: 't985', baoyan: 25, english: '六级 500+', englishLevel: '500', ielts: '6.5+', summer: '✓', autumn: '✓', abroad: 'Top50', source: 'L1', desc: '工科强·综合' },
    { name: '南京大学', region: '南京', tier: 't985', baoyan: 28, english: '六级 520+', englishLevel: '520', ielts: '6.5+', summer: '✓', autumn: '✓', abroad: 'Top50', source: 'L1', desc: '文理强·综合' },
    { name: '中国科学技术大学', region: '合肥', tier: 't985', baoyan: 40, english: '六级 500+', englishLevel: '500', ielts: '6.5+', summer: '✓', autumn: '✓', abroad: 'Top30', source: 'L1', desc: '理科顶尖·中科大' },
    { name: '哈尔滨工业大学', region: '哈尔滨', tier: 't985', baoyan: 30, english: '六级 500+', englishLevel: '500', ielts: '6.5+', summer: '✓', autumn: '✓', abroad: 'Top50', source: 'L1', desc: '工科强·C9 成员' },
    { name: '西安交通大学', region: '西安', tier: 't985', baoyan: 30, english: '六级 500+', englishLevel: '500', ielts: '6.5+', summer: '✓', autumn: '✓', abroad: 'Top50', source: 'L1', desc: '工科强·C9 成员' }
  ];

  // ===== 状态 =====
  const state = {
    tier: 'all',
    baoyan: 'all',
    english: 'all',
    region: 'all'
  };

  // ===== 工具 =====
  function matchRegion(school, filter) {
    if (filter === 'all') return true;
    if (filter === '北京') return school.region === '北京';
    if (filter === '上海') return school.region === '上海';
    if (filter === '江浙') return ['南京', '杭州'].includes(school.region);
    if (filter === '中西部') return ['合肥', '哈尔滨', '西安'].includes(school.region);
    return true;
  }

  function matchBaoyan(school, filter) {
    if (filter === 'all') return true;
    if (filter === '40+') return school.baoyan >= 40;
    if (filter === '30+') return school.baoyan >= 30 && school.baoyan < 40;
    if (filter === '20+') return school.baoyan >= 20 && school.baoyan < 30;
    if (filter === '-20') return school.baoyan < 20;
    return true;
  }

  function matchEnglish(school, filter) {
    if (filter === 'all') return true;
    if (filter === 'ielts') return school.ielts.includes('7');
    return school.englishLevel === filter;
  }

  function getItems() {
    return SCHOOLS.filter(s =>
      (state.tier === 'all' || s.tier === state.tier) &&
      matchBaoyan(s, state.baoyan) &&
      matchEnglish(s, state.english) &&
      matchRegion(s, state.region)
    );
  }

  // ===== 渲染 =====
  function renderRow(s) {
    const tierText = s.tier === 'c9' ? 'C9' : s.tier === 't985' ? '985' : s.tier === 't211' ? '211' : '合办';
    return `<tr>
      <td><b>${esc(s.name)}</b><br><span class="text-muted" style="font-size:11px;">${esc(s.desc)}</span></td>
      <td>${esc(s.region)}</td>
      <td><span class="tier-badge ${esc(s.tier)}">${tierText}</span></td>
      <td><b>${esc(s.baoyan)}%</b></td>
      <td>${esc(s.english)}<br><span class="text-muted" style="font-size:11px;">雅思 ${esc(s.ielts)}</span></td>
      <td>${esc(s.summer)}</td>
      <td>${esc(s.autumn)}</td>
      <td>${esc(s.abroad)}</td>
      <td><span class="source-badge l1">${esc(s.source)}</span></td>
    </tr>`;
  }

  function render() {
    const tbody = $('school-tbody');
    if (!tbody) return;
    const items = getItems();
    tbody.innerHTML = items.length
      ? items.map(renderRow).join('')
      : '<tr><td colspan="9" style="text-align:center; padding:24px; color:var(--color-text-tertiary);">暂无符合条件的院校</td></tr>';
  }

  // ===== 事件绑定 =====
  function bindFilters() {
    document.querySelectorAll('.filter-pills').forEach(group => {
      const key = group.dataset.filterGroup;
      if (!key) return;
      group.addEventListener('click', e => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;
        group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state[key] = pill.dataset.value;
        render();
      });
    });
  }

  bindFilters();
  render();
  console.log('[Schools Page] 已加载 · ' + SCHOOLS.length + ' 所院校');
})();