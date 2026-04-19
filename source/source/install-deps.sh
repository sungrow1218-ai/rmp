#!/bin/bash

# 安装缺失的依赖
echo "安装缺失的依赖..."

# 检查是否使用 yarn 或 npm
if command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
else
    echo "错误: 未找到 yarn 或 npm，请先安装 Node.js"
    exit 1
fi

echo "使用 $PACKAGE_MANAGER 安装依赖..."

# 安装依赖
if [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn add js-cookie lodash
    yarn add --dev @types/js-cookie @types/lodash
else
    npm install js-cookie lodash
    npm install --save-dev @types/js-cookie @types/lodash
fi

echo "依赖安装完成！"
echo ""
echo "接下来可以运行以下命令启动项目："
echo ""
echo "使用 yarn:"
echo "  yarn dev"
echo ""
echo "使用 npm:"
echo "  npm run dev"
echo ""
echo "默认登录账号："
echo "  用户名: admin"
echo "  密码: 123456"
echo ""
echo "其他测试账号："
echo "  用户名: user001, 密码: 123456"
echo "  用户名: user002, 密码: 123456"