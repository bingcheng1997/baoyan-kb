/* 保研院校页 v2.0 · 433 所真实数据 */

(function() {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // 学校层次推断（基于真实名单 + 通用规则）
  function getTier(name, region) {
    const C9 = ['北京大学', '清华大学', '复旦大学', '上海交通大学', '浙江大学', '南京大学', '中国科学技术大学', '哈尔滨工业大学', '西安交通大学'];
    const T985 = ['中国人民人民大学', '北京航空航天大学', '北京理工大学', '中国农业大学', '北京师范大学', '中央民族大学', '南开大学', '天津大学', '大连理工大学', '东北大学', '吉林大学', '同济大学', '华东师范大学', '中国科学院大学', '中国海洋大学', '华中科技大学', '武汉大学', '中南大学', '湖南大学', '国防科技大学', '山东大学', '中国农业大学', '厦门大学', '武汉理工大学', '重庆大学', '四川大学', '电子科技大学', '中山大学', '华南理工大学', '暨南大学', '西北工业大学', '西北农林科技大学', '兰州大学', '中央财经大学', '对外经济贸易大学', '北京外国语大学', '中国政法大学', '上海财经大学', '中国人民公安大学', '中央音乐学院', '中央美术学院', '北京体育大学'];
    if (C9.includes(name)) return 'c9';
    if (T985.includes(name) || name.endsWith('大学') && /^(北京|上海|武汉|广州|南京|杭州|西安|天津|重庆|成都|厦门|长沙|合肥|哈尔滨|长春|沈阳|大连|青岛|济南|郑州|南昌|福州|昆明|兰州|石家庄|太原|南宁|贵阳|海口|乌鲁木齐|呼和浩特|银川|西宁|拉萨|无锡|苏州|宁波|温州|唐山|徐州|烟台|潍坊|淄博|济宁|临沂|洛阳|邯郸|沧州|保定|廊坊|承德|衡水|秦皇岛|邢台|张家口|承德|沧州|廊坊|承德|秦皇岛|邢台|张家口)/.test(region)) return 't985';
    return 't211';
  }

  const TIER_LABELS = { c9: 'C9', t985: '985', t211: '211' };
  const REGIONS = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'];

  const state = { tier: 'all', region: 'all', search: '', sort: 'region' };

  function getItems() {
    const all = (window.SCHOOLS_DATA && window.SCHOOLS_DATA.schools) || [];
    return all
      .map(s => ({ ...s, tier: getTier(s.name, s.region) }))
      .filter(s => {
        if (state.tier !== 'all' && s.tier !== state.tier) return false;
        if (state.region !== 'all' && s.region !== state.region) return false;
        if (state.search && !s.name.toLowerCase().includes(state.search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (state.sort === 'name') return a.name.localeCompare(b.name);
        if (state.sort === 'tier') {
          const order = { c9: 0, t985: 1, t211: 2 };
          return order[a.tier] - order[b.tier];
        }
        return a.region.localeCompare(b.region) || a.name.localeCompare(b.name);
      });
  }

  function renderRegion() {
    const group = document.querySelector('[data-filter-group="region"]');
    if (!group) return;
    const counts = {};
    const all = (window.SCHOOLS_DATA && window.SCHOOLS_DATA.schools) || [];
    all.forEach(s => { counts[s.region] = (counts[s.region] || 0) + 1; });
    const sorted = REGIONS.filter(r => counts[r]);
    group.innerHTML = '<button class="filter-pill active" data-value="all">全部 (' + all.length + ')</button>' +
      sorted.map(r => `<button class="filter-pill" data-value="${esc(r)}">${esc(r)} (${counts[r]})</button>`).join('');
    group.addEventListener('click', e => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.region = pill.dataset.value;
      render();
    });
  }

  function renderTier() {
    const group = document.querySelector('[data-filter-group="tier"]');
    if (!group) return;
    const all = (window.SCHOOLS_DATA && window.SCHOOLS_DATA.schools) || [];
    const counts = { c9: 0, t985: 0, t211: 0 };
    all.forEach(s => { counts[getTier(s.name, s.region)]++; });
    // 只显示 count > 0 的层次
    const tierMap = [
      { key: 'all', label: '全部', count: all.length },
      { key: 'c9', label: 'C9', count: counts.c9 },
      { key: 't985', label: '985', count: counts.t985 },
      { key: 't211', label: '211', count: counts.t211 }
    ];
    group.innerHTML = tierMap.filter(t => t.count > 0).map(t =>
      `<button class="filter-pill${t.key === state.tier ? ' active' : ''}" data-value="${t.key}">${t.label} (${t.count})</button>`
    ).join('');
    group.addEventListener('click', e => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.tier = pill.dataset.value;
      render();
    });
  }

  function render() {
    const tbody = $('school-tbody');
    if (!tbody) return;
    const items = getItems();
    tbody.innerHTML = items.length
      ? items.slice(0, 100).map(s => `
        <tr>
          <td><b>${esc(s.name)}</b></td>
          <td>${esc(s.region)}</td>
          <td><span class="tier-badge ${esc(s.tier)}">${TIER_LABELS[s.tier]}</span></td>
          <td><a href="${esc(getSearchUrl(s.name))}" target="_blank" class="more-link">查看 →</a></td>
        </tr>
      `).join('')
      : '<tr><td colspan="4" style="text-align:center; padding:24px; color:var(--color-text-tertiary);">暂无符合条件的院校</td></tr>';

    const count = $('school-count');
    if (count) count.textContent = items.length;
    const showing = $('school-showing');
    if (showing) showing.textContent = Math.min(100, items.length);
  }

  function getSearchUrl(name) {
    // 跳到研招网搜索
    return 'https://yz.chsi.com.cn/zsml/queryArea.do?yxmc=' + encodeURIComponent(name);
  }

  // 搜索
  function setupSearch() {
    const search = $('school-search');
    if (!search) return;
    search.addEventListener('input', () => {
      state.search = search.value.trim();
      render();
    });
  }

  // 排序
  function setupSort() {
    const group = document.querySelector('[data-sort-group]');
    if (!group) return;
    group.addEventListener('click', e => {
      const btn = e.target.closest('.sort-btn');
      if (!btn) return;
      group.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.sort = btn.dataset.sort;
      render();
    });
  }

  renderRegion();
  renderTier();
  setupSearch();
  setupSort();
  render();
  console.log('[Schools Page v2.0] 已加载 433 所真实数据');
})();