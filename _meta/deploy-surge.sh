#!/usr/bin/env bash
# Surge.sh 一键部署脚本
# 在你电脑的终端跑（不是 Hermes 里）

set -e

PROJECT_DIR="/Users/bing/Documents/hermes-agent/projects/保研知识库/_website"

# 1. 进入项目
cd "$PROJECT_DIR"

echo "🚀 Surge 一键部署"
echo ""

# 3. 部署
echo "📦 部署中..."
~/.local/bin/surge --project . --domain baoyan-kb.surge.sh

echo ""
echo "✅ 部署完成！"
echo "🌐 你的网站：https://baoyan-kb.surge.sh"