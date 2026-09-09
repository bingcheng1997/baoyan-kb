# 🚀 Cloudflare Quick Tunnel 一键部署指南

## ✨ 真正的免账号方案

Cloudflare Quick Tunnel 是**唯一不需要注册账号**的方案：
- 一行命令启动
- 自动获得 `*.trycloudflare.com` 域名
- 临时访问（关掉 tunnel 就断）

## 📦 部署步骤

### 方式 1：双行命令（最快）

**第一步**：在你电脑终端启动 HTTP 服务器
```bash
cd "/Users/bing/Documents/hermes-agent/projects/保研知识库/_website" && python3 -m http.server 8080
```

**第二步**：新开一个终端窗口，启动 Cloudflare Tunnel
```bash
cloudflared tunnel --url http://localhost:8080
```

**输出**：
```
Your quick Tunnel has been created! Visit it at:
https://xxxxxxxx.trycloudflare.com
```

**这个 URL 立即可访问** ——发给我，我帮你验证。

---

### 方式 2：用我写好的脚本

**在你电脑终端跑**：
```bash
"/Users/bing/Documents/hermes-agent/projects/保研知识库/_website/_meta/deploy-tunnel.sh"
```

这个脚本会自动启动 HTTP server + tunnel 并打印 URL。

---

## ⚠️ 注意事项

1. **URL 是临时的** ——每次启动会变
2. **tunnel 关闭后失效** ——关掉终端窗口 URL 就不工作了
3. **需要电脑一直开着** ——电脑休眠/关机 = 站点下线
4. **不保证 100% 国内可达** ——但 Cloudflare 国内访问一般 100-300ms

## 🆚 与其他方案对比

| 方案 | 免账号 | 永久 | 国内速度 |
|---|---|---|---|
| Cloudflare Quick Tunnel | ✅ | ❌临时 | ⭐⭐⭐⭐⭐ |
| Surge | ❌ | ✅ | ⭐⭐ |
| Vercel | ❌ | ✅ | ⭐⭐⭐⭐ |
| Cloudflare Pages | ❌ | ✅ | ⭐⭐⭐⭐⭐ |
| 本地 http://localhost:8080 | ✅ | ❌只本地 | — |

## 🎯 推荐策略

**如果只是要看效果** → **Cloudflare Quick Tunnel**（最快）

**如果想长期使用** → **Cloudflare Pages**（需注册，但永久 + 国内快）

---

## 💡 关于账号问题

你说没有账号。**让我帮你看其他选项**：

1. **GitHub 账号** — 你有吗？
   - 有 → **GitHub Pages** 永久免费 + 国内 OK
2. **Gmail 账号** — 你有吗？
   - 有 → **Cloudflare Pages** 永久免费 + 国内极快
3. **都没有** → 用 Cloudflare Quick Tunnel 立即看

如果都没有，告诉我哪个能注册，我帮你注册。