# Anpier

![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)
![Astro 5](https://img.shields.io/badge/Astro-5.x-ff5d01)

一个基于 [Astro](https://astro.build) 与 [Fuwari](https://github.com/saicaca/fuwari) 深度定制的个人博客。

这个项目现在更偏向我自己的使用习惯：默认进入 `About` 页面，文章列表放在单独的 `Home` 页面，同时保留相册、友链、归档、搜索、RSS、暗色模式和扩展 Markdown 能力。

[**在线访问**](https://blog.anpier.xyz)

## ✨ Features

- [x] 基于 Astro 5、Tailwind CSS 与 Fuwari
- [x] 首页入口重构：`/` 默认进入 `/about/`，文章列表位于 `/home/`
- [x] 独立的 `About / Friends / Pictures / Archive` 页面
- [x] 明暗主题切换与平滑页面过渡
- [x] 更柔和的马卡龙风格配色与自定义页面排版
- [x] 相册页面支持通过远程图片链接维护内容
- [x] 搜索功能，基于 [Pagefind](https://pagefind.app/)
- [x] RSS 与 Sitemap
- [x] 响应式设计
- [x] 扩展 Markdown：数学公式、提示块、GitHub 卡片、增强代码块

## 🚀 Getting Started

1. 克隆仓库并安装依赖：

   ```sh
   pnpm install
   ```

2. 本地启动开发环境：

   ```sh
   pnpm dev
   ```

3. 修改站点基础信息：

   - 编辑 `src/config.ts`
   - 包括站点标题、头像、简介、导航栏、主题色等

4. 新建文章：

   ```sh
   pnpm new-post your-post-name
   ```

5. 构建生产版本：

   ```sh
   pnpm build
   ```

6. 按需部署到 Vercel、Netlify、Cloudflare Pages 或自己的服务器。

## 🗂 Content Management

这个博客的常用内容入口已经分得比较清楚，后续维护基本都在下面这些位置：

- `src/config.ts`
  站点标题、头像、简介、导航栏、主题色等全局配置
- `src/content/posts/`
  所有博客文章内容
- `src/content/spec/about.md`
  关于页面的正文内容
- `src/content/spec/friends.md`
  友链页面的正文内容
- `src/data/pictures.ts`
  相册数据，使用图片链接和简介维护内容

## 🖼 Gallery Data

相册页面不依赖本地图片文件，你可以直接在 `src/data/pictures.ts` 中使用图片链接维护内容。

```ts
export const pictures = [
  {
    title: "Example",
    image: "https://example.com/your-image.jpg",
    description: "这张图片的简介",
    x: 12,
    y: 18,
    width: 260,
    rotate: -4,
    fit: "cover",
  },
];
```

字段说明：

- `image`: 图片链接
- `description`: 图片简介
- `x` / `y`: 默认摆放位置
- `width`: 图片显示宽度
- `rotate`: 初始旋转角度
- `fit`: `cover` 或 `contain`

## 📝 Frontmatter of Posts

```yaml
---
title: My First Blog Post
published: 2025-01-01
description: This is a post in my blog.
image: ./cover.jpg
tags: [Deep Learning, Notes]
category: Tech
draft: false
lang: zh_CN
---
```

## 🧩 Markdown Features

除了 Astro 默认支持的 Markdown 语法外，这个项目还启用了以下内容增强：

- 数学公式，基于 `remark-math` 和 `rehype-katex`
- Admonitions 提示块
- GitHub 仓库卡片
- Expressive Code 增强代码块
- 代码行号、语言标签、复制按钮扩展

## ⚡ Commands

所有命令都在项目根目录运行：

| Command                    | Action                                      |
|:---------------------------|:--------------------------------------------|
| `pnpm install`             | 安装依赖                                    |
| `pnpm dev`                 | 启动本地开发服务器                          |
| `pnpm build`               | 构建生产版本到 `dist/`                      |
| `pnpm preview`             | 本地预览构建结果                            |
| `pnpm check`               | 运行 Astro 检查                            |
| `pnpm type-check`          | 运行 TypeScript 类型检查                    |
| `pnpm format`              | 格式化 `src/` 下的代码                      |
| `pnpm lint`                | 使用 Biome 检查并修复 `src/` 下的问题       |
| `pnpm new-post <filename>` | 创建新文章                                  |
| `pnpm astro ...`           | 运行 Astro CLI 命令                         |

## 🙏 Credits

这个项目基于 [saicaca/fuwari](https://github.com/saicaca/fuwari) 进行定制开发，在原本优秀的博客模板基础上，逐步改成了更适合我自己记录与展示内容的样子。

## 📄 License

项目代码遵循 MIT License。
