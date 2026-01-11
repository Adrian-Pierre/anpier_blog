---
title: STM32H743XIH6 + HAL库 + CubeMX配置
published: 2025-10-29
description: 记录一下遇到的问题和解决办法，省的自己过段时间全忘了
tags:
  - Environment
  - Stm32
category: Embedded System
draft: false
---

# CubeMX配置

芯片选择STM32H743XIH6，TFBGA 240封装

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-16.png)

## RCC配置

HSE高速时钟使用外部晶振，其他采用默认设置。

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-17.png)

接下来配置时钟

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-18.png)

## [GPIO](https://so.csdn.net/so/search?q=GPIO&spm=1001.2101.3001.7020)配置

我这块板子上默认是PC13作为LED灯控制引脚：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-19.png)

## DEBUG配置

:::note
该项一定要配置！！！
:::

我采用SW模式进行下载和调试程序：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-20.png)

## 生成代码

部分设置如图所示：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-21.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-22.png)

最后点击 **GENERATE CODE** 生成代码

# Keil5

## Target配置

打开 **Target** 选项卡：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-23.png)

框中选项 **必须** 勾选，否则串口重定向后无法使用printf函数，程序会卡死：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-25.png)

框中选项 **必须** 勾选，以便程序可以右键跳转到函数或变量定义处：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-26.png)

框中选择自己使用的仿真器，我用的是ST-Link，点击Settings后如下图所示：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-27.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-28.png)

框中选项 **必须** 勾选

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-29.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-31.png)

## Configuration配置

打开 **Configuration** 选项卡：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-33.png)

我习惯于使用 **UTF-8** 格式，并且加上代码补全提示：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/index-34.png)