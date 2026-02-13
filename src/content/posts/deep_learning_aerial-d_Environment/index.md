---
title: aerial-d 环境搭建与实验复现（RTX 5090）
published: 2026-02-10
description: 记录一下环境搭建的过程
tags:
  - Deep Learning
  - PyTorch
  - CUDA
  - aerial-d
  - Environment Setup
category: Deep Learning
draft: false
---

:::note
要复现论文的github：[**aerial-d**](https://github.com/luispl77/aerial-d)
:::

# 下载并安装 Miniconda

```bash
sudo apt update
```

```bash
cd ~
```

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
```

```bash
bash Miniconda3-latest-Linux-x86_64.sh
```

```bash
Do you wish the installer to initialize Miniconda3? yes
```

---

# 创建干净环境（Python 3.12）

```bash
conda create -n aerial python=3.12
```

```bash
conda activate aerial
```

---

# 安装 RTX5090 必须的 PyTorch（Nightly cu128）

```bash
pip install --pre torch torchvision torchaudio \
  --index-url https://download.pytorch.org/whl/nightly/cu128
```

---

# 验证 GPU 是否正确支持

```bash
python - <<'PY'
import torch
print("torch:", torch.__version__)
print("cuda runtime:", torch.version.cuda)
print("gpu available:", torch.cuda.is_available())
print("gpu name:", torch.cuda.get_device_name(0))
PY
```

---

# 拉取 SAMWISE 工程

```bash
cd ~
```

```bash
git clone https://github.com/luispl77/aerial-d.git
```

```bash
cd aerial-d
```

---

# 安装依赖

```bash
pip install -U pip
```

```text
这两句添加注释
# torch==2.7.1
# torchvision==0.22.1
```

```bash
pip install -i https://pypi.org/simple -r requirements.txt
```


---

# 快速 check

```bash
python -c "import torch; print(torch.__version__); print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0)); print(torch.cuda.get_device_capability(0))"
```

---

# 下载数据集

```bash
cd ~/aerial-d
```

```bash
huggingface-cli download luisml77/aerial-d --repo-type dataset --local-dir datagen/dataset
```

```bash
cd ~/aerial-d/datagen/dataset
```

```bash
sudo apt install unzip
```

```bash
unzip aeriald.zip
```

---

# 下载 checkpoint

```bash
cd ~/aerial-d/rsrefseg
```

```bash
huggingface-cli download luisml77/rsrefseg \
  --repo-type model \
  --local-dir models
```

---

# 验证实验数据

```bash
cd ~/aerial-d
```

```bash
python test.py \
  --model_name rsrefseg_combined \
  --dataset_type aeriald \
  --sam_model facebook/sam-vit-large
```



