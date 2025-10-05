---
title: 配置 Conda + Pytorch + d2l 环境
published: 2025-10-05
description: "在Window系统上配置李沐深度学习相关环境"
#image: "./cover.jpg"
tags: [Environment]
category: Deep Learning
draft: false
---


## 软件安装

&emsp;&emsp;Anaconda官网下载 （[https://www.anaconda.com/download](https://www.anaconda.com/download)）

&emsp;&emsp;&emsp;&emsp;或者按照该博客来安装下载 （[最新版最详细Anaconda新手安装+配置+环境创建教程](https://blog.csdn.net/qq_44000789/article/details/142214660)）

&emsp;&emsp;Vscode官网下载 （[https://code.visualstudio.com/Download](https://code.visualstudio.com/Download)）

&emsp;&emsp;&emsp;&emsp;或者按照该博客来安装下载 （[vscode安装+配置+使用+调试【保姆级教程】](https://blog.csdn.net/weixin_60915103/article/details/131617196)）

## 环境配置

:::note
如果想要使用GPU进行深度学习模型的训练，就需要安装CUDA，我用的是Nvidia的GPU.
:::

### 安装CUDA以及cudnn

    检查自己电脑支持的CUDA版本：打开cmd执行.
```
nvidia-smi
```
    前往[官网](https://developer.nvidia.com/cuda-toolkit-archive)下载自己电脑支持版本的 CUDA ，我选择12.8.0版本.

        下载时选择自定义，勾选全部选项，并记住安装路径

    检验是否安装成功：打开cmd执行.
```
nvcc -V
```
    前往[官网](https://developer.nvidia.com/rdp/cudnn-archive)下载对应版本的 cudnn 压缩包，后进行解压，我选择8.9.7版本.