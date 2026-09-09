/* 保研通知页渲染器
   - 5 维筛选 + 3 排序 + 分页
   - 真实数据从 notices-data.js
*/

(function() {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // ===== 状态映射 =====
  const STATUS_MAP = {
    today:    { cls: 'urgent',  text: '今天截止' },
    urgent:   { cls: 'warning', text: '3天截止' },
    signup:   { cls: 'normal',  text: '报名中' },
    upcoming: { cls: 'normal',  text: '未开始' },
    ended:    { cls: 'ended',   text: '已结束' }
  };

  const TIER_MAP = {
    c9:    { cls: 'tier-c9',    text: 'C9' },
    t985:  { cls: 'tier-985',   text: '985' },
    t211:  { cls: 'tier-211',   text: '211' },
    abroad:{ cls: 'tier-abroad',text: '中外合办' },
    other: { cls: 'tier-other', text: '其他' }
  };

  // ===== 状态 =====
  const state = {
    type: 'all',
    status: 'all',
    tier: 'all',
    sort: 'deadline',
    page: 1,
    perPage: 20
  };

  // ===== 工具：过滤 + 排序 =====
  function getItems() {
    let items = (window.NOTICES_DATA && window.NOTICES_DATA.items) || [];

    // 筛选
    if (state.type !== 'all') {
      items = items.filter(it => it.type === state.type);
    }
    if (state.status !== 'all') {
      if (state.status === '72h') {
        items = items.filter(it => ['today', 'urgent'].includes(it.status));
      } else {
        items = items.filter(it => it.status === state.status);
      }
    }
    if (state.tier !== 'all') {
      items = items.filter(it => it.school_tier === state.tier);
    }

    // 排序
    items = [...items].sort((a, b) => {
      if (state.sort === 'deadline') {
        return a.deadline.localeCompare(b.deadline);
      }
      if (state.sort === 'school') {
        return a.school.localeCompare(b.school);
      }
      if (state.sort === 'latest') {
        return b.publish_date.localeCompare(a.publish_date);
      }
      return 0;
    });

    return items;
  }

  // ===== 工具：状态描述（基于日期计算）=====
  function computeStatus(item) {
    const now = new Date('2026-09-09'); // 演示用固定时间
    const dl = new Date(item.deadline);
    const diff = Math.ceil((dl - now) / 86400000);
    if (diff <= 0) return 'today';
    if (diff <= 3) return 'urgent';
    if (diff <= 7) return 'soon';
    return 'signup';
  }

  // ===== 工具：状态文本（紧急度）=====
  function getUrgencyText(deadline) {
    const now = new Date('2026-09-09');
    const dl = new Date(deadline);
    const diff = Math.ceil((dl - now) / 86400000);
    if (diff <= 0) return { text: '今天截止', cls: 'urgent' };
    if (diff <= 3) return { text: `${diff}天截止`, cls: 'warning' };
    if (diff <= 7) return { text: `${diff}天截止`, cls: 'soon' };
    return { text: '报名中', cls: 'normal' };
  }

  // ===== 渲染单行 =====
  function renderRow(item) {
    const urgency = getUrgencyText(item.deadline);
    const tier = TIER_MAP[item.school_tier] || TIER_MAP.other;
    return `
      <tr>
        <td><span class="status-tag ${urgency.cls}">${urgency.text}</span></td>
        <td>
          <b>${esc(item.school)}</b>
          <br><span class="text-muted">${esc(item.department)}</span>
          <br><span class="tier-badge ${tier.cls}">${tier.text}</span>
        </td>
        <td>
          <a href="${esc(item.source_url)}" target="_blank" rel="noopener">${esc(item.title)}</a>
          <br><span class="text-muted" style="font-size:11px;">${esc(item.publish_date)} 发布</span>
        </td>
        <td><b>${esc(item.deadline)}</b></td>
        <td>
          <a href="${esc(item.source_url)}" target="_blank" rel="noopener" class="row-link">🏛 官方</a>
          <button class="row-link" onclick="alert('收藏功能开发中')">⭐ 收藏</button>
        </td>
      </tr>
    `;
  }

  // ===== 渲染分页 =====
  function renderPagination(total, page, perPage) {
    const pages = Math.max(1, Math.ceil(total / perPage));
    const el = $('pagination');
    if (!el) return;
    if (total === 0) {
      el.innerHTML = '<div class="empty-state">暂无符合条件的通知</div>';
      return;
    }
    let html = '<div class="pagination-inner">';
    html += `<button class="page-btn" ${page <= 1 ? 'disabled' : ''} data-page="${page - 1}">‹ 上一页</button>`;

    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);
    if (start > 1) {
      html += `<button class="page-btn" data-page="1">1</button>`;
      if (start > 2) html += '<span class="page-dots">…</span>';
    }
    for (let i = start; i <= end; i++) {
      html += `<button class="page-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    if (end < pages) {
      if (end < pages - 1) html += '<span class="page-dots">…</span>';
      html += `<button class="page-btn" data-page="${pages}">${pages}</button>`;
    }
    html += `<button class="page-btn" ${page >= pages ? 'disabled' : ''} data-page="${page + 1}">下一页 ›</button>`;
    html += '</div>';
    el.innerHTML = html;

    el.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const p = parseInt(btn.dataset.page);
        if (p && p !== state.page) {
          state.page = p;
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // ===== 渲染主函数 =====
  function render() {
    const items = getItems();
    const total = items.length;
    const start = (state.page - 1) * state.perPage;
    const pageItems = items.slice(start, start + state.perPage);

    const tbody = $('notice-tbody');
    if (tbody) {
      tbody.innerHTML = pageItems.length
        ? pageItems.map(renderRow).join('')
        : '<tr><td colspan="5" class="empty-row">暂无符合条件的通知</td></tr>';
    }

    if ($('result-total')) $('result-total').textContent = total;
    if ($('result-page')) $('result-page').textContent = state.page;
    if ($('result-pages')) $('result-pages').textContent = Math.max(1, Math.ceil(total / state.perPage));

    renderPagination(total, state.page, state.perPage);
  }

  // ===== 事件绑定 =====
  function bindFilters() {
    document.querySelectorAll('.filter-pills').forEach(group => {
      const groupName = group.dataset.filterGroup;
      group.addEventListener('click', e => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;
        group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state[groupName] = pill.dataset.value;
        state.page = 1;
        render();
      });
    });

    document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.sort = btn.dataset.sort;
        state.page = 1;
        render();
      });
    });
  }

  // ===== 启动 =====
  if ($('notice-tbody')) {
    bindFilters();
    render();
    console.log('[Notices Page] 已加载');
  }
})();