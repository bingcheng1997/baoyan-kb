# 保研信息库 v2.1 · 代码级深度评审报告

**评审角色**:Claude Code(CC)
**评审日期**:2026-09-09
**评审对象**:`_website/` 目录 4 个核心文件
**评审范围**:代码质量 · 响应式 · 性能 · 兼容性 · 数据完整性

---

## 总体评分

| 维度 | 得分 | 评级 |
|------|------|------|
| 代码质量(HTML/CSS/JS/A11y) | **6.5/10** | 中等 |
| 响应式设计 | **7.0/10** | 中等偏上 |
| 性能 | **7.5/10** | 中等偏上 |
| 浏览器兼容性 | **8.5/10** | 良好 |
| 数据完整性 | **6.0/10** | 中等 |
| **综合** | **7.1/10** | **MVP 可发布,但需先修 3 项严重问题** |

---

## 1️⃣ 代码质量(6.5/10)

### 优点
- ✅ 完整使用语义化标签:`<header>` `<nav>` `<main>` `<aside>` `<footer>` `<section>`(`index.html` line 22/35/115/236/295/375)
- ✅ 表单元素使用正确,`escape()` 函数防御 XSS(`render.js` line 10-12)
- ✅ CSS 变量系统完整(色板/字号/间距/圆角/阴影),共 41 个变量(`styles.css` line 8-78)
- ✅ IIFE + `'use strict'` 避免全局污染(`render.js` line 6-7)
- ✅ null-safe 操作符 `?.` 和 `if ($('xxx'))` 兜底(`render.js` line 26-29)

### 问题 1:`styles.css` 与 `styles-additions.css` 重复定义(严重)

**位置**:`styles.css` line 950-960 vs `styles-additions.css` line 265-276(`.source-badge`)
`styles.css` line 907-947 vs `styles-additions.css` line 309-366(`.case-card`)
`styles.css` line 418-435 vs `styles-additions.css` line 34-59(`.hero-stat` vs `.trust-stat`)

**修复**:
- 二选一合并(推荐保留 `styles-additions.css`,它对应 v2.1 实际使用的类)
- 在合并后的文件顶部注释 "Source of Truth",删除旧版重复块

### 问题 2:`render.js` line 173 Math.random 锚点 bug(严重)

**位置**:
```js
<a href="pages/faq.html#q${Math.random().toString(36).slice(2,8)}"
```

**问题**:每次刷新页面,FAQ 链接的锚点 ID 都是新的。这导致:
- 用户无法分享特定问题 URL
- 搜索引擎无法索引具体问答
- 浏览器历史无意义

**修复**:
```js
// 改为基于索引的稳定 ID
items.forEach((q, idx) => `
  <a href="pages/faq.html#q${idx+1}" class="faq-mini-item">
    <span class="faq-mini-q">${esc(q)}</span>
  </a>
`).join('')
```
同时在 `pages/faq.html` 给每个 Q 加上 `id="q1"`、`id="q2"` 等。

### 问题 3:`render.js` line 26-29 重复 DOM 查询(轻微)

**位置**:
```js
if ($('cd-days')) $('cd-days').textContent = String(d).padStart(2, '0');
if ($('cd-hours')) $('cd-hours').textContent = String(h).padStart(2, '0');
if ($('cd-mins')) $('cd-mins').textContent = String(m).padStart(2, '0');
if ($('cd-secs')) $('cd-secs').textContent = String(s).padStart(2, '0');
```

**修复**:
```js
// setupCountdown 顶部缓存
const els = {
  days: $('cd-days'),
  hours: $('cd-hours'),
  mins: $('cd-mins'),
  secs: $('cd-secs'),
  mainEvent: $('countdown-main-event')
};
// tick() 内直接 els.days.textContent = ...; 即可
```

### 可访问性问题

