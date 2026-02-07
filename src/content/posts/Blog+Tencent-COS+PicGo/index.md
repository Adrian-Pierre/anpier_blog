---
title: 腾讯云COS对象存储 + PicGo 搭建图床教程
published: 2025-12-01
description: 记录一下图床搭建的过程, 以供之后参考
tags:
  - Blog
  - Image Hosting
  - PicGo
  - Tencent Cloud
  - Configuration
category: Blog
draft: false
---
# PicGo 安装

给出官方GitHub网站, 自行下载

::github{repo="Molunerfinn/PicGo"}

---
# 创建存储桶

来到腾讯云[对象存储](https://console.cloud.tencent.com/cos)控制台，创建存储

![](../../assets/image/index-38.png)

访问权限选择 **公有读私有写** ，否则图片无法读取，其他的根据自己往下填写就可以。 地域建议离你所在的位置越近越好。

![](../../assets/image/index-41.png)
![](../../assets/image/index-40.png)

---
# 创建密钥

腾讯云头像–>[访问管理](https://console.cloud.tencent.com/cam/overview)–> [API密钥管理](https://console.cloud.tencent.com/cam/capi)，创建密钥，就会生成 **APPID、SecretId和SecretKey**

![](../../assets/image/index-42.png)

![](../../assets/image/index-44.png)

:::note
请务必保存好自己的密钥
:::

![](../../assets/image/index-45.png)

---
# PicGo设置

![](../../assets/image/index-49.png)

![](../../assets/image/index-46.png)

![](../../assets/image/index-47.png)

配置完即可顺利上传了, 还有很多功能自行探索