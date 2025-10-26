---
title: 深度学习工程模板
published: 2025-10-26
description: Deep learning Demo Project
tags:
  - project
category: Deep Learning
draft: false
---
# Import

```python
import os
import cv2
import PIL
import torch
import torchvision
import numpy as np
from torch import nn
from torch.utils.data import DataLoader
from torchvision.models import VGG16_Weights
from torch.utils.tensorboard import SummaryWriter
```

# GPU训练

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("使用设备：{}".format(device))
```

# 准备&加载数据集

```python
# 准备数据集
train_dataset = torchvision.datasets.CIFAR10(
    root        = "./dataset/CIFAR10",
    train       = True,
    download    = True,
    transform   = torchvision.transforms.ToTensor()
)
train_dataset_size = len(train_dataset)
  
test_dataset = torchvision.datasets.CIFAR10(
    root        = "./dataset/CIFAR10",
    train       = False,
    download    = True,
    transform   = torchvision.transforms.ToTensor()
)
test_dataset_size  = len(test_dataset)

print("----数据集导入成功----")
print("训练集大小：{}".format(train_dataset_size))
print("测试集大小：{}".format(test_dataset_size))


# 加载数据集
train_dataloader = DataLoader(
    dataset     = train_dataset,
    batch_size  = 64,
    shuffle     = True,
    num_workers = 0,
    drop_last   = False
)

test_dataloader = DataLoader(
    dataset     = test_dataset,
    batch_size  = 64,
    shuffle     = True,
    num_workers = 0,
    drop_last   = False
)
```

# 创建网络模型

```python
class My_Model(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1      = nn.Conv2d(
            in_channels     = 3, 
            out_channels    = 32, 
            kernel_size     = 5, 
            padding         = 2
        )
        self.maxpool1   = nn.MaxPool2d(
            kernel_size = 2,
        )
        self.conv2      = nn.Conv2d(
            in_channels     = 32, 
            out_channels    = 32, 
            kernel_size     = 5, 
            padding         = 2
        )
        self.maxpool2   = nn.MaxPool2d(
            kernel_size = 2,
        )
        self.conv3      = nn.Conv2d(
            in_channels     = 32, 
            out_channels    = 64, 
            kernel_size     = 5, 
            padding         = 2
        )
        self.maxpool3   = nn.MaxPool2d(
            kernel_size = 2,
        )
        self.flatten    = nn.Flatten()
        self.linear1    = nn.Linear(
            in_features    = 64 * 4 * 4,    
            out_features   = 64
        )
        self.linear2    = nn.Linear(
            in_features    = 64,
            out_features   = 10
        )
        self.seq        = nn.Sequential(
            self.conv1,
            self.maxpool1,
            self.conv2,
            self.maxpool2,
            self.conv3,
            self.maxpool3,
            self.flatten,
            self.linear1,
            self.linear2
        )
    
    def forward(self, input):
        output = self.seq(input)
        return output
    
my_model = My_Model()
my_model = my_model.to(device)
```

# 损失函数

```python
loss_fn = nn.CrossEntropyLoss()
loss_fn = loss_fn.to(device)
```

# 优化器

```python
Learnig_rate = 0.002
optim = torch.optim.Adam(
    params      = my_model.parameters(),
    lr          = Learnig_rate
)
```

# 设置训练参数&开始训练

```python
total_train_step = 0 # 记录训练的次数
total_test_step  = 0 # 记录测试的次数
epoch = 10          # 训练轮数
writer = SummaryWriter("./logs")  # TensorBoard 日志保存路径

for i in range(epoch):
    print("--------第 {} 轮训练开始--------".format(i + 1))
    
    # 训练步骤
    my_model.train()
    for data in train_dataloader:
        imgs, targets = data
        imgs    = imgs.to(device)
        targets = targets.to(device)
        
        outputs = my_model(imgs)
        loss = loss_fn(outputs, targets)

        optim.zero_grad()   # 清空上一步的残余更新参数值
        loss.backward()     # 反向传播，计算参数更新值
        optim.step()       # 更新参数

        total_train_step += 1
        if total_train_step % 100 == 0:
            print("训练次数：{}，Loss：{}".format(total_train_step, loss.item()))
            writer.add_scalar("train_loss", loss.item(), total_train_step)

    torch.save(my_model.state_dict(), "./My_Model/model_{}.pth".format(i))
    print("模型已保存")

    # 测试步骤
    my_model.eval()
    total_test_loss = 0
    total_accuracy  = 0
    with torch.no_grad():
        for data in test_dataloader:
            imgs, targets = data
            imgs    = imgs.to(device)
            targets = targets.to(device)

            outputs = my_model(imgs)
            loss = loss_fn(outputs, targets)
            total_test_loss += loss.item()
            accuracy = (outputs.argmax(1) == targets).sum()
            total_accuracy += accuracy

    print("整体测试集上的Loss：{}".format(total_test_loss))
    print("整体测试集上的正确率：{}".format(total_accuracy / test_dataset_size))
    writer.add_scalar("test_loss", total_test_loss, total_test_step)
    writer.add_scalar("test_accuracy", total_accuracy / test_dataset_size, total_test_step)
    total_test_step += 1
```