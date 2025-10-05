---
title: 配置Conda + Pytorch + d2l
published: 2025-10-05
description: "在Window系统上配置李沐深度学习相关环境"
#image: "./cover.jpg"
tags: [Environment]
category: Deep_Learning
draft: false
---



This blog template is built with [Astro](https://astro.build/). For the things that are not mentioned in this guide, you may find the answers in the [Astro Docs](https://docs.astro.build/).

## Front-matter of Posts

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
---
```

| Attribute     | Description      |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | The title of the post.                                                                       |
| `published`   | The date the post was published.                                                             |
| `description` | A short description of the post. Displayed on index page.                                    |
| `image`       | The cover image path of the post.<br/>1. Start with `http://` or `https://`: Use web image<br/>2. Start with `/`: For image in `public` dir<br/>3. With none of the prefixes: Relative to the markdown file |
| `tags`        | The tags of the post.|
| `category`    | The category of the post. |
| `draft`        | If this post is still a draft, which won't be displayed.|

## Where to Place the Post Files



Your post files should be placed in `src/content/posts/` directory. You can also create sub-directories to better organize your posts and assets.

```python
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```