| 缺失项 | 影响 | 修复 |
|--------|------|------|
| 表单 `<select>` `<input>` 无 `<label>` 包裹 | 屏幕阅读器无法识别 | 给每个 input 加 `<label for="school">本科层次</label>`,或加 `aria-label` |
| 表格 `<th>` 无 `scope="col"` | 辅助技术无法关联表头 | `<th scope="col">学校 · 院系</th>` |
| 进度条无 `role="progressbar"` `aria-valuenow` | 无法被辅助技术读出 | 加 `role="progressbar" aria-valuenow="5" aria-valuemin="0" aria-valuemax="100"` |
| filter-pill 无 `aria-pressed` | 用户不知道哪个已选 | 加 `aria-pressed="true"` 给 active 的 |
| 倒计时无 `role="timer" aria-live="polite"` | 屏幕阅读器不自动播报 | 给 `.side-card-timer` 加 `role="timer"` |

---

## 2️⃣ 响应式设计(7.0/10)

### 断点结构
```
< 640px    移动端(单列堆叠)
640-767px  移动大屏
768-1023px 平板(单列堆叠三栏)
1024-1279px 桌面(三栏 260/1fr/280)
≥ 1280px   大屏
```

### 问题 1:768-1023px 区间体验断裂(中等)

**位置**:`styles-additions.css` line 638-642
```css
@media (min-width: 1024px) {
  .three-col-layout { grid-template-columns: 260px 1fr 280px; }
}
```

**问题**:768px-1023px 之间三栏全部堆叠为单列。平板用户(常见 768-1024,例如 iPad mini)看到的是一长串垂直内容,scroll 距离极长,左/右侧栏的相关性消失。

**修复**:
```css
@media (min-width: 768px) {
  .three-col-layout {
    grid-template-columns: 240px 1fr; /* 平板双栏:左 + 主内容 */
    grid-template-areas: "left main" "right right";
  }
  .side-left { grid-area: left; }
  .main-content { grid-area: main; }
  .side-right { grid-area: right; display: grid; grid-template-columns: repeat(2, 1fr); }
}
```

### 问题 2:`院校表格` 8 列在移动端横向滚动(轻微)

**位置**:`index.html` line 173-185 + `styles-additions.css` line 842-867

**问题**:8 列在窄屏(< 640px)会被迫横向滚动,而有"夏令营 ✓" "预推免 ✓"这种短数据,移动端可隐藏次要列。

**修复**:
```css
@media (max-width: 640px) {
  .data-table .hide-mobile { display: none; }
}
```
给 `<th>` 加 `class="hide-mobile"`(例如"留学认可"、"源")。

### 问题 3:缺少 prefers-reduced-motion(轻微)

**修复**:在 `styles.css` line 1192 后追加
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

---

## 3️⃣ 性能(7.5/10)

### CSS 体积问题(中等)

**数据**:
- `styles.css`:1194 行 / 29KB
- `styles-additions.css`:1332 行 / 32KB
- **总计 61KB / 2526 行**(gzip 后约 13KB)

**未使用的样式**(估计占总行数 40-50%):

| 类名 | 定义位置 | 实际使用? |
|------|---------|----------|
| `.countdown-banner` | styles.css 107-169 | ❌ index.html 不用 |
| `.hero` `.hero-title` `.hero-stats` | styles.css 364-435 | ❌ index.html 不用 |
| `.journey-selector` `.journey-card` | styles.css 437-491 | ❌ index.html 不用 |
| `.section` `.section-title` `.section-tag` | styles.css 494-528 | ❌ index.html 不用 |
| `.smart-assess` `.smart-assess-form` | styles.css 530-607 | ❌ index.html 不用 |
| `.dual-pillar-grid` `.dual-pillar-card` | styles.css 640-691 | ❌ index.html 不用 |
| `.module-grid` `.module-card` | styles.css 693-755 | ❌ index.html 不用 |
| `.dashboard-grid` | styles.css 757-797 | ❌ index.html 不用 |
| `.school-grid` `.school-card` | styles.css 799-880 | ❌ index.html 不用 |
| `.pill-grid` `.pill` | styles.css 882-904 | ❌ index.html 不用 |
| `.anxiety-grid` `.anxiety-card` | styles.css 1118-1174 | ❌ index.html 不用 |
| `.info-table` `.notice-table` | styles-additions.css 221-263 | ❌ index.html 用了 `.data-table` |

