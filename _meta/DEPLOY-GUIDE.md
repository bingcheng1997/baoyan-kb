# 保研信息聚合库 · 一键部署指南

## 🚀 Vercel 部署（推荐，5 分钟上线）

**部署文件已就绪**：`/Users/bing/Documents/hermes-agent/projects/保研知识库/_website/`

### 步骤

#### 1. 安装 Vercel CLI（已在你机器上）
```bash
npm install -g vercel --prefix=$HOME/.local
export PATH="$HOME/.local/bin:$PATH"
```

#### 2. 登录
```bash
vercel login
```
浏览器会自动打开，授权 GitHub/邮箱/Google 即可。

#### 3. 一键部署到生产
```bash
cd /Users/bing/Documents/hermes-agent/projects/保研知识库/_website
vercel --prod --yes
```

**预期输出**：
```
> Vercel CLI 59.13.1
> 🔍  Linked to bing@example.com (or your account)
> 🔍  Inspecting project...
> ✅  Production: https://保研信息聚合库-xxx.vercel.app [copied to clipboard]
```

### 部署后你会得到

- ✅ `https://保研信息聚合库-xxx.vercel.app` 免费域名
- ✅ 全球 CDN（亚洲节点 → 中国用户 < 100ms）
- ✅ 自动 HTTPS（Let's Encrypt）
- ✅ Git 集成（未来 git push 自动部署）

---

## 🚀 GitHub Pages 替代方案

如果你已有 GitHub 账号，可以直接推到 GitHub Pages：

### 步骤

#### 1. 在 GitHub 创建新仓库
- 仓库名：`baoyan-kb`（或自定义）
- 公开仓库
- 不要初始化 README/license/.gitignore

#### 2. 推送代码
```bash
cd /Users/bing/Documents/hermes-agent/projects/保研知识库
git init
git add _website/
git commit -m "Initial deploy: baoyan information aggregate"
git branch -M main
git remote add origin https://github.com/your-name/baoyan-kb.git
git push -u origin main
```

#### 3. 启用 Pages
- 进入 GitHub 仓库 → Settings → Pages
- Source: `main` 分支 / `/` 根目录（或 `_website` 子目录）
- Save

**预期 URL**：`https://your-name.github.io/baoyan-kb/`

---

## 🚀 Cloudflare Pages（备选）

如果你想用 Cloudflare 账号：

```bash
npm install -g wrangler
wrangler login
cd /Users/bing/Documents/hermes-agent/projects/保研知识库/_website
wrangler pages deploy . --project-name=baoyan-kb
```

---

## 🚀 Surge.sh（最简，无需注册）

```bash
npm install -g surge
cd /Users/bing/Documents/hermes-agent/projects/保研知识库/_website
surge .
```

第一次会让你注册邮箱 + 密码，之后自动部署。
**预期 URL**：`https://baoyan-kb.surge.sh`

---

## ⚠️ 部署前确认清单

- ✅ 已删除新东方品牌字样
- ✅ 已删除 demo-banner 演示版横幅
- ✅ 已删除 5/100 等进度条
- ✅ 已删除"教育部 2026"预测性政策文本
- ✅ 已修复 3 个 P0 代码 bug
- ✅ 已生成 17 个子页面占位
- ✅ 已配置 vercel.json（安全 headers + 缓存）

---

## 🎯 推荐

**如果想最快看到效果**：用 **Surge.sh**（无需注册邮箱即可部署）
**如果想要长期稳定 + CI/CD**：用 **Vercel**
**如果想完全免费 + 简单**：用 **GitHub Pages**

---

部署完成后给我发链接，我帮你检查效果 + 修复发现的问题。