# 📦 密码加密功能 - 依赖包安装说明

## 需要安装的新依赖

### 1. 运行时依赖

```bash
# 加密算法库
npm install crypto-js

# UI 组件 (如果还未安装)
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-progress
```

### 2. 开发依赖

```bash
# TypeScript 类型定义
npm install --save-dev @types/crypto-js
```

### 3. 完整安装命令

```bash
# 一次性安装所有必需依赖
npm install crypto-js @radix-ui/react-checkbox @radix-ui/react-progress
npm install --save-dev @types/crypto-js
```

## 更新后的 package.json 片段

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.45.4",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "crypto-js": "^4.2.0",
    "autoprefixer": "^10.4.21",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.454.0",
    "next": "15.4.5",
    "next-themes": "^0.4.3",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/crypto-js": "^4.2.2",
    "eslint": "^8",
    "eslint-config-next": "15.4.5",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

## 依赖包说明

### crypto-js
- **用途**: 提供加密算法 (AES, SHA256, PBKDF2 等)
- **版本**: ^4.2.0 (最新稳定版)
- **大小**: ~87KB (gzipped: ~23KB)
- **功能**: 客户端密码加密和哈希

### @radix-ui/react-checkbox
- **用途**: 复选框组件 (加密选项开关)
- **特点**: 无障碍访问、完全自定义样式
- **大小**: ~15KB

### @radix-ui/react-progress  
- **用途**: 进度条组件 (密码强度指示器)
- **特点**: 动画效果、响应式设计
- **大小**: ~12KB

## 安装验证

安装完成后，验证依赖是否正确加载:

```bash
# 检查包版本
npm list crypto-js @radix-ui/react-checkbox @radix-ui/react-progress

# 验证类型定义
npx tsc --noEmit
```

## 可选依赖 (高级功能)

如果需要更多安全功能，可以考虑安装:

```bash
# 用于生成安全随机数
npm install secure-random

# 用于密码强度检测 (更详细的规则)
npm install zxcvbn

# 用于输入防抖
npm install lodash
npm install --save-dev @types/lodash

# 用于二维码生成 (双因素认证)
npm install qrcode
npm install --save-dev @types/qrcode
```

## 包大小影响

新增依赖对包大小的影响:

- **crypto-js**: +87KB (~23KB gzipped)
- **@radix-ui 组件**: +30KB (~8KB gzipped)  
- **总增加**: ~117KB (~31KB gzipped)

这些依赖都是按需加载，不会影响首页加载性能。

## 兼容性说明

- **Node.js**: ≥16.8.0
- **React**: ≥18.0.0  
- **Next.js**: ≥13.0.0
- **TypeScript**: ≥4.5.0
- **浏览器**: 支持现代浏览器 (Chrome 60+, Firefox 55+, Safari 12+)

## 安装后续步骤

1. ✅ 安装依赖包
2. 📝 配置环境变量 (`.env.local`)
3. 🔄 更新组件引用
4. 🧪 测试加密功能
5. 🚀 部署到生产环境