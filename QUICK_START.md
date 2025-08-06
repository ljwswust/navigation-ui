# 🚀 快速开始指南

> 5分钟快速上手 Next.js + Supabase 项目

## 📋 前置要求

- Node.js 18+ 
- npm 或 yarn
- Supabase 账号

## ⚡ 快速部署

### 1. 克隆并安装依赖

```bash
# 克隆项目（如果从GitHub获取）
git clone <your-repo-url>
cd 导航页

# 安装依赖
npm install
```

### 2. 配置 Supabase

#### 创建 Supabase 项目
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 复制 **Project URL** 和 **anon public** key

#### 配置环境变量
创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### 初始化数据库
在 Supabase Dashboard → SQL Editor 中执行 `database.sql` 文件内容

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 🎉

---

## 🏗️ 项目功能概览

- **🔐 用户认证** - 邮箱登录/注册
- **📚 书签管理** - 添加、编辑、删除书签
- **🏷️ 分类管理** - 自定义分类组织
- **🔍 实时搜索** - 快速查找书签
- **🎨 主题切换** - 明暗主题支持
- **👤 用户配置** - 个人资料管理
- **📱 响应式设计** - 移动端适配

---

## 🎯 核心学习路径

### 1. 基础概念 (30分钟)
- Next.js App Router 架构
- Supabase 数据库和认证
- TypeScript 类型安全

### 2. 组件开发 (1小时)
- React 组件设计模式
- Tailwind CSS 样式实现
- 用户交互处理

### 3. 数据管理 (45分钟)
- Supabase 客户端使用
- 实时数据同步
- 错误处理策略

### 4. 高级功能 (1小时)
- 认证状态管理
- 性能优化技巧
- 部署最佳实践

---

## 📝 主要学习文件

### 配置文件
- `next.config.js` - Next.js 配置
- `tailwind.config.ts` - 样式配置
- `database.sql` - 数据库结构

### 核心代码
- `src/lib/supabase.ts` - 数据库客户端
- `src/components/AuthProvider.tsx` - 认证管理
- `src/app/page.tsx` - 主页面逻辑

### UI 组件
- `src/components/BookmarkCard.tsx` - 书签卡片
- `src/components/CategorySection.tsx` - 分类展示
- `src/components/SearchBar.tsx` - 搜索功能

---

## 🛠️ 常用开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start

# 代码检查
npm run lint
```

---

## 📚 详细教程

想深入学习？查看完整教程文档：
- [`NEXTJS_SUPABASE_TUTORIAL.md`](./NEXTJS_SUPABASE_TUTORIAL.md) - 详细技术教程

---

## 🤝 获取帮助

遇到问题？这些资源可以帮到你：

- **项目文档** - 查看 `README.md` 和 `NEXTJS_SUPABASE_TUTORIAL.md`
- **官方文档** - [Next.js](https://nextjs.org/docs) | [Supabase](https://supabase.com/docs)
- **社区资源** - Stack Overflow, GitHub Issues

---

## 🎉 开始你的学习之旅！

1. ✅ 完成快速部署
2. 📖 阅读详细教程
3. 🛠️ 动手修改代码
4. 🚀 部署你的应用

**记住**：最好的学习方式是动手实践！尝试修改代码，添加新功能，打造属于你自己的项目。