**修复**:
- 步骤 1:用 grep 验证哪些类真的未被使用
- 步骤 2:把未被使用的整块删除,可减少约 25-30KB
- 步骤 3:对 `.info-table`/`.notice-table` 重命名为 `.data-table`(或反过来),消除重复

### 硬编码颜色未走变量(轻微)

**位置**:`styles-additions.css` line 297-301(line 836-839 也重复)
```css
.tier-badge.c9 { background: #00B050; }
.tier-badge.t985 { background: #5B8FF9; }
.tier-badge.t211 { background: #5AD8A6; }
.tier-badge.dual { background: #722ED1; }
.tier-badge.abroad { background: #1890FF; }
```

**修复**:在 `:root` 加
```css
--color-tier-c9: #00B050;
--color-tier-985: #5B8FF9;
--color-tier-211: #5AD8A6;
--color-tier-dual: #722ED1;
--color-tier-abroad: #1890FF;
```

### JS 性能(良好)

- 倒计时每秒 4 次 `getElementById`,改为缓存可降至 0 次/秒
- 整体 JS 仅 11KB,执行开销可忽略

### 网络请求(优秀)
- 仅 3 个本地资源(2 CSS + 1 JS)
- 无外部字体、图片、CDN
- 首屏 < 100KB,4G 下 < 1s

---

## 4️⃣ 浏览器兼容性(8.5/10)

### 检查结果

| 特性 | 兼容性 | 风险 |
|------|--------|------|
| ES2020 可选链 `?.` | Chrome 80+/Safari 13.1+ | 低(目标用户都在这之上) |
| CSS Grid | 全现代浏览器 | IE11 不支持,但目标用户已弃用 IE |
| CSS Variables | 全现代浏览器 | 同上 |
| `aspect-ratio` 未使用 | - | - |
| `:has()` 未使用 | - | - |
| `backdrop-filter` 未使用 | - | - |

### 结论
- 不需要 polyfill
- 目标用户是 18-24 岁大学生,Chrome/Safari/Edge 最新版本覆盖足够
- 唯一建议:对 Edge Legacy / Safari 14 之前的 fallback 不做,承认放弃

---

## 5️⃣ 数据完整性(6.0/10)

### 数据对账

| 位置 | 数据 | 与页面宣称对账 |
|------|------|---------------|
| `renderNotices` line 41-48 | 8 条通知 | ⚠️ index.html line 119 宣称 "5/100",侧栏 `#notice-count` 写死为 "8"(line 105/182) |
| `renderSchools` line 70-79 | 9 所 | ✅ index.html line 155 宣称 "9/120" |
| `renderCases` line 100-104 | 4 例 | ✅ index.html line 194 宣称 "4/20" |
| `renderPolicies` line 123-128 | 5 条 | ✅ index.html line 209 宣称 "5/30" |
| `renderGlossaryMini` line 144-151 | 6 条 | ✅ 侧栏 line 271 宣称 "全部 30 条 →" |
| `renderFaqMini` line 165-170 | 6 问 | ✅ 侧栏 line 278 宣称 "全部 20 问 →" |

### 问题 1:通知数显示与渲染不一致(严重)

**位置**:
- `index.html` line 119:`最新通知 <span class="block-stat">5/100</span>`
- `index.html` line 105:`📢 通知库 <span id="notice-count">0</span>`
- `render.js` line 41-48:实际渲染 8 条
- `render.js` line 180-183:`renderNoticeCount` 写死为 "8"

**问题**:页面用 5 体现"完成度 5%",侧栏却显示 8,数据自相矛盾。

