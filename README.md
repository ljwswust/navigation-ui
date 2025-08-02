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

## 许可证

MIT License