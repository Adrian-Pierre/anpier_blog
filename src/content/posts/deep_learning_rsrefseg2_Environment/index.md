---
title: RSRefSeg2 环境搭建与实验复现（RTX A800）
published: 2026-02-14
description: 记录一下环境搭建的过程
tags:
  - Deep Learning
  - PyTorch
  - CUDA
  - RSRefSeg2
  - Environment Setup
category: Deep Learning
draft: false
---

:::note
要复现论文的github：[**RSRefSeg2**](https://github.com/KyanChen/RSRefSeg2)
:::

# 下载并安装 Miniconda

```bash
sudo apt update
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

# 创建干净环境（Python 3.10）

```bash
conda create -n rsrefseg2 python=3.11 -y
```

```bash
conda activate rsrefseg2
```

```bash
pip uninstall -y openxlab opendatalab
```

---

# 安装 A800 的 PyTorch

```bash
pip install torch==2.4.1 torchvision==0.19.1 torchaudio==2.4.1 --index-url https://download.pytorch.org/whl/cu121
```

---

# 安装 [MMCV2.2.x](https://mmcv.readthedocs.io/en/latest/get_started/installation.html)

```bash
pip install -U openmim
```

```bash
mim install mmcv==2.2.0
```

```bash
python -c "import mmcv; print(mmcv.__version__)"
```

---

# 安装其他依赖项

```bash
pip install deepspeed==0.17.2  # Windows系统不支持DeepSpeed训练，不需要安装，使用AMP混合精度训练
```

```bash
pip install transformers==4.53.1 datasets
```

```bash
pip install -U ipdb braceexpand mat4py pycocotools shapely ftfy scipy terminaltables wandb prettytable torchmetrics importlib_metadata einops peft
```

```bash
pip install hydra-core iopath
```

---

# 拉取 RSRefSeg 2 工程

```bash
cd ~
```

```bash
git clone https://github.com/KyanChen/RSRefSeg2.git
```

```bash
cd RSRefSeg2
```

---

# 下载 [RefSegRS](https://huggingface.co/datasets/JessicaYuan/RefSegRS/tree/main) 数据集

```bash
export HF_ENDPOINT=https://hf-mirror.com
```

```bash
pip install hf_transfer
```

```bash
export HF_HUB_ENABLE_HF_TRANSFER=1
```

```bash
huggingface-cli download JessicaYuan/RefSegRS \
	--repo-type dataset \
	--local-dir /home/ubuntu/RSRefSeg2/datasets/refsegrs
```

```bash
sudo apt install unzip
```

```bash
unzip RefSegRS.zip -d /home/ubuntu/RSRefSeg2/datasets/refsegrs
```

```text
RSRefSeg2/datasets/refsegrs
├── images/
├── masks/
├── output_phrase_test.txt
├── output_phrase_train.txt
├── output_phrase_val.txt
```

---

# 下载 [RRSIS-D](https://github.com/Lsan2401/RMSIN) 数据集 

```bash
huggingface-cli download \
  --repo-type dataset VoyageWang/rrsis-d \
  --local-dir /home/ubuntu/RSRefSeg2/datasets/rrsis_d 
```

```bash
unzip JPEGImages.zip -d /home/ubuntu/RSRefSeg2/datasets/rrsis_d/images
```

```text
ann_split 自行下载
```

```bash
unzip ann_split.zip -d /home/ubuntu/RSRefSeg2/datasets/rrsis_d/images
```

```text
RSRefSeg2/datasets/rrsis_d
├── rrsisd
│   ├── refs(unc).p
│   └── instances.json
├── images
    └── rrsisd
        ├── JPEGImages/
        └── ann_split/
```

---

# 下载官方 checkpoint 

自己创建文件夹 `/home/ubuntu/RSRefSeg2/checkpoints` 

## Refsegrs

```bash 
huggingface-cli download KyanChen/RSRefSeg2 \
  --local-dir /home/ubuntu/RSRefSeg2/checkpoints \
  --local-dir-use-symlinks False \
  --include "refsegrs.pth"
```

## RRSIS-D

```bash 
huggingface-cli download KyanChen/RSRefSeg2 \
  --local-dir /home/ubuntu/RSRefSeg2/checkpoints \
  --local-dir-use-symlinks False \
  --include "rrsisd.pth"
```

---

# 验证实验

## Refsegrs

修改 `/home/ubuntu/RSRefSeg2/configs_RSRefSeg2/refsegrs_infer.py` 中的数据集与保存路径

```py
work_dir = '/home/ubuntu/RSRefSeg2/work_dirs/refsegrs'
data_root = '/home/ubuntu/RSRefSeg2/datasets/refsegrs/images'
cache_dir = '/home/ubuntu/.cache/hf_models'
```

```bash
python tools_mmseg/test.py configs_RSRefSeg2/refsegrs_infer.py checkpoints/refsegrs.pth
```

```bash
02/14 05:06:32 - mmengine - INFO - per class results:
02/14 05:06:32 - mmengine - INFO - 
+------------+-------+-------+-------------+-------------+-------------+-------------+-------------+
|   class    |  cIoU |  gIoU | seg_acc_0.5 | seg_acc_0.6 | seg_acc_0.7 | seg_acc_0.8 | seg_acc_0.9 |
+------------+-------+-------+-------------+-------------+-------------+-------------+-------------+
| background |  98.8 | 98.67 |    100.0    |    99.94    |    99.89    |    99.61    |    98.29    |
|    mask    | 81.21 | 77.36 |    88.11    |    82.94    |    73.97    |    60.81    |     34.4    |
+------------+-------+-------+-------------+-------------+-------------+-------------+-------------+
```

## RRSIS-D

修改 `/home/ubuntu/RSRefSeg2/configs_RSRefSeg2/rrsisd_infer.py` 中的数据集与保存路径

```text
work_dir = '/home/ubuntu/RSRefSeg2/work_dirs/rrsis_d'
data_root = '/home/ubuntu/RSRefSeg2/datasets/rrsis_d/images/JPEGImages'
cache_dir = '/home/ubuntu/.cache/hf_models'
```

```bash
python tools_mmseg/test.py configs_RSRefSeg2/rrsisd_infer.py checkpoints/rrsisd.pth
```

```bash
02/14 05:27:16 - mmengine - INFO - per class results:
02/14 05:27:16 - mmengine - INFO - 
+------------+-------+-------+-------------+-------------+-------------+-------------+-------------+
|   class    |  cIoU |  gIoU | seg_acc_0.5 | seg_acc_0.6 | seg_acc_0.7 | seg_acc_0.8 | seg_acc_0.9 |
+------------+-------+-------+-------------+-------------+-------------+-------------+-------------+
| background |  98.9 | 98.85 |    100.0    |    99.94    |     99.8    |    99.37    |    97.87    |
|    mask    | 79.66 | 69.06 |    80.03    |    75.64    |    65.18    |    50.59    |    31.08    |
+------------+-------+-------+-------------+-------------+-------------+-------------+-------------+
```