---
title: ESP32S3 + 组件添加教程
published: 2025-12-13
description: 网上类似资料信息比较少, 记录一下, 防止忘记
tags:
  - project
  - ESP32
category: Embedded System
draft: false
---
# 组件修改流程

## 组件结构

```objectivec
your_project/
├─ CMakeLists.txt          ← 根 CMake，不用改
├─ main/
│  ├─ CMakeLists.txt       ← 根 CMake，需要修改
│  └─ main.c
└─ components/
   └─ COMPONENT_NAME/      ← COMPONENT_NAME 为组件名字
      ├─ CMakeLists.txt
      ├─ COMPONENT_NAME.c
      └─ include/
         └─ COMPONENT_NAME.h
```

## 添加组件

下载或者自行编写 **组件** 文件, 将其放入 **components** 文件夹中 

:::note
**components**可能需要自行创建
:::

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251213152749474.png)


## 修改工程 CMakeLists.txt

:::note
注意, 是 `main\CMakeLists.txt`
:::

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251215000617007.png)

修改如下, 将名为 components 的目录添加到额外的组件搜索路径中

```diff
idf_component_register(
    SRCS "main.c"
    INCLUDE_DIRS "."
+   REQUIRES board_rgb 添加自己组件.h的名字
)
```
