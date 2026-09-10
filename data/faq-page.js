/* 百问百答独立页 · 31 问答 + 阶段筛选 + 搜索 */

(function() {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  const FAQS = [
    // 阶段 1
    { q: '保研什么时候开始准备？', a: '大一就要开始。最晚大三下学期（5 月）必须完成材料投递。建议大一保持 GPA 前 30%，大二开始科研立项。', stage: 1 },
    { q: '保研的硬指标是什么？', a: '6 项：① 绩点排名（前 20-30%）② 英语（六级 425+）③ 科研（论文/项目）④ 竞赛（挑战杯/互联网+等）⑤ 品德（无违规）⑥ 资格（本校有推免名额）', stage: 1 },
    { q: 'GPA 多少能保研？', a: '985 普遍要求前 20-30%。C9 要求前 5-10%。双非头部要求前 5%。', stage: 1 },
    { q: '六级多少分够用？', a: 'C9：550+ 隐性门槛。985 头部：500-520。211：425-500。双非：425+。', stage: 1 },
    { q: '科研和竞赛哪个更重要？', a: '对 C9：科研（论文）> 竞赛（国赛一等奖）> 绩点。对 985 头部：绩点 > 科研 > 竞赛。', stage: 1 },
    { q: '怎么选科研项目？', a: '3 步：① 找本科院校的老师（先做助研）② 进课题组做 1-2 个项目 ③ 争取论文/专利产出。', stage: 1 },
    { q: '挂科了还能保研吗？', a: '挂科会撤销推免资格。补救：申请补考或重修，确保不挂科。', stage: 1 },
    { q: '本校没有推免资格怎么办？', a: '不能保研，只能考研或留学。少数院校允许跨校推荐。', stage: 1 },
    { q: '保研和考研能同时准备吗？', a: '不建议。保研 9 月出结果，考研 12 月。时间冲突。', stage: 1 },
    { q: '本科生如何参加导师的科研项目？', a: '① 关注本校老师的研究方向 ② 主动找老师（邮件/办公室）③ 从最基础的工作开始（整理资料/做实验）④ 争取成为署名作者', stage: 1 },
    // 阶段 2
    { q: '夏令营什么时候开始？', a: '5-6 月投递，6-8 月参营。提前准备个人陈述、推荐信、成绩单等材料。', stage: 2 },
    { q: '夏令营和预推免能同时报吗？', a: '可以。夏令营 6-8 月（拿 offer），预推免 8-9 月（补录）。时间不冲突，建议同时准备。', stage: 2 },
    { q: '预推免要不要联系导师？', a: '强烈建议。套磁是双向选择，导师确认可大幅提升录取概率。', stage: 2 },
    { q: '推荐信要找谁写？', a: '科研导师（最重要）+ 课程老师（任课或毕设）+ 行政老师（可选）。至少 2 位。', stage: 2 },
    { q: '个人陈述要写多少字？', a: '中文 800-1500 字，英文 500-800 字。5 版（按学校调整侧重点）。', stage: 2 },
    { q: '面试会问什么？', a: '专业问题（基础课 + 方向热点）、科研细节（你做的项目）、英语口语、综合素质。', stage: 2 },
    { q: '机考考什么？', a: '计算机系：算法 + 数据结构 + 数学。其他：看院校公告。一般 2-3 小时。', stage: 2 },
    { q: '推免系统怎么填？', a: '9.22 开放，9.28 平行志愿。3 个平行志愿，按学校要求填报。注意志愿锁定。', stage: 2 },
    { q: '录取确认能不能放弃？', a: '可以，但有记录。建议一旦确认就尽量不放弃，否则影响次年。', stage: 2 },
    { q: '985 边缘学生怎么保研？', a: '3 步：①GPA 冲到前 20% ②科研 1 项（论文/竞赛）③英语 550+。可考虑双保险。', stage: 2 },
    { q: '跨专业保研难吗？', a: '难但可能。需要：①目标专业核心课成绩 ②跨专业科研 ③跨专业理由清晰。', stage: 2 },
    { q: '英语六级没过能保研吗？', a: '可以，但劣势明显。建议先考雅思 6.5+ 弥补。', stage: 2 },
    { q: '双非能保到清北吗？', a: '可以，但难度大。教育部数据显示，每年都有双非头部学生保研至 C9，核心是 GPA 5%、科研突出（论文/国赛）、英语 6+。', stage: 2 },
    { q: '保研失败怎么转留学？', a: '9 月准备留学已经晚（英国已截止），但澳洲/美国/香港仍有滚动录取。雅思 6.5+ 即可申请。', stage: 2 },
    { q: '夏令营没过还能保研吗？', a: '可以。预推免 + 九推还有机会。建议夏令营投 5+ 所，预推免再投 3 所。', stage: 2 },
    { q: '保研可以换专业吗？', a: '可以（跨保），但需要：①目标专业核心课 ②目标专业相关科研 ③ 院校同意。', stage: 2 },
    { q: '夏令营优秀营员一定录取吗？', a: '不一定。优营是优先权，最终还要看 9 月系统填报 + 复试。但优营录取率 80%+。', stage: 2 },
    { q: '保研面试要穿正装吗？', a: '不必正装，但整洁得体。建议：衬衫 + 西裤/休闲裤 + 干净鞋子。', stage: 2 },
    { q: '导师不喜欢我怎么办？', a: '1. 看是不是真不喜欢（可能只是风格不同）2. 换导师（联系 2-3 位备选）3. 找院里教务协调', stage: 2 },
    { q: '直博和硕博连读区别？', a: '直博：本科直读博士 5 年。硕博连读：硕士 2 年 + 博士 3-4 年。直博节省时间但风险大。', stage: 2 },
    { q: '保研 vs 考研 vs 留学哪个好？', a: '看 GPA + 英语 + 经济。GPA 80%+ 优先保研。经济允许 50 万+ 优先留学。建议双保险。', stage: 2 }
  ];

  const state = { stage: 'all', search: '' };

  function render() {
    const list = $('faq-list');
    const count = $('faq-count');
    if (!list) return;

    const filtered = FAQS.filter(f => {
      if (state.stage !== 'all' && String(f.stage) !== state.stage) return false;
      if (state.search && !f.q.toLowerCase().includes(state.search.toLowerCase()) && !f.a.toLowerCase().includes(state.search.toLowerCase())) return false;
      return true;
    });

    list.innerHTML = filtered.length
      ? filtered.map((item, i) => `
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false" type="button">
            <span class="faq-stage-tag stage-${item.stage}">${item.stage === 1 ? '阶段 1' : '阶段 2'}</span>
            ${esc(item.q)}
          </button>
          <div class="faq-answer" role="region">${esc(item.a)}</div>
        </div>
      `).join('')
      : '<div style="text-align:center; padding:24px; color:var(--color-text-tertiary);">暂无符合条件的问题</div>';

    if (count) count.textContent = filtered.length;
  }

  function setupStageFilter() {
    document.querySelectorAll('[data-filter-group="stage"]').forEach(group => {
      group.addEventListener('click', e => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;
        group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.stage = pill.dataset.value;
        render();
      });
    });
  }

  function setupSearch() {
    const search = $('faq-search');
    if (!search) return;
    search.addEventListener('input', () => {
      state.search = search.value.trim();
      render();
    });
  }

  function setupFaqToggle() {
    const list = $('faq-list');
    if (!list) return;
    list.addEventListener('click', e => {
      const item = e.target.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.toggle('open');
      const btn = item.querySelector('.faq-question');
      if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  setupStageFilter();
  setupSearch();
  setupFaqToggle();
  render();
  console.log('[FAQ Page] 已加载 ' + FAQS.length + ' 个问答');
})();