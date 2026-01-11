---
title: 配置 Vscode + Git + Github
published: 2026-01-11
description: 我原来的电脑被我格式化了，环境都需要从头开始配，顺便记录一下
tags:
  - Environment
category: Blog
draft: false
---
# Github 注册

略

# 下载 Vscode

下载网站：[Click!](https://code.visualstudio.com/download)

下载完成后，在 **Vscode** 中登录自己的 **Github**账号

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260111172954454.png)

## 下载 & 安装 Git

下载网站：[Click!](https://git-scm.com/install/windows)

下载相应版本的 **Git** ，可以得到:

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260111170836463.png)

点击安装：

:::note
没有展示的图片都是默认
:::

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260111171028945.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260111171103927.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260111171133209.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260111171159119.png)

# 配置 Git

打开 **Git** 终端

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260111171545060.png)

用自己 **github** 的 **用户名** 和 **邮箱**

```console
git config --global user.name "John Doe" 
git config --global user.email johndoe@example.com
```

我用的是 **V2ray** 作为梯子，他的代理端口默认显示在最下方：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260111172344851.png)

如上图可见，我这边的代理端口是10809，接着在 **Git** 终端中输入：

```console 
git config --global http.proxy http://127.0.0.1:10809 
git config --global https.proxy http://127.0.0.1:10809
```

即可设置代理，提高连接速度

# Push 至 Github

如果不经过配置，会出现如下报错：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260111173213322.png)

经检查发现，当开启了“保持邮箱私有（Keep my email addresses private）”选项时，如果本地 Git 使用的是真实邮箱地址进行提交，GitHub 为了保护你的隐私会拦截这次推送

故输入如下代码：

```console 
git config --global user.email "你的ID+用户名@users.noreply.github.com"
git commit --amend --reset-author --no-edit
```

邮箱可在 **Github** 主页找到：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260111174234427.png)

即可成功解决