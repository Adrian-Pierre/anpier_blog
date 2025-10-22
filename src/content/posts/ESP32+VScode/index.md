---
title: VScode 配置 ESP32 环境 ( ESP-IDF )
published: 2025-10-23
description: 在Window11上配置ESP32开发环境
image: ./cover.jpg
tags:
  - Environment
category: Embedded System
draft: false
---
# VScode下载

略

---

# 离线安装 ESP-IDF 环境

## IDF 下载

IDF离线下载网址：[https://dl.espressif.cn/dl/esp-idf/](https://dl.espressif.cn/dl/esp-idf/)

![](../../assets/image/index-2.png)
## IDF 安装

:::note
安装时必须关闭VSCode!
:::

![](../../assets/image/螢幕擷取畫面%202025-10-23%20003931.png)

![](../../assets/image/螢幕擷取畫面%202025-10-23%20004011.png)

![](../../assets/image/螢幕擷取畫面%202025-10-23%20004016.png)

![](../../assets/image/螢幕擷取畫面%202025-10-23%20004024.png)

![](../../assets/image/螢幕擷取畫面%202025-10-23%20004120.png)

![](../../assets/image/螢幕擷取畫面%202025-10-23%20004129.png)

:::note
在安装期间会弹出是否安装驱动的提示框，选择安装或者同意即可
:::

## 安装并配置 IDF 插件

![](../../assets/image/index-3.png)

![](../../assets/image/index-4.png)

![](../../assets/image/index-5.png)

![](../../assets/image/index-6.png)

随后等待安装完成即可

![](../../assets/image/螢幕擷取畫面%202025-10-22%20235357.png)

![](../../assets/image/index-7.png)

上图即为安装成功

---

## 新建工程并测试

![](../../assets/image/index-8.png)

![](../../assets/image/index-9.png)

![](../../assets/image/index-10.png)

![](../../assets/image/index-11.png)

随后右下角会提示【工程已经创建完毕，是否用新窗口打开工程？】，打开即可

![](../../assets/image/index-12.png)

![](../../assets/image/index-13.png)

烧录后，**输出** 提示如下

![](../../assets/image/index-14.png)

**终端** 提示如下

![](../../assets/image/index-15.png)

即环境安装成功