**修复方案 A**(推荐):把 `index.html` 全部数字与 `render.js` 对齐
```js
// render.js 顶部统一定义
const STATS = {
  notices: { current: 8, plan: 100 },
  schools: { current: 9, plan: 120 },
  cases:   { current: 4, plan: 20 },
  policies:{ current: 5, plan: 30 },
};
// 然后所有 .block-stat 和侧栏计数都从这里读
```

**修复方案 B**(简单):让侧栏的 `#notice-count` 显示真实数字,并把 hero "5" 改为 "8"
- 但这会暴露 5.4% 完成度的"水分"

### 问题 2:数据耦合,关注未分离(中等)

**位置**:`render.js` line 41-48
```js
{ status: 'urgent', statusText: '今天截止', school: '军事科学院', ... }
```

**问题**:`status`(业务态)和 `statusText`(展示文案)耦合在数据里。修改"今天截止"文案要改数据,违反关注分离。

**修复**:
```js
// 数据只有 status,文案从常量映射
const STATUS_MAP = {
  urgent:  { cls: 'urgent',  text: '今天截止' },
  warning: { cls: 'warning', text: '3天截止' },
  normal:  { cls: 'normal',  text: '报名中' },
  ended:   { cls: 'ended',   text: '已截止' },
};
// 渲染时 const m = STATUS_MAP[n.status]; ...
```

### 问题 3:院校中"合办项目"语义冲突(轻微)

**位置**:`render.js` line 77-78
```js
{ name: '港中深', tier: 'abroad', tierName: '合办', baoyan: '—', ... }
{ name: '上纽大', tier: 'abroad', tierName: '合办', baoyan: '—', ... }
```

**问题**:港中深、上纽大本质是"合办本科",而非"保研路径"。放在"院校数据库 (9/120)" 里语义不一致。

**建议**:在表格上方加一行"包含 2 所合办院校(以留学路径为主)"的说明,或把这 2 所移到独立的"合办"区块。

### 问题 4:倒计时逻辑正确性(良好)

**位置**:`render.js` line 16-34

- ✅ 目标时间用 ISO 8601 显式带时区 `+08:00`
- ✅ `Math.max(0, diff)` 防止过期显示负数
- ✅ 倒计时到期后会一直显示 00:00:00:00(应该加 UI 反馈"已截止",但 MVP 可接受)

### 倒计时小 bug:文案写死

**位置**:`render.js` line 30
```js
if (mainEventEl) mainEventEl.textContent = `2026 年推免系统填报`;
```

**问题**:写死字符串,而不是基于 target 变量动态生成。明年需要手动改代码。

**修复**:
```js
if (mainEventEl) mainEventEl.textContent = `${target.getFullYear()} 年推免系统填报`;
```

---

## 🚨 最紧急的 5 项优先修复

按 ROI(影响/工作量)排序:

### P0 · 第 1 项 · 修后即可发布
**`render.js` line 173 Math.random 锚点 bug**
- **影响**:SEO 失效、分享链接每次刷新都变
- **工作量**:5 分钟
- **修复**:改用 `items.forEach((q, idx) => ... idx+1)`
- **配合**:在 `pages/faq.html` 给每个 Q 加稳定 `id="q1"..."q6"`

### P0 · 第 2 项 · 数据一致性
**通知数显示不一致(8 vs 5)**
- **影响**:数据透明度原则被破坏,"演示版"承诺失真
- **工作量**:15 分钟
- **修复**:在 `render.js` 顶部加 `STATS` 常量,所有数字统一从那里读;`index.html` 的硬编码数字全部替换为占位 `<span class="js-stat-notices">`

### P0 · 第 3 项 · 核心交互失效
**filter-pill 按钮点击无响应**
- **影响**:5 个分类按钮(夏令营/预推免/正式推免/72H最新)毫无作用,用户预期破裂
- **工作量**:30 分钟
- **修复**:
  1. 给 `filter-pill` 加 `data-filter="summer"` 等属性
  2. 在 `render.js` 末尾加事件委托:
     ```js
     document.querySelector('.filter-bar-inline').addEventListener('click', (e) => {
       const pill = e.target.closest('.filter-pill');
       if (!pill) return;
       pill.parentElement.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
       pill.classList.add('active');
       // 简单版:对表格行按 data-status 过滤
     });
     ```
  3. 在 render 时给 `<tr>` 加 `data-status="urgent|warning|normal"`

