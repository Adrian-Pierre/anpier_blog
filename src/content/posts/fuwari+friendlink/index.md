---
title: Astro 和 Fuwari 的部署优化指南
published: 2025-12-14
description: Fuwari框架的使用指南
tags:
  - Environment
category: Blog
draft: false
---
# 添加友链

## 添加友链页面文件

在`src\content\spec`目录下新建文件`friends.md`

在`src\types\config.ts`文件约41行位置添加以下内容

```diff
export enum LinkPreset {
    Home = 0,
    Archive = 1,
    About = 2,
+   Friends = 3,
}
```

## 国际化i18n翻译

在`src\i18n\i18nKey.ts`文件约35行位置添加以下内容

```diff
    author = "author",
    publishedAt = "publishedAt",
    license = "license",
+   friends = 'friends',
```

按照自己的语言，在 `src\i18n\languages` 目录中编辑相应语言文件,以 `zh_CN.ts` 为例，在约 38 行位置添加内容

```diff
    [Key.author]: "作者",
    [Key.publishedAt]: "发布于",
    [Key.license]: "许可协议",
+   [Key.friends]: '友链',
```

在 `src\constants\link-presets.ts` 文件约 18 行位置添加内容

```diff
	[LinkPreset.Archive]: {
        name: i18n(I18nKey.archive),
        url: "/archive/",
    },
+   [LinkPreset.Friends]: {
+       name: i18n(I18nKey.friends),
+       url: '/friends/',
+   },
};
```

## 创建和配置页面的Astro文件并创建卡片效果友链

在`src\pages`目录下复制原本的`about.astro`文件，重命名为`friends.astro`

```js
---
import MainGridLayout from '../layouts/MainGridLayout.astro'
import { getCollection } from 'astro:content'
import { i18n } from '../i18n/translation'
import I18nKey from '../i18n/i18nKey'
import Markdown from '@components/misc/Markdown.astro'

const specPosts = await getCollection('spec')
const friendsPost = specPosts.find(post => post.id === 'friends.md')
const { Content } = await friendsPost.render()

const items = [
  {  
    title: 'Astro',  
    imgurl: 'https://avatars.githubusercontent.com/u/44914786?s=48&v=4',  
    desc: 'The web framework for content-driven websites. ⭐️ Star to support our work!',  
    siteurl: 'https://github.com/withastro/astro',  
    tags: [''],  
  },
 
]
---
<MainGridLayout title={i18n(I18nKey.friends)} description={i18n(I18nKey.friends)}>
    <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32">
        <div class="card-base z-10 px-9 py-6 relative w-full "> 
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 my-4">
                {items.map((item) => (   
                    <div class="flex flex-nowrap items-stretch h-28 gap-4 rounded-[var(--radius-large)]">
                        <div class="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-900">
                            <img src={item.imgurl} alt="站点头像" class="w-full h-full object-cover">
                        </div>
                        <div class="grow w-full">
                            <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 mb-1">{item.title}</div>
                            <div class="text-50 text-sm font-medium">{item.desc}</div>
                            <div class:list={["items-center", {"flex": true, "hidden md:flex" : false}]}>
                                <div class="flex flex-row flex-nowrap items-center">
                                    {(item.tags && item.tags.length > 0) && item.tags.map((tag,i) => (  
                                    <div class:list={[{"hidden": i==0}, "mx-1.5 text-[var(--meta-divider)] text-sm" ]}>
                                        /
                                    </div>  
                                    <span class="transition text-50 text-sm font-medium">
                                        {tag}
                                    </span>))}
                                    {!(item.tags && item.tags.length > 0) && <div class="transition text-50 text-sm font-medium">{i18n(I18nKey.noTags)}</div>}
                                </div>
                            </div>
                        </div>
                        <a href={item.siteurl} target="_blank" rel="noopener noreferrer"class="flex btn-regular w-[3.25rem] rounded-lg bg-[var(--enter-btn-bg)] hover:bg-[var(--enter-btn-bg-hover)] active:bg-[var(--enter-btn-bg-active)] active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="transition text-[var(--primary)] text-4xl mx-auto iconify iconify--material-symbols" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"></path>
                            </svg>
                        </a>
                    </div>
                ))}
            </div>  
            <Markdown class="mt-2"> 
                <Content />
            </Markdown>
        </div>
    </div>
</MainGridLayout>
```

## 在导航栏中添加友链页面

在 `src\config.ts` 文件约 `48` 行位置添加内容，注意要在 `LinkPreset.About` 末尾添加`,`

```diff
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
+   LinkPreset.About,
+   LinkPreset.Friends,
    {
```
