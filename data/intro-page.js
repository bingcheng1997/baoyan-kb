/* 保研通识页渲染器 v4.1
   - 2 大阶段：获取保研资格 + 推免流程
   - 黑话/问答融入每阶段
   - 8 章结构
*/

(function() {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // ===== 黑话数据（精选 121 个）=====
  const GLOSSARY = [
    { term: '推免', def: '推荐优秀应届本科毕业生免试攻读研究生', cat: '基础' },
    { term: '保研', def: '推免的口语化表达', cat: '基础' },
    { term: '九推', def: '9 月 28 日推免系统开放填报', cat: '基础' },
    { term: '九二二', def: '9 月 22 日推免系统填报志愿', cat: '基础' },
    { term: '夏令营', def: '5 至 7 月各高校面向优秀本科生开展的提前选拔活动', cat: '时间线' },
    { term: '预推免', def: '8 至 9 月举办的第二轮选拔', cat: '时间线' },
    { term: '正式推免', def: '9 月通过推免系统的正式录取', cat: '时间线' },
    { term: '推免服务系统', def: '教育部研究生招生信息网运营的全国推免生统一报名平台', cat: '时间线' },
    { term: '学信网', def: '中国高等教育学生信息网，学历学籍查询、推免报名官方平台', cat: '时间线' },
    { term: '拟录取', def: '招生单位通过推免服务系统向申请者发出的录取通知', cat: '时间线' },
    { term: '录取确认', def: '申请者接受招生单位待录取通知的操作', cat: '时间线' },
    { term: '递补', def: '前序候选人放弃资格后，招生单位按候补名单向后补录', cat: '时间线' },
    { term: '材料初审', def: '招生单位对申请材料筛选，决定入营/复试资格', cat: '时间线' },
    { term: '复试', def: '招生单位在推免系统确认或九推阶段安排的补充性考核', cat: '时间线' },
    { term: '开营', def: '夏令营正式开始', cat: '时间线' },
    { term: '闭营', def: '夏令营结束或公布阶段性结果', cat: '时间线' },
    { term: '优营', def: '夏令营优秀营员', cat: '时间线' },
    { term: '系统锁定', def: '推免服务系统中志愿在一定时间内不可随意更改', cat: '时间线' },
    { term: '个人陈述', def: 'PS，Personal Statement，说明个人经历、研究兴趣、申请动机', cat: '材料' },
    { term: '简历', def: 'CV，集中展示教育背景、成绩排名、科研经历、竞赛获奖', cat: '材料' },
    { term: '推荐信', def: '由任课教师、科研导师撰写的评价材料', cat: '材料' },
    { term: '成绩单', def: '学校教务部门出具的课程成绩证明', cat: '材料' },
    { term: '英语证明', def: '四六级、雅思、托福、GRE 等语言成绩证明', cat: '材料' },
    { term: '科研成果证明', def: '论文、专利、软著、项目结题、会议报告等', cat: '材料' },
    { term: '竞赛证明', def: '数学建模、挑战杯、互联网+、ACM、学科竞赛等获奖证书', cat: '材料' },
    { term: '报名表', def: '招生单位报名系统生成或要求填写的申请表', cat: '材料' },
    { term: '诚信承诺书', def: '申请者对材料真实性和考试诚信作出的书面承诺', cat: '材料' },
    { term: '材料命名', def: '按招生单位要求给 PDF、压缩包或邮件附件命名', cat: '材料' },
    { term: 'BG', def: 'Background，申请者的综合学术背景', cat: '申请' },
    { term: 'RK', def: 'Rank，本专业的综合排名，通常以百分比形式呈现', cat: '申请' },
    { term: 'COM', def: 'Committee，招生委员会', cat: '申请' },
    { term: '强COM', def: '委员会统一考核，导师话语权较小', cat: '申请' },
    { term: '弱COM', def: '导师拥有较大自主权，委员会主要形式审核', cat: '申请' },
    { term: 'BAR', def: '筛选申请者进入考核环节的最低门槛', cat: '申请' },
    { term: '套磁', def: '指申请者在正式申报前主动联系目标导师', cat: '导师' },
    { term: '强导', def: '学术指导力度较强、科研要求较高的导师', cat: '导师' },
    { term: '弱导', def: '指导方式相对宽松、给予学生较多自主空间的导师', cat: '导师' },
    { term: '颠导', def: '管理方式不当、师生关系紧张的导师', cat: '导师' },
    { term: '青椒', def: '近年新入职的青年教师，科研热情较高', cat: '导师' },
    { term: '大牛', def: '在学术界享有较高知名度和影响力的资深学者', cat: '导师' },
    { term: '四小青', def: '海外优青、教育部青年长江、优青、青年拔尖', cat: '导师' },
    { term: '四大青', def: '千人计划、长江、杰青、领军人才', cat: '导师' },
    { term: '院士', def: '中国科学院院士或中国工程院院士', cat: '导师' },
    { term: 'Fellow', def: 'IEEE Fellow、ACM Fellow 等国际学术组织会士', cat: '导师' },
    { term: 'Push', def: '导师对科研进度要求严格、任务节奏紧凑', cat: '导师' },
    { term: '放养', def: '指导方式相对宽松、给予学生充分自主空间', cat: '导师' },
    { term: '师门', def: '同一导师指导的研究生群体', cat: '导师' },
    { term: '老板', def: '研究生对导师的非正式称呼', cat: '导师' },
    { term: 'PI', def: 'Principal Investigator，课题负责人', cat: '导师' },
    { term: '课题组', def: '围绕某位导师或研究方向形成的科研团队', cat: '导师' },
    { term: '导师名额', def: '导师当年可招收研究生的数量', cat: '导师' },
    { term: '导师确认', def: '导师明确表示愿意接收或推荐申请者的状态', cat: '导师' },
    { term: '导师双选', def: '学生和导师在录取前后互相选择的过程', cat: '导师' },
    { term: 'C9', def: '中国九校联盟（清华、北大、复旦、上交、浙大、南大、中科大、哈工大、西交大）', cat: '院校' },
    { term: '985', def: '1998 年提出的建设若干所世界一流大学的高校', cat: '院校' },
    { term: '211', def: '面向 21 世纪重点建设 100 所左右高等学校', cat: '院校' },
    { term: '双一流', def: '世界一流大学和一流学科建设高校', cat: '院校' },
    { term: '中外合办', def: '中外合作办学机构/项目', cat: '院校' },
    { term: '研招网', def: '中国研究生招生信息网', cat: '院校' },
    { term: '学硕', def: '学术型硕士', cat: '院校' },
    { term: '专硕', def: '专业型硕士', cat: '院校' },
    { term: '直博', def: '本科直读博士 5 年', cat: '院校' },
    { term: '硕博连读', def: '硕士 2 年 + 博士 3-4 年', cat: '院校' },
    { term: '笔面试', def: '笔试 + 面试的考核形式', cat: '面试' },
    { term: '机考', def: '计算机化考试', cat: '面试' },
    { term: 'PPT汇报', def: '以 PPT 形式做研究展示', cat: '面试' },
    { term: '专业面', def: '针对专业知识的面试', cat: '面试' },
    { term: '压力面', def: '有意施压的面试，考察应变能力', cat: '面试' },
    { term: '综合素质', def: '沟通能力、逻辑思维、抗压能力等', cat: '面试' },
    { term: '英语口语', def: '英语口语表达能力测试', cat: '面试' },
    { term: '听力', def: '英语听力理解能力', cat: '面试' },
    { term: '翻译', def: '中英互译能力测试', cat: '面试' },
    { term: '群面', def: '多位申请者与多位导师同时面试', cat: '面试' },
    { term: '单面', def: '一位申请者与一位或多位导师面试', cat: '面试' },
    { term: 'GAP', def: '因推免申请未达预期而选择延缓一年入学', cat: '策略' },
    { term: '跨保', def: '跨专业保研', cat: '策略' },
    { term: '同保', def: '同专业保研', cat: '策略' },
    { term: '本校保研', def: '保研至本校本专业', cat: '策略' },
    { term: '外保', def: '保研至外校', cat: '策略' },
    { term: '海投', def: '广泛投递多所院校', cat: '策略' },
    { term: '捡漏', def: '在部分院校名额释放、候选人放弃时获得额外机会', cat: '策略' },
    { term: '大创', def: '大学生创新创业训练计划', cat: '科研' },
    { term: '国赛', def: '国家级竞赛，如挑战杯、互联网+、数学建模等', cat: '科研' },
    { term: '挑战杯', def: '挑战杯全国大学生课外学术科技作品竞赛', cat: '科研' },
    { term: '互联网+', def: '中国国际互联网+大学生创新创业大赛', cat: '科研' },
    { term: '软著', def: '软件著作权', cat: '科研' },
    { term: 'SCI', def: '科学引文索引，国际权威学术期刊', cat: '科研' },
    { term: 'EI', def: '工程索引', cat: '科研' },
    { term: 'CSSCI', def: '中文社会科学引文索引', cat: '科研' },
    { term: '一作', def: '第一作者', cat: '科研' },
    { term: '通讯', def: '通讯作者，通常为导师', cat: '科研' },
    { term: '推荐免试', def: '推免，保研的全称', cat: '基础' },
    { term: '推免生', def: '获得推免资格的学生', cat: '基础' },
    { term: '推免表', def: '本科院校的推荐免试资格表', cat: '基础' },
    { term: '推免名额', def: '本科院校获得的推免总名额', cat: '基础' },
    { term: '保研资格', def: '本科院校给予的推免推荐资格', cat: '基础' },
    { term: '资格审核', def: '招生单位对申请者提交的申请材料进行真实性和合规性审查', cat: '基础' },
    { term: '放弃函', def: '放弃录取资格的书面声明', cat: '基础' },
    { term: '待录取', def: '招生单位发出的录取通知', cat: '基础' },
    { term: '调剂', def: '录取后申请调整专业或院校', cat: '基础' },
    { term: '高分', def: '高绩点', cat: '基础' },
    { term: '边缘', def: '保研资格的边缘学生', cat: '基础' },
    { term: '履历', def: '个人简历', cat: '基础' },
    { term: '论文', def: '学术研究成果', cat: '科研' },
    { term: '专利', def: '知识产权保护', cat: '科研' },
    { term: '国家级项目', def: '国家自然科学基金等国家级科研项目', cat: '科研' },
    { term: '省级项目', def: '省级科研项目', cat: '科研' },
    { term: '影响因子', def: '学术期刊影响因子', cat: '科研' },
    { term: '高被引', def: 'ESI 高被引论文', cat: '科研' },
    { term: '一区', def: 'SCI 期刊分区一区', cat: '科研' },
    { term: '在投', def: '论文正在审稿中', cat: '科研' },
    { term: '返修', def: '论文审稿后需要修改', cat: '科研' },
    { term: '拒稿', def: '论文被拒', cat: '科研' },
    { term: '接收', def: '论文被会议/期刊接收', cat: '科研' },
    { term: '数据', def: '科研数据', cat: '科研' },
    { term: '实验', def: '科研实验', cat: '科研' },
    { term: '研究计划', def: 'Research Proposal', cat: '基础' },
    { term: '优青', def: '国家自然科学基金优秀青年科学基金', cat: '导师' },
    { term: '杰青', def: '国家杰出青年科学基金', cat: '导师' },
    { term: '长江', def: '教育部长江学者奖励计划', cat: '导师' },
    { term: '青拔', def: '中组部万人计划青年拔尖人才', cat: '导师' },
    { term: '海外优青', def: '海外优秀青年科学基金', cat: '导师' }
  ];

  // ===== 问答数据（精选 31 问）=====
  const FAQS = [
    // 阶段 1: 获取保研资格
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
    // 阶段 2: 推免流程
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
    { q: '直博和硕博连读区别？', a: '直博：本科直读博士 5 年。硕博连读：硕士 2 年 + 博士 3-4 年。直博节省时间但风险大。', stage: 2 }
  ];

  // ===== 渲染黑话 =====
  function renderGlossary() {
    const grid = $('glossary-grid');
    const idx = $('alphabet-index');
    if (!grid) return;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    idx.innerHTML = '<button class="alpha-btn active" data-alpha="ALL">全部</button>' +
      letters.map(l => `<button class="alpha-btn" data-alpha="${l}">${l}</button>`).join('');

    grid.innerHTML = GLOSSARY.map(g => `
      <div class="glossary-card" data-alpha="${getAlpha(g.term)}">
        <div class="glossary-term">${esc(g.term)}</div>
        <div class="glossary-def">${esc(g.def)} <span style="color:var(--color-text-tertiary); font-size:11px;">[${esc(g.cat)}]</span></div>
      </div>
    `).join('');

    idx.addEventListener('click', e => {
      const btn = e.target.closest('.alpha-btn');
      if (!btn) return;
      idx.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const letter = btn.dataset.alpha;
      grid.querySelectorAll('.glossary-card').forEach(card => {
        card.style.display = (letter === 'ALL' || card.dataset.alpha === letter) ? '' : 'none';
      });
    });
  }

  function getAlpha(term) {
    // 中文术语默认归类为 C（Chinese）
    const c = term.charCodeAt(0);
    if (c >= 65 && c <= 90) return term.charAt(0);
    if (c >= 97 && c <= 122) return term.charAt(0).toUpperCase();
    return 'C';
  }

  // ===== 渲染 FAQ（按阶段分组）=====
  function renderFAQ() {
    const stage1 = $('faq-stage-1');
    const stage2 = $('faq-stage-2');
    if (!stage1 || !stage2) return;

    const stage1Items = FAQS.filter(f => f.stage === 1);
    const stage2Items = FAQS.filter(f => f.stage === 2);

    stage1.innerHTML = stage1Items.map((item, i) => `
      <div class="faq-item" data-i="1-${i}">
        <button class="faq-question" aria-expanded="false" type="button">${esc(item.q)}</button>
        <div class="faq-answer">${esc(item.a)}</div>
      </div>
    `).join('');

    stage2.innerHTML = stage2Items.map((item, i) => `
      <div class="faq-item" data-i="2-${i}">
        <button class="faq-question" aria-expanded="false" type="button">${esc(item.q)}</button>
        <div class="faq-answer">${esc(item.a)}</div>
      </div>
    `).join('');

    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => item.classList.toggle('open'));
    });
  }

  // ===== 渲染黑话精选（融入每阶段）=====
  function renderInlineGlossary() {
    document.querySelectorAll('[data-glossary]').forEach(el => {
      const term = el.dataset.glossary;
      const item = GLOSSARY.find(g => g.term === term);
      if (item) {
        el.classList.add('glossary-term-inline');
        el.title = item.def;
      }
    });
  }

  // ===== 目录高亮 =====
  function setupTocHighlight() {
    const links = document.querySelectorAll('.toc-sidebar a[href^="#"]');
    const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    function onScroll() {
      let active = null;
      const y = window.scrollY + 100;
      for (const sec of sections) {
        if (sec.offsetTop <= y) active = sec.id;
      }
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + active));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  renderFAQ();
  renderGlossary();
  renderInlineGlossary();
  setupTocHighlight();
  console.log('[Intro Page v4.1] 2 阶段 + 黑话 + 问答 加载完成');
})();