/* 保研通识页渲染器
   - 31 问答折叠
   - 121 黑话字母索引
   - 目录高亮
*/

(function() {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // ===== 31 问答数据 =====
  const FAQS = [
    { q: '保研什么时候开始准备？', a: '大一就要开始。最晚大三下学期（5 月）必须完成材料投递。建议大一保持 GPA 前 30%，大二开始科研立项。' },
    { q: '双非能保到清北吗？', a: '可以，但难度大。教育部数据显示，每年都有双非头部学生保研至 C9，核心是 GPA 5%、科研突出（论文/国赛）、英语 6+。' },
    { q: '六级多少分够用？', a: 'C9：550+ 隐性门槛。985 头部：500-520。211：425-500。双非：425+。' },
    { q: '科研和竞赛哪个更重要？', a: '对 C9：科研（论文）> 竞赛（国赛一等奖）> 绩点。对 985 头部：绩点 > 科研 > 竞赛。' },
    { q: '夏令营和预推免能同时报吗？', a: '可以。夏令营 6-8 月（拿 offer），预推免 8-9 月（补录）。时间不冲突，建议同时准备。' },
    { q: '保研失败怎么转留学？', a: '9 月准备留学已经晚（英国已截止），但澳洲/美国/香港仍有滚动录取。雅思 6.5+ 即可申请。' },
    { q: '大几开始准备保研？', a: '大一：了解 + 提绩点。大二：科研立项 + 英语。大三：投递材料。大四：录取确认。' },
    { q: 'GPA 多少能保研？', a: '985 普遍要求前 20-30%。C9 要求前 5-10%。双非头部要求前 5%。' },
    { q: '夏令营要怎么报名？', a: '5-6 月关注各院校研究生院官网，按要求提交材料（PS + 简历 + 成绩单 + 推荐信 + 英语证明）。' },
    { q: '预推免要不要联系导师？', a: '强烈建议。套磁是双向选择，导师确认可大幅提升录取概率。' },
    { q: '推荐信要找谁写？', a: '科研导师（最重要）+ 课程老师（任课或毕设）+ 行政老师（可选）。至少 2 位。' },
    { q: '个人陈述要写多少字？', a: '中文 800-1500 字，英文 500-800 字。5 版（按学校调整侧重点）。' },
    { q: '面试会问什么？', a: '专业问题（基础课 + 方向热点）、科研细节（你做的项目）、英语口语、综合素质。' },
    { q: '机考考什么？', a: '计算机系：算法 + 数据结构 + 数学。其他：看院校公告。一般 2-3 小时。' },
    { q: '推免系统怎么填？', a: '9.22 开放，9.28 平行志愿。3 个平行志愿，按学校要求填报。注意志愿锁定。' },
    { q: '录取确认能不能放弃？', a: '可以，但有记录。建议一旦确认就尽量不放弃，否则影响次年。' },
    { q: '985 边缘学生怎么保研？', a: '3 步：①GPA 冲到前 20% ②科研 1 项（论文/竞赛）③英语 550+。可考虑双保险。' },
    { q: '跨专业保研难吗？', a: '难但可能。需要：①目标专业核心课成绩 ②跨专业科研 ③跨专业理由清晰。' },
    { q: '英语六级没过能保研吗？', a: '可以，但劣势明显。建议先考雅思 6.5+ 弥补。' },
    { q: '保研和考研能同时准备吗？', a: '不建议。保研 9 月出结果，考研 12 月。时间冲突。' },
    { q: '夏令营没过还能保研吗？', a: '可以。预推免 + 九推还有机会。建议夏令营投 5+ 所，预推免再投 3 所。' },
    { q: '直博和硕博连读区别？', a: '直博：本科直读博士 5 年。硕博连读：硕士 2 年 + 博士 3-4 年。直博节省时间但风险大。' },
    { q: '保研可以换专业吗？', a: '可以（跨保），但需要：①目标专业核心课 ②目标专业相关科研 ③ 院校同意。' },
    { q: '推免表是什么？', a: '本科院校发的"推荐优秀应届本科毕业生免试攻读研究生"资格表。需要学院盖章。' },
    { q: '保研资格被取消怎么办？', a: '常见原因：挂科、四级未过、违规。补救：与辅导员沟通，必要时考虑考研。' },
    { q: '保研和留学哪个好？', a: '看 GPA + 英语 + 经济。GPA 80%+ 优先保研。经济允许 50 万+ 优先留学。建议双保险。' },
    { q: '保研要看本科出身吗？', a: '看学校层次，但不完全。985 边缘也能进 C9（看科研 + 英语）。双非可进 C9（极难但有先例）。' },
    { q: '硕士补助多少？', a: '学硕 600-1000/月 + 奖学金。专硕不等。导师补助另算。C9 普遍高一些。' },
    { q: '夏令营优秀营员一定录取吗？', a: '不一定。优营是优先权，最终还要看 9 月系统填报 + 复试。但优营录取率 80%+。' },
    { q: '保研面试要穿正装吗？', a: '不必正装，但整洁得体。建议：衬衫 + 西裤/休闲裤 + 干净鞋子。' },
    { q: '导师不喜欢我怎么办？', a: '1. 看是不是真不喜欢（可能只是风格不同）2. 换导师（联系 2-3 位备选）3. 找院里教务协调' }
  ];

  // ===== 121 黑话数据 =====
  const GLOSSARY = [
    { term: '套磁', def: '指申请者在正式申报前主动联系目标导师，通过邮件或其他方式进行学术交流', cat: '导师', alpha: 'T' },
    { term: '强导', def: '指学术指导力度较强、科研要求较高的导师，适合有明确科研志向的学生', cat: '导师', alpha: 'Q' },
    { term: '弱导', def: '指指导方式相对宽松、给予学生较多自主空间的导师', cat: '导师', alpha: 'R' },
    { term: '颠导', def: '指管理方式不当、师生关系紧张的导师', cat: '导师', alpha: 'D' },
    { term: '青椒', def: '近年新入职的青年教师，科研热情较高', cat: '导师', alpha: 'Q' },
    { term: '大牛', def: '在学术界享有较高知名度和影响力的资深学者', cat: '导师', alpha: 'D' },
    { term: '院士', def: '中国科学院院士或中国工程院院士', cat: '导师', alpha: 'Y' },
    { term: 'PI', def: 'Principal Investigator，课题负责人或实验室负责人', cat: '导师', alpha: 'P' },
    { term: '课题组', def: '围绕某位导师或研究方向形成的科研团队', cat: '导师', alpha: 'K' },
    { term: '夏令营', def: '5 至 7 月各高校面向优秀本科生开展的提前选拔活动', cat: '时间线', alpha: 'X' },
    { term: '预推免', def: '8 至 9 月举办的第二轮选拔', cat: '时间线', alpha: 'Y' },
    { term: '推免服务系统', def: '教育部研究生招生信息网运营的全国推免生统一报名平台', cat: '时间线', alpha: 'T' },
    { term: '九推', def: '9 月 28 日推免系统开放填报', cat: '时间线', alpha: 'J' },
    { term: '九推', def: '9.22 推免系统填报志愿', cat: '时间线', alpha: 'J' },
    { term: '学信网', def: '中国高等教育学生信息网，学历学籍查询、推免报名官方平台', cat: '时间线', alpha: 'X' },
    { term: '材料初审', def: '招生单位对申请材料筛选，决定入营/复试资格', cat: '材料', alpha: 'C' },
    { term: '复试', def: '招生单位在推免系统确认阶段安排的补充性考核', cat: '材料', alpha: 'F' },
    { term: '个人陈述', def: 'PS，Personal Statement，用于说明个人经历、研究兴趣、申请动机', cat: '材料', alpha: 'G' },
    { term: '简历', def: 'CV，集中展示教育背景、成绩排名、科研经历、竞赛获奖', cat: '材料', alpha: 'J' },
    { term: '推荐信', def: '由任课教师、科研导师或项目指导老师撰写的评价材料', cat: '材料', alpha: 'T' },
    { term: '成绩单', def: '学校教务部门出具的课程成绩证明，需加盖公章', cat: '材料', alpha: 'C' },
    { term: '英语证明', def: '四六级、雅思、托福、GRE 等语言成绩证明', cat: '材料', alpha: 'Y' },
    { term: 'BG', def: 'Background，指申请者的综合学术背景', cat: '申请', alpha: 'B' },
    { term: 'RK', def: 'Rank，本专业综合排名百分比', cat: '申请', alpha: 'R' },
    { term: 'COM', def: 'Committee，招生委员会', cat: '申请', alpha: 'C' },
    { term: 'BAR', def: '筛选申请者进入考核的最低门槛', cat: '申请', alpha: 'B' },
    { term: '拟录取', def: '招生单位通过推免服务系统向申请者发出的录取通知', cat: '申请', alpha: 'N' },
    { term: '递补', def: '前序候选人放弃后，招生单位向后补录', cat: '申请', alpha: 'D' },
    { term: '开营', def: '夏令营正式开始', cat: '申请', alpha: 'K' },
    { term: '闭营', def: '夏令营结束或公布阶段性结果', cat: '申请', alpha: 'B' },
    { term: '报名入口', def: '招生单位指定的申请系统、问卷、邮箱或研招平台链接', cat: '申请', alpha: 'B' },
    { term: '论文', def: '学术研究成果，正式发表或撰写中', cat: '科研', alpha: 'L' },
    { term: '专利', def: '知识产权保护，包括发明专利、实用新型、外观设计', cat: '科研', alpha: 'Z' },
    { term: '国赛', def: '国家级竞赛，如挑战杯、互联网+、数学建模等', cat: '科研', alpha: 'G' },
    { term: '大创', def: '大学生创新创业训练计划', cat: '科研', alpha: 'D' },
    { term: '互联网+', def: '中国国际"互联网+"大学生创新创业大赛', cat: '科研', alpha: 'H' },
    { term: '挑战杯', def: '"挑战杯"全国大学生课外学术科技作品竞赛', cat: '科研', alpha: 'T' },
    { term: '软著', def: '软件著作权', cat: '科研', alpha: 'R' },
    { term: '跨保', def: '跨专业保研', cat: '策略', alpha: 'K' },
    { term: '同保', def: '同专业保研', cat: '策略', alpha: 'T' },
    { term: '本校保研', def: '保研至本校本专业', cat: '策略', alpha: 'B' },
    { term: '捡漏', def: '在部分院校名额释放、候选人放弃时获得额外机会', cat: '策略', alpha: 'J' },
    { term: '强com', def: '强委员会，招生委员会话语权大', cat: '策略', alpha: 'Q' },
    { term: '弱com', def: '弱委员会，导师话语权大', cat: '策略', alpha: 'R' },
    { term: '海投', def: '广泛投递多所院校', cat: '策略', alpha: 'H' },
    { term: '海投不海面', def: '广泛投递但只面试少数', cat: '策略', alpha: 'H' },
    { term: 'C9', def: '中国九校联盟（清华、北大、复旦、上交、浙大、南大、中科大、哈工大、西交大）', cat: '院校', alpha: 'C' },
    { term: '985', def: '1998 年 5 月提出的建设若干所世界一流大学的高校', cat: '院校', alpha: 'J' },
    { term: '211', def: '面向 21 世纪重点建设 100 所左右高等学校', cat: '院校', alpha: 'E' },
    { term: '双一流', def: '世界一流大学和一流学科建设高校', cat: '院校', alpha: 'S' },
    { term: '中外合办', def: '中外合作办学机构/项目', cat: '院校', alpha: 'Z' },
    { term: '研招网', def: '中国研究生招生信息网', cat: '院校', alpha: 'Y' },
    { term: '学硕', def: '学术型硕士', cat: '院校', alpha: 'X' },
    { term: '专硕', def: '专业型硕士', cat: '院校', alpha: 'Z' },
    { term: '直博', def: '本科直读博士', cat: '院校', alpha: 'Z' },
    { term: '笔试', def: '机考或书面考试', cat: '面试', alpha: 'B' },
    { term: '机考', def: '计算机化考试', cat: '面试', alpha: 'J' },
    { term: 'PPT汇报', def: '以 PPT 形式做研究展示', cat: '面试', alpha: 'P' },
    { term: '专业面', def: '针对专业知识的面试', cat: '面试', alpha: 'Z' },
    { term: '压力面', def: '有意施压的面试，考察应变能力', cat: '面试', alpha: 'Y' },
    { term: '综合素质', def: '沟通能力、逻辑思维、抗压能力等', cat: '面试', alpha: 'Z' },
    { term: '口语', def: '英语口语表达能力', cat: '面试', alpha: 'K' },
    { term: '听力', def: '英语听力理解能力', cat: '面试', alpha: 'T' },
    { term: '翻译', def: '中英互译能力测试', cat: '面试', alpha: 'F' },
    { term: '英语口语面试', def: '以英语进行自我介绍和问答', cat: '面试', alpha: 'Y' },
    { term: '导师面', def: '与意向导师单独交流', cat: '面试', alpha: 'D' },
    { term: '群面', def: '多位申请者与多位导师同时面试', cat: '面试', alpha: 'Q' },
    { term: '单面', def: '一位申请者与一位或多位导师面试', cat: '面试', alpha: 'D' },
    { term: '优营', def: '夏令营优秀营员', cat: '申请', alpha: 'Y' },
    { term: '优秀营员', def: '夏令营表现优异的学生', cat: '申请', alpha: 'Y' },
    { term: '系统锁定', def: '推免系统中志愿、复试通知或待录取通知不可更改', cat: '申请', alpha: 'X' },
    { term: '待录取', def: '招生单位发出的录取通知', cat: '申请', alpha: 'D' },
    { term: '放弃函', def: '放弃录取资格的书面声明', cat: '申请', alpha: 'F' },
    { term: '调剂', def: '录取后申请调整专业或院校', cat: '申请', alpha: 'T' },
    { term: '推荐免试', def: '推免，保研的全称', cat: '基础', alpha: 'T' },
    { term: '保研', def: '推荐优秀应届本科毕业生免试攻读研究生', cat: '基础', alpha: 'B' },
    { term: '推免', def: '同保研', cat: '基础', alpha: 'T' },
    { term: '免试', def: '免初试（笔试），直接进入复试或录取', cat: '基础', alpha: 'M' },
    { term: '推免生', def: '获得推免资格的学生', cat: '基础', alpha: 'T' },
    { term: '推免表', def: '本科院校的推荐免试资格表', cat: '基础', alpha: 'T' },
    { term: '推免名额', def: '本科院校获得的推免总名额', cat: '基础', alpha: 'T' },
    { term: '本校保研', def: '保研至本校', cat: '基础', alpha: 'B' },
    { term: '外保', def: '保研至外校', cat: '基础', alpha: 'W' },
    { term: '保研资格', def: '本科院校给予的推免推荐资格', cat: '基础', alpha: 'B' },
    { term: '推免复试', def: '推免系统确认阶段后的考核', cat: '基础', alpha: 'T' },
    { term: '直博生', def: '本科直博的学生', cat: '基础', alpha: 'Z' },
    { term: '硕博连读', def: '硕士+博士连续培养', cat: '基础', alpha: 'S' },
    { term: '本硕博', def: '本科-硕士-博士连读', cat: '基础', alpha: 'B' },
    { term: '研究计划', def: '研究计划书', cat: '基础', alpha: 'Y' },
    { term: '国家级项目', def: '国家自然科学基金等国家级科研项目', cat: '科研', alpha: 'G' },
    { term: '省级项目', def: '省级科研项目', cat: '科研', alpha: 'S' },
    { term: '校级项目', def: '校级科研项目', cat: '科研', alpha: 'X' },
    { term: 'SCI', def: '科学引文索引，国际权威学术期刊', cat: '科研', alpha: 'S' },
    { term: 'EI', def: '工程索引', cat: '科研', alpha: 'E' },
    { term: 'CSSCI', def: '中文社会科学引文索引', cat: '科研', alpha: 'C' },
    { term: '中文核心', def: '北京大学图书馆中文核心期刊', cat: '科研', alpha: 'Z' },
    { term: 'SCI一区', def: 'SCI 期刊分区一区', cat: '科研', alpha: 'S' },
    { term: 'SCI二区', def: 'SCI 期刊分区二区', cat: '科研', alpha: 'S' },
    { term: '影响因子', def: '学术期刊影响因子', cat: '科研', alpha: 'Y' },
    { term: '高被引', def: 'ESI 高被引论文', cat: '科研', alpha: 'G' },
    { term: '国际会议', def: '如 CVPR、ICML、NeurIPS 等顶级会议', cat: '科研', alpha: 'G' },
    { term: 'EI会议', def: '被 EI 检索的国际会议', cat: '科研', alpha: 'E' },
    { term: '接收', def: '论文被会议/期刊接收', cat: '科研', alpha: 'J' },
    { term: '在投', def: '论文正在审稿中', cat: '科研', alpha: 'Z' },
    { term: '返修', def: '论文审稿后需要修改', cat: '科研', alpha: 'F' },
    { term: '拒稿', def: '论文被拒', cat: '科研', alpha: 'J' },
    { term: '一作', def: '第一作者', cat: '科研', alpha: 'Y' },
    { term: '二作', def: '第二作者', cat: '科研', alpha: 'E' },
    { term: '通讯', def: '通讯作者，通常为导师', cat: '科研', alpha: 'T' },
    { term: '共同一作', def: '共同第一作者', cat: '科研', alpha: 'G' },
    { term: '学生一作', def: '学生为第一作者', cat: '科研', alpha: 'X' },
    { term: '数据', def: '数据', cat: '科研', alpha: 'S' },
    { term: '数据', def: '科研数据', cat: '科研', alpha: 'S' },
    { term: '放养', def: '导师给予学生充分自主空间的指导方式', cat: '导师', alpha: 'F' },
    { term: 'Push', def: '导师对科研进度要求严格、任务节奏紧凑', cat: '导师', alpha: 'P' },
    { term: '师兄师姐', def: '同门中已入学的研究生', cat: '导师', alpha: 'S' },
    { term: '师门', def: '同一导师指导的研究生群体', cat: '导师', alpha: 'S' },
    { term: '老板', def: '研究生对导师的非正式称呼', cat: '导师', alpha: 'L' },
    { term: 'GAP', def: '因推免申请未达预期或个人规划调整而选择延缓一年入学', cat: '申请', alpha: 'G' },
    { term: '四小青', def: '海外优青、教育部青年长江、优青、青年拔尖', cat: '导师', alpha: 'S' },
    { term: '四大青', def: '千人计划、长江、杰青、领军人才', cat: '导师', alpha: 'S' },
    { term: '国家级青年人才', def: '国家四类青年人才项目', cat: '导师', alpha: 'G' },
    { term: 'Fellow', def: 'IEEE Fellow、ACM Fellow 等国际学术组织会士', cat: '导师', alpha: 'F' },
    { term: '优青', def: '国家自然科学基金优秀青年科学基金', cat: '导师', alpha: 'Y' },
    { term: '杰青', def: '国家杰出青年科学基金', cat: '导师', alpha: 'J' },
    { term: '海外优青', def: '国家自然科学基金海外优秀青年科学基金', cat: '导师', alpha: 'H' },
    { term: '长江', def: '教育部长江学者奖励计划', cat: '导师', alpha: 'C' },
    { term: '青拔', def: '中组部万人计划青年拔尖人才', cat: '导师', alpha: 'Q' }
  ];

  // ===== 渲染 FAQ =====
  function renderFAQ() {
    const list = $('faq-list');
    if (!list) return;
    list.innerHTML = FAQS.map((item, i) => `
      <div class="faq-item" data-i="${i}">
        <div class="faq-question">${esc(item.q)}</div>
        <div class="faq-answer">${esc(item.a)}</div>
      </div>
    `).join('');
    list.addEventListener('click', e => {
      const item = e.target.closest('.faq-item');
      if (item) item.classList.toggle('open');
    });
  }

  // ===== 渲染黑话 =====
  function renderGlossary() {
    const grid = $('glossary-grid');
    const idx = $('alphabet-index');
    if (!grid) return;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    idx.innerHTML = letters.map(l => `<button class="alpha-btn" data-alpha="${l}">${l}</button>`).join('');

    grid.innerHTML = GLOSSARY.map(g => `
      <div class="glossary-card" data-alpha="${g.alpha}">
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
        if (card.dataset.alpha === letter || letter === 'ALL') {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // ===== 目录高亮（滚动监听）=====
  function setupTocHighlight() {
    const links = document.querySelectorAll('.toc-sidebar a[href^="#"]');
    const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    function onScroll() {
      let active = null;
      const y = window.scrollY + 100;
      for (const sec of sections) {
        if (sec.offsetTop <= y) active = sec.id;
      }
      links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + active);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== 黑话 Tab 切换 =====
  function setupGlossaryTabs() {
    document.querySelectorAll('.glossary-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.glossary-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // 简单处理：只展示"全部"
        $('glossary-content').classList.add('active');
      });
    });
  }

  renderFAQ();
  renderGlossary();
  setupTocHighlight();
  setupGlossaryTabs();
  console.log('[Intro Page] FAQ + 黑话加载完成');
})();