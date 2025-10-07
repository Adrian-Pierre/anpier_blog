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

Anaconda官网下载 （[https://www.anaconda.com/download](https://www.anaconda.com/download)）

&emsp;&emsp;或者按照该博客来安装下载 （[最新版最详细Anaconda新手安装+配置+环境创建教程](https://blog.csdn.net/qq_44000789/article/details/142214660)）

Vscode官网下载 （[https://code.visualstudio.com/Download](https://code.visualstudio.com/Download)）

&emsp;&emsp;或者按照该博客来安装下载 （[vscode安装+配置+使用+调试【保姆级教程】](https://blog.csdn.net/weixin_60915103/article/details/131617196)）

---

## 环境配置

:::note
如果想要使用GPU进行深度学习模型的训练，就需要安装CUDA，我用的是Nvidia的GPU.
:::

### 安装CUDA以及cudnn

检查自己电脑支持的CUDA版本：打开cmd执行.

```cmd
nvidia-smi
```

前往[官网](https://developer.nvidia.com/cuda-toolkit-archive)下载自己电脑支持版本的 CUDA ，我选择12.8.0版本.

> 下载时选择自定义，勾选下载全部选项，并记住安装路径.

检验是否安装成功：打开cmd执行.

```cmd
nvcc -V
```

前往[官网](https://developer.nvidia.com/rdp/cudnn-archive)下载对应版本的 cudnn 压缩包，后进行解压，我选择8.9.7版本.

进入指定目录（上文记住的安装路径），如C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.8，将bin，include，lib三个文件夹拖入进行替换.<br><br>

### 创建虚拟环境并配置pytorch

打开Anaconda Prompt，创建环境：

```conda
conda create -n 虚拟环境名 python=3.9
```

激活环境：

```conda
conda activate 虚拟环境名
```

查看环境是否创建成功：

```conda
conda env list
```

安装Pytorch命令复制网址： [https://pytorch.org/get-started/locally](https://pytorch.org/get-started/locally/)

选择自己版本的选项，在环境激活的情况下，复制命令并安装.

创建.py文件，并将conda中刚刚安装环境中的python作为解释器，具体教程看:

<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1Fo46e3EAZ&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

> 运行下列代码，不报错即安装成功:

```python
import torch
print(torch.__version__)
print(torch.cuda.is_available())
```

---

## 软件配置

### Jupyter Notebook

打开Anaconda Prompt，激活环境后，执行：

```conda
pip install jupyter
```

下载完后，执行，查看Jupyter的配置路径，只需看到路径，终端中输入 "N" 即可：

```conda
jupyter notebook --generate-config
```

进入路径，打开 "jupyter_notebook_config" 文件，搜索：

```conda
The directory to use
```

原文件如下：

```conda
## The directory to use for notebooks and kernels.
#  Default: ''
# c.ServerApp.root_dir = ''
```

修改为：

```conda
## The directory to use for notebooks and kernels.
#  Default: ''
c.ServerApp.root_dir = '默认打开路径'
```

打开Anaconda Prompt，激活环境后，执行：

```conda
conda install ipykernel
```

将环境写入内核：

```conda
python -m ipykernel --user --name 你创建环境的名字 --display-name "你创建环境的名字"
```

### d2l库安装

打开Anaconda Prompt，激活环境后，执行：

```conda
pip install d2l
```

> 运行下列代码，不报错即安装成功:

```python
import torch
from d2l import torch as d2l
```
