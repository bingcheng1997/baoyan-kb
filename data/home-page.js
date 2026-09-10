/* 首页 v4.0 渲染器 */

(function() {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // ===== 2 维矩阵弹窗（按 PDF 内容：4 分类 × 4 年级）=====
  const MATRIX_DETAIL = {
    'gpa-1': { title: '大一 · 校内 GPA', actions: ['保持高 GPA（前 30%）', '理性选课（核心专业课拿高分）', '探索专业兴趣方向', '进课题组/实验室（积累科研入门经验）'] },
    'gpa-2': { title: '大二 · 校内 GPA', actions: ['保持高 GPA（前 20%）', '重视专业课成绩', '明确未来专业兴趣方向', 'GPA 维持不掉'] },
    'gpa-3': { title: '大三 · 校内 GPA', actions: ['保持高 GPA（冲刺前 5-10%）', '提前了解保研政策', '明确院校及专业目标', '获取本校保研名额'] },
    'gpa-4': { title: '大四 · 校内 GPA', actions: ['确认保研资格', '确保顺利保研', '准备毕业论文顺利毕业', '★如无 offer 参加九推，积极调'] },

    'english-1': { title: '大一 · 英语成绩', actions: ['积累词汇基础', '备考四级（425+）', '初学托福/雅思（了解考试结构）', '每天英语学习 30 分钟'] },
    'english-2': { title: '大二 · 英语成绩', actions: ['★备考六级（550+）', '备考托福/雅思，提升英语竞争力', '参加英语演讲/辩论赛', '阅读英文原版书'] },
    'english-3': { title: '大三 · 英语成绩', actions: ['★冲刺托福/雅思（7.0+）', '提前准备保研所需文书及资料', '准备保研相关面试', '参与暑期夏令营（英语面试）'] },
    'english-4': { title: '大四 · 英语成绩', actions: ['★准备面试（强化口语及写作能力）', '准备英文简历', '准备英文自我介绍 1-2 分钟', '准备英文文献翻译'] },

    'research-1': { title: '大一 · 实习科研', actions: ['★参与社团活动', '报名基础竞赛（大创、计算机考级等）', '积累实习科研入门经验', '关注实验室招募'] },
    'research-2': { title: '大二 · 实习科研', actions: ['★参加各类相关竞赛（大创、互联网+）', '参与实习科研等', '争取论文发表机会', '积累 1-2 段科研经历'] },
    'research-3': { title: '大三 · 实习科研', actions: ['★参与高含金量实习科研', '争取高水平论文发表', '准备研究计划书', '★关注导师实验室招募'] },
    'research-4': { title: '大四 · 实习科研', actions: ['★可继续参与实习', '★可提前加入研究生导师的实验室', '完成毕业论文', '★保研 vs 留学最终决定'] },

    'baoyan-1': { title: '大一 · 保研相关', actions: ['明确后续升学意向（保研/考研/留学）', '了解往届保研情况', '关注学长学姐保研路径', '关注保研政策变化'] },
    'baoyan-2': { title: '大二 · 保研相关', actions: ['★了解本校保研名额及要求', '明确目标院校方向（清北复交/C9/985）', '圈定 3-5 所目标院校', '关注保研夏令营时间'] },
    'baoyan-3': { title: '大三 · 保研相关 ★现在', actions: ['★5-7 月参加保研夏令营', '★8-9 月参与保研预推免', '★提前了解保研夏令营/预推免开设情况', '★按时提交材料准备报名', '★兜底：双保险'] },
    'baoyan-4': { title: '大四 · 保研相关', actions: ['★9 月确定拿到保研名额', '★已有 offer 填写系统确认入读', '★无 offer 参加九推捡漏', '★积极调剂', '★保研 vs 留学最终决定'] }
  };

  function setupMatrix() {
    const modal = $('matrix-modal');
    const title = $('matrix-modal-title');
    const list = $('matrix-modal-list');
    const close = $('matrix-modal-close');

    document.querySelectorAll('.matrix-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        const detail = MATRIX_DETAIL[`${row}-${col}`];
        if (!detail) return;
        title.textContent = detail.title;
        list.innerHTML = detail.actions.map(a => `<li>${esc(a)}</li>`).join('');
        modal.classList.add('active');
      });
    });

    close.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // ===== 状态映射 =====
  const STATUS_MAP = {
    today: { text: '今天截止', cls: 'urgent' },
    urgent: { text: '3天截止', cls: 'warning' },
    signup: { text: '报名中', cls: 'normal' }
  };

  function getUrgency(deadline) {
    const now = new Date('2026-09-09');
    const dl = new Date(deadline);
    const diff = Math.ceil((dl - now) / 86400000);
    if (diff <= 0) return { text: '今天截止', cls: 'urgent' };
    if (diff <= 3) return { text: `${diff}天截止`, cls: 'warning' };
    return { text: '报名中', cls: 'normal' };
  }

  // ===== 通知预览 =====
  function renderHomeNotices() {
    const tbody = $('home-notice-tbody');
    if (!tbody) return;
    const items = (window.NOTICES_DATA && window.NOTICES_DATA.items) || [];
    const top = items.slice(0, 5);
    tbody.innerHTML = top.map(item => {
      const u = getUrgency(item.deadline);
      return `<tr>
        <td><span class="status-tag ${u.cls}">${u.text}</span></td>
        <td><b>${esc(item.school)}</b><br><span class="text-muted">${esc(item.department)}</span></td>
        <td>${esc(item.deadline)}</td>
      </tr>`;
    }).join('');
  }

  // ===== 院校预览 =====
  const TOP_SCHOOLS = [
    { name: '清华大学', region: '北京市', tier: 'c9', baoyan: '约30%', english: '六级550+', abroad: '全球Top' },
    { name: '北京大学', region: '北京市', tier: 'c9', baoyan: '约30%', english: '六级550+', abroad: '全球Top' },
    { name: '上海交通大学', region: '上海市', tier: 'c9', baoyan: '约35%', english: '六级520+', abroad: '全球Top' },
    { name: '复旦大学', region: '上海市', tier: 'c9', baoyan: '约30%', english: '六级550+', abroad: '全球Top' },
    { name: '浙江大学', region: '浙江省', tier: 't985', baoyan: '约25%', english: '六级500+', abroad: 'Top50' },
    { name: '南京大学', region: '江苏省', tier: 't985', baoyan: '约28%', english: '六级520+', abroad: 'Top50' },
    { name: '中国科学技术大学', region: '安徽省', tier: 't985', baoyan: '约40%', english: '六级500+', abroad: 'Top30' },
    { name: '哈尔滨工业大学', region: '黑龙江省', tier: 't985', baoyan: '约30%', english: '六级500+', abroad: 'Top50' },
    { name: '西安交通大学', region: '陕西省', tier: 't985', baoyan: '约30%', english: '六级500+', abroad: 'Top50' }
  ];

  function renderHomeSchools() {
    const tbody = $('home-school-tbody');
    if (!tbody) return;
    const all = (window.SCHOOLS_DATA && window.SCHOOLS_DATA.schools) || [];
    tbody.innerHTML = TOP_SCHOOLS.map(s => {
      const inOfficial = all.some(sch => sch.name === s.name);
      const tierText = s.tier === 'c9' ? 'C9' : '985';
      return `<tr>
        <td><b>${esc(s.name)}</b>${inOfficial ? ' ✓' : ''}<br><span class="text-muted">${esc(s.region)}</span></td>
        <td><span class="tier-badge ${s.tier}">${tierText}</span></td>
        <td>${esc(s.english)}<br><span class="text-muted">${esc(s.abroad)}</span></td>
      </tr>`;
    }).join('');
  }

  // ===== 面试预览 =====
  function renderHomeInterview() {
    const tbody = $('home-interview-tbody');
    if (!tbody) return;
    const samples = [
      { school: '清华大学', type: '计算机', count: 23, type2: '综合' },
      { school: '北京大学', type: '光华', count: 18, type2: '综合' },
      { school: '复旦', type: '经济', count: 15, type2: '英语' },
      { school: '上海交大', type: '安泰', count: 14, type2: '综合' },
      { school: '浙江大学', type: '计算机', count: 12, type2: '英语' }
    ];
    tbody.innerHTML = samples.map(s => `<tr>
      <td><b>${esc(s.school)}</b><br><span class="text-muted">${esc(s.type)}</span></td>
      <td><span class="status-tag normal">${s.count} 题</span></td>
      <td>${esc(s.type2)}</td>
    </tr>`).join('');
  }

  // ===== filter-pill 切换 =====
  function setupPillFilters() {
    document.querySelectorAll('.filter-pills-inline').forEach(group => {
      group.addEventListener('click', e => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;
        group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  // ===== 启动 =====
  setupMatrix();
  renderHomeNotices();
  renderHomeSchools();
  renderHomeInterview();
  setupPillFilters();

  console.log('[Home v4.0] 渲染完成');
})();