#!/usr/bin/env bash
# Cloudflare Quick Tunnel 一键部署（无需账号）

set -e

PROJECT_DIR="/Users/bing/Documents/hermes-agent/projects/保研知识库/_website"
HTTP_PORT=8080

echo "🚀 Cloudflare Quick Tunnel 一键部署"
echo ""
echo "⚠️  临时域名，每次启动会变"
echo "✅ 无需账号"
echo ""

# 1. 启动 HTTP 服务器（后台）
echo "📦 启动 HTTP 服务器 (端口 $HTTP_PORT)..."
cd "$PROJECT_DIR"
python3 -m http.server $HTTP_PORT > /tmp/http_server.log 2>&1 &
HTTP_PID=$!
echo "  PID: $HTTP_PID"
sleep 1

# 2. 启动 Cloudflare Tunnel
echo ""
echo "🌐 启动 Cloudflare Tunnel..."
echo "  （按 Ctrl+C 关闭）"
echo ""
echo "URL 会显示在下方："
echo "============================================"
~/.local/bin/cloudflared tunnel --url http://localhost:$HTTP_PORT 2>&1 | tee /tmp/tunnel.log &
TUNNEL_PID=$!
sleep 5

# 3. 提取 URL
URL=$(grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" /tmp/tunnel.log | head -1)
if [ -n "$URL" ]; then
    echo ""
    echo "============================================"
    echo "✅ 部署成功！"
    echo "🌐 访问地址：$URL"
    echo "============================================"
fi

echo ""
echo "按 Ctrl+C 关闭 tunnel 和 HTTP 服务器"
trap "kill $HTTP_PID $TUNNEL_PID 2>/dev/null" EXIT
wait