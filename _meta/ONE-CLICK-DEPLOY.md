# 🚀 一键部署到 Vercel（你只需要跑这 3 行）

## ✅ 在你电脑上机器上跑（不是 Hermes 里）

```bash
# 第 1 行：进入项目
cd "/Users/bing/Documents/hermes-agent/projects/保研知识库/_website"

# 第 2 行：登录（会打开浏览器，授权 GitHub 即可）
~/.local/bin/vercel login

# 第 3 行：部署到生产
~/.local/bin/vercel deploy --prod --yes
```

## 输出应该是

```
✅ Production: https://保研信息聚合库-xxx.vercel.app [copied to clipboard]
```

## 如果遇到问题

### Q1: 浏览器没自动打开
```bash
~/.local/bin/vercel login --github
# 会输出一串 URL，复制到浏览器手动打开
```

### Q2: GitHub 2FA 验证失败
在 https://github.com/settings/tokens 生成一个 Personal Access Token，然后：
```bash
~/.local/bin/vercel login --github --token ghp_xxxxxxxxxx
```

### Q3: 想用其他平台
```bash
# Surge（最简）
~/.local/bin/surge .
# 首次会让你输入邮箱+密码，会发邮件验证

# Cloudflare Pages
~/.local/bin/wrangler pages deploy . --project-name=baoyan-kb
```

### Q4: 完全没账号
用 Cloudflare Pages 临时部署（无需账号）：
```bash
~/.local/bin/wrangler pages deploy . --project-name=baoyan-kb-tmp
```
会生成 `*.baoyan-kb-tmp.pages.dev` 临时 URL。

## 部署后发我链接

部署成功后会得到 `https://xxx.vercel.app` 这种 URL，把 URL 发给我，我帮你检查：
- ✅ 页面渲染
- ✅ 链接是否正常
- ✅ 数据展示
- ✅ 发现问题立即修复