# 保研信息聚合库 · 部署版

**部署状态**：可部署
**最后清理**：2026-09-09

---

## 📋 部署前清理清单

### 已完成
- ✅ 删除演示版横幅（demo-banner 金黄色条）
- ✅ 删除进度条（5/100 等进度声明）
- ✅ 删除预测性政策文本（"教育部 2026"）
- ✅ 修复 3 个 P0 代码 bug（Math.random / 数据不一致 / filter 无响应）
- ✅ 去品牌化（删除新东方相关字样）
- ✅ 替换为"独立项目 · 2026"
- ✅ 17 个子页面占位生成
- ✅ vercel.json 部署配置（含安全 headers + cache）

### 待补充
- ⏳ 教育部官方 366 所推免院校名单（agent 后台抽取中）
- ⏳ 头部 30 所院校完整数据（8 字段）
- ⏳ 121 个黑话 + 31 个问答的真实数据接入（已抽取，待接入数据库）
- ⏳ ICP 备案（申请中）

---

## 🚀 Vercel 部署步骤

### 1. 准备
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login
```

### 2. 部署
```bash
cd /Users/bing/Documents/hermes-agent/projects/保研知识库/_website
vercel --prod
```

### 3. 自定义域名（可选）
```bash
vercel domains add your-domain.com
```

---

## 📁 文件结构

```
_website/
├── index.html              # 首页（12.5 KB · 已清理）
├── styles.css              # 主样式（29 KB）
├── styles-additions.css    # 追加样式（32 KB）
├── vercel.json             # 部署配置
├── data/
│   ├── render.js           # 渲染脚本（12.8 KB · 已修 bug）
│   ├── site.json           # 站点数据
│   ├── glossary_real.json  # 121 个术语（已抽取）
│   └── faq_real.json       # 31 个问答（已抽取）
└── pages/
    ├── notices.html        # 17 个占位页
    ├── schools.html
    └── ...
```

---

## 🔧 数据接入清单

### 已完成抽取，待接入渲染

| 模块 | 抽取数 | 文件 | 状态 |
|---|---|---|---|
| 黑话词典 | 121 条 | `admin/data/glossary_real.json` | ✅ JSON 已生成 |
| 百问百答 | 31 问 | `admin/data/faq_real.json` | ✅ JSON 已生成 |
| 推免院校 | 366 所 | agent 抽取中 | 🟡 后台运行 |
| 院校数据库 | 30 所 | agent 抽取中 | 🟡 后台运行 |

---

## ⚖️ 合规清单

### 必备（部署前必须）
- ✅ 去除所有品牌字样
- ✅ 去除预测性政策内容
- ✅ 替换为"独立项目"
- ✅ 数据源全部标注 L1/L2/L3
- ✅ 法律免责声明占位
- ✅ 隐私政策占位

### 待补（部署后）
- ICP 备案号
- 实际联系邮箱（反馈/纠错）
- 真实的免责声明文本

---

## 🔍 4 Agent 综合评审结论

**综合得分**：6.7 / 10（需修复后发布）

| Agent | 维度 | 分数 |
|---|---|---|
| 信息架构 | IA + Schema + 用户视角 | 7.25 |
| 产品定位 | 5 家竞品对比 | 5.58 |
| 数据合规 | 数据源 + 合规 + 风险 | 6.8 |
| Claude Code | 代码质量 + 响应式 + 性能 | 7.1 |

**P0 已修**（约 2 小时工作量）：
1. ✅ 3 个 P0 代码 bug
2. ✅ 删除 demo-banner + 进度条
3. ✅ 删除预测性政策文本
4. ✅ 去品牌化

---

## 📝 部署后待办

1. 接入真实 366 所院校数据（替换 9 所示例）
2. 接入 121 黑话 + 31 问答真实数据（替换首页占位）
3. 申请 ICP 备案
4. 配置自定义域名
5. 添加 GA / Plausible 流量统计
6. 开启监控（Vercel Analytics / Sentry）

---

**建议**：先以 `xxx.vercel.app` 域名上线 MVP，看效果后再考虑自定义域名 + ICP 备案。