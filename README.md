# 个人导航页

一个现代化的个人导航页面，使用 Next.js 14 + Supabase 构建。

## 功能特性

- 🎨 现代化的界面设计，支持明暗主题切换
- 📱 响应式布局，完美适配桌面和移动端
- 🔍 实时搜索功能
- 📂 分类管理书签
- 🖼️ 自动获取网站图标
- ⚡ 基于 Next.js 14 的高性能

## 技术栈

- **前端**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI 组件**: Shadcn/ui
- **数据库**: Supabase
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local` 文件并填入你的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. 初始化数据库

在 Supabase 控制台的 SQL 编辑器中执行 `database.sql` 文件中的 SQL 语句。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看你的导航页面。

## 部署

### Vercel 部署 (推荐)

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 设置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 部署完成

### GitHub Pages 部署

```bash
npm run build
npm run export
```

将 `out` 目录部署到 GitHub Pages。

## 项目结构

```
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React 组件
│   └── lib/                 # 工具函数和类型定义
├── public/                  # 静态资源
├── database.sql            # 数据库初始化脚本
└── README.md
```

## 自定义

### 添加新分类

在 Supabase 的 `categories` 表中添加新记录，或者通过应用界面管理。

### 修改主题

编辑 `src/app/globals.css` 中的 CSS 变量来自定义颜色主题。

## 📚 学习资源

想学习如何使用 Next.js 和 Supabase 开发类似项目？我们为你准备了详细的教学文档：

- **🚀 [快速开始指南](./QUICK_START.md)** - 5分钟快速上手项目
- **📖 [详细教程文档](./NEXTJS_SUPABASE_TUTORIAL.md)** - 完整的 Next.js + Supabase 开发教程

### 教程涵盖内容

- ✅ **Next.js 15 App Router** 完整使用指南
- ✅ **Supabase** 数据库设计与认证集成  
- ✅ **TypeScript** 全栈类型安全开发
- ✅ **现代UI设计** 与响应式布局实现
- ✅ **性能优化** 与部署最佳实践
- ✅ **高级功能** 实现技巧

### 适合人群

- 🎯 想学习 Next.js 全栈开发的初学者
- 🎯 希望了解 Supabase 集成的开发者  
- 🎯 需要实战项目经验的学习者
- 🎯 想构建现代化Web应用的开发者

---

## 许可证

MIT License