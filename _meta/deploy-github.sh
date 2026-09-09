#!/usr/bin/env bash
# GitHub Pages 部署脚本
# 用法：./deploy-github.sh <github-token> <repo-name>
#
# 示例：./deploy-github.sh ghp_xxxxxxxxxxx baoyan-kb
#
# 步骤：
# 1. 在 GitHub 创建空仓库（public）: https://github.com/new
#    - 仓库名 = baoyan-kb
#    - 不要勾选 Initialize with README
# 2. 在 https://github.com/settings/tokens 生成 Personal Access Token
#    - 勾选 repo 权限
#    - 复制 token（只显示一次）
# 3. 运行此脚本

set -e

TOKEN="$1"
REPO_NAME="${2:-baoyan-kb}"
GITHUB_USER="bingyuanhe"  # TODO: 自动检测

# 项目根目录
PROJECT_DIR="/Users/bing/Documents/hermes-agent/projects/保研知识库"
WEBSITE_DIR="$PROJECT_DIR/_website"

# 1. 检查参数
if [ -z "$TOKEN" ]; then
  echo "❌ 错误：需要 GitHub Personal Access Token"
  echo "用法：./deploy-github.sh <token> [repo-name]"
  echo ""
  echo "获取 token：https://github.com/settings/tokens"
  exit 1
fi

# 2. 自动检测 GitHub 用户名
if command -v gh >/dev/null 2>&1; then
  GITHUB_USER=$(gh api user --jq .login)
fi

if [ -z "$GITHUB_USER" ]; then
  echo "❌ 错误：未找到 GitHub 用户名"
  echo "请安装 gh CLI: brew install gh"
  echo "或手动设置 GITHUB_USER 变量"
  exit 1
fi

echo "🚀 部署到 GitHub: $GITHUB_USER/$REPO_NAME"
echo ""

# 3. 检查仓库是否存在
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME"
echo "📋 检查仓库: $REPO_URL"

if curl -s -o /dev/null -w "%{http_code}" "https://api.github.com/repos/$GITHUB_USER/$REPO_NAME" | grep -q "200"; then
  echo "✅ 仓库已存在"
else
  echo "⚠️ 仓库不存在，正在创建..."
  curl -s -H "Authorization: token $TOKEN" \
       -H "Accept: application/vnd.github.v3+json" \
       -X POST "https://api.github.com/user/repos" \
       -d "{\"name\":\"$REPO_NAME\",\"public\":true,\"description\":\"保研信息聚合库\"}" > /dev/null
  echo "✅ 仓库创建成功"
fi

# 4. 进入项目目录
cd "$WEBSITE_DIR"

# 5. 初始化 git（如果还没）
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

# 6. 配置 token 认证
git remote remove origin 2>/dev/null || true
git remote add origin "https://$TOKEN@github.com/$GITHUB_USER/$REPO_NAME.git"

# 7. 提交所有文件
echo "📦 提交文件..."
git add .
git commit -m "Deploy: $(date +%Y-%m-%d)" 2>&1 | tail -3 || git echo "No新变更"

# 8. 推送
echo "⬆️  推送到 GitHub..."
git push -u origin main --force 2>&1 | tail -5

# 9. 启用 Pages（API）
echo ""
echo "🔧 启用 GitHub Pages..."
curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GITHUB_USER/$REPO_NAME/pages" \
  -d '{"source":{"branch":"main","path":"/"}}' > /dev/null

# 10. 输出最终 URL
echo ""
echo "✅ 部署完成！"
echo ""
echo "🌐 你的网站地址（GitHub Pages 通常 1-2 分钟生效）："
echo "   https://$GITHUB_USER.github.io/$REPO_NAME/"
echo ""
echo "💡 如果看不到网站："
echo "   1. 等待 1-2 分钟（首次部署需要时间）"
echo "   2. 访问 https://github.com/$GITHUB_USER/$REPO_NAME/settings/pages 查看"