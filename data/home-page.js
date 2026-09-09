/* 首页 v4.0 渲染器 */

(function() {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // ===== 2 维矩阵弹窗 =====
  const MATRIX_DETAIL = {
    '1-1': { title: '大一 · 寒假（1-2 月）', actions: ['了解保研是什么（看通识第 1 章）', '设定 GPA 目标（前 30%）', '规划 4 年节奏'] },
    '1-2': { title: '大一 · 春季（3-5 月）', actions: ['选课提绩（核心专业课拿高分）', '关注学生工作/社团', '了解学长学姐路径'] },
    '1-3': { title: '大一 · 暑期（6-8 月）', actions: ['进课题组/实验室', '参加暑期学校/活动', '尝试大创申报'] },
    '1-4': { title: '大一 · 9-12 月', actions: ['期末考试冲刺', '复盘全年：差距在哪？', '准备六级/英语学习'] },

    '2-1': { title: '大二 · 寒假（1-2 月）', actions: ['六级刷分（550+）', '考虑雅思/托福备考', '做科研项目规划'] },
    '2-2': { title: '大二 · 春季（3-5 月）', actions: ['大创立项/论文初稿', 'GPA 维持前 20%', '关注夏令营时间（观摩）'] },
    '2-3': { title: '大二 · 暑期（6-8 月）', actions: ['参加保研夏令营观摩', '完成大创中期', '英语持续提升'] },
    '2-4': { title: '大二 · 9-12 月', actions: ['阶段复盘', '确定 5+ 所目标院校', '开始准备个人陈述'] },

    '3-1': { title: '大三 · 寒假（1-2 月）', actions: ['★黄金期：开始准备材料', 'PS 终稿（5 版）', '推荐信找 2 位老师', '简历 + 成绩单盖章'] },
    '3-2': { title: '大三 · 春季（3-5 月）', actions: ['★投递 5+ 所夏令营', '关注目标院校截止日', '准备 1-2 段自我介绍（中/英）'] },
    '3-3': { title: '大三 · 暑期（6-8 月）', actions: ['★参营拿 offer', '机考/面试准备', '失败院校准备预推免'] },
    '3-4': { title: '大三 · 9-12 月 · 冲刺', actions: ['★ 9.22 推免系统填报', '9.28 之后复试录取', '★保研失败 → 9 月转留学', '★ 兜底：双保险' ] },

    '4-1': { title: '大四 · 寒假（1-2 月）', actions: ['系统填报 + 录取确认', '联系导师', '开始研究生规划'] },
    '4-2': { title: '大四 · 春季（3-5 月）', actions: ['★保研 vs 留学最终决定', '留学申请截止（如澳洲/英国）', '办理签证'] },
    '4-3': { title: '大四 · 暑期（6-8 月）', actions: ['★保研：本科毕业设计', '★留学：语言班/准备出国', '注册报到准备'] },
    '4-4': { title: '大四 · 9-12 月', actions: ['★保研：注册研究生', '★留学：出国就读', '★双保险：择一走深'] }
  };

  function setupMatrix() {
    const modal = $('matrix-modal');
    const title = $('matrix-modal-title');
    const list = $('matrix-modal-list');
    const close = $('matrix-modal-close');

    document.querySelectorAll('.matrix-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const grade = cell.dataset.grade;
        const time = cell.dataset.time;
        const detail = MATRIX_DETAIL[`${grade}-${time}`];
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