### P1 · 第 4 项 · CSS 瘦身
**删除 `styles.css` 中未使用的样式块**
- **影响**:首屏下载 -25~30KB,FCP 改善
- **工作量**:1 小时(grep + 删除)
- **修复**:用 `rg -c 'countdown-banner\|hero\|journey-selector\|smart-assess\|dual-pillar\|module-grid\|dashboard-grid\|school-grid\|pill-grid\|anxiety-grid' index.html` 验证未使用,然后在 `styles.css` 删除对应块

### P1 · 第 5 项 · 可访问性最低门槛
**表单 label + 表格 scope + aria-pressed**
- **影响**:盲生/低视力用户无法使用;键盘用户焦点不清晰
- **工作量**:30 分钟
- **修复**:
  - `index.html` line 84-97:把 `<select name="school">` 改成 `<label>本科层次<select>...</select></label>` 或加 `aria-label="本科层次"`
  - `index.html` line 140-145 / 175-184 / 222-227:所有 `<th>` 加 `scope="col"`
  - `index.html` line 132-134 / 167-169:`<button class="filter-pill active">` 加 `aria-pressed="true"`,非 active 加 `aria-pressed="false"`

---

## ✅ MVP 发布评估

### 推荐结论:**修复 P0 三项后可发布**

### 修复后达到的水平
| 维度 | 修复前 | 修复后 |
|------|--------|--------|
| 数据透明度 | 矛盾(8 vs 5) | ✅ 真实可信 |
| 核心交互 | 失效(filter 无响应) | ✅ 可用 |
| SEO/分享 | 失效(随机锚点) | ✅ 稳定 |
| 加载速度 | 一般(61KB CSS) | ✅ 优化后约 30KB |
| 可访问性 | 不达标 | 基础达标(留待迭代) |

### 发布前必须完成(共约 3 小时工作量)
1. ✏️ P0-1:Math.random 锚点 → 5min
2. ✏️ P0-2:数据一致性 → 15min
3. ✏️ P0-3:filter 事件绑定 → 30min
4. 🧪 三栏布局 + 表格 在 Chrome/Safari/Firefox 最新版浏览器各跑一遍
5. 🧪 移动端(iPhone SE 375px / iPad 768px / iPad Pro 1024px)各跑一遍

### 推迟到 v2.2 的事项
- CSS 瘦身(P1-4,1 小时工作量)
- 完整可访问性审计(P1-5)
- 数据驱动改造(STATS 常量)
- 倒计时文案动态化
- 平板断点优化
- `prefers-reduced-motion` 支持

### 不要做
- ❌ 不要重构 styles.css 和 styles-additions.css 合并(风险高、收益小,MVP 阶段)
- ❌ 不要引入构建工具(纯静态站点是优势,加 Webpack/Vite 反而复杂化部署)
- ❌ 不要 polyfill(目标用户都在现代浏览器)

---

## 📋 评审总结

保研信息库 v2.1 已经完成"信息库模式"的视觉重构——三栏布局、演示版横幅、进度条、贡献入口都体现了产品视角的设计思考。代码整体质量在 MVP 阶段属于**可接受水平**,有 3 个具体 bug 必须修复后即可上线。

**优势**:
- 视觉系统完整、品牌色一致
- 数据真实性高(L1 源标注)
- 无外部依赖、加载迅速
- 语义化标签使用规范

**劣势**:
- 1 处严重 bug(Math.random 锚点)
- 1 处数据矛盾(8 vs 5)
- 1 处核心交互失效(filter 无响应)
- CSS 体积虚胖(40-50% 未使用样式)

**最终建议**:**Yes, fix 3 P0 bugs then ship.** 🚢