---
title: SAMWISE 环境搭建与实验复现（RTX 5090）
published: 2026-02-10
description: 记录一下环境搭建的过程
tags:
  - Deep Learning
  - PyTorch
  - CUDA
  - SAMWISE
  - Environment Setup
category: Deep Learning
draft: false
---

:::note
要复现论文的github：[**SAMWISE**](https://github.com/ClaudiaCuttano/SAMWISE)
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

# 创建干净环境（Python 3.10）

```bash
conda create -n samwise python=3.10
```

```bash
conda activate samwise
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
git clone https://github.com/ClaudiaCuttano/SAMWISE.git
```

```bash
cd SAMWISE
```

---

# 安装依赖

```bash
pip install -U pip
```

先删除 `requirements.txt` 中的 `pyav` ，之后单独装

```bash
pip install -r requirements.txt
```

```bash
sudo apt install -y ffmpeg libavdevice-dev libavfilter-dev libavformat-dev libavcodec-dev libswscale-dev libswresample-dev
```

```bash
pip install av==12.0.0
```

---

# 快速 sanity check

```bash
python -c "from models.samwise import build_samwise; print('SAMWISE import OK')"
```

---

# 下载Ref-DAVIS17数据集

Downlaod the DAVIS2017 dataset from the [website](https://davischallenge.org/davis2017/code.html). Note that you only need to download the two zip files `DAVIS-2017-Unsupervised-trainval-480p.zip` and `DAVIS-2017_semantics-480p.zip`. Download the text annotations from the [website](https://www.mpi-inf.mpg.de/departments/computer-vision-and-machine-learning/research/video-segmentation/video-object-segmentation-with-language-referring-expressions). Then, put the zip files in the directory as follows.

```text
SAMWISE
├── data
│   ├── ref-davis
│   │   ├── DAVIS-2017_semantics-480p.zip
│   │   ├── DAVIS-2017-Unsupervised-trainval-480p.zip
│   │   ├── davis_text_annotations.zip
```

```bash
wget https://data.vision.ee.ethz.ch/csergi/share/davis/DAVIS-2017-Unsupervised-trainval-480p.zip
```

```bash
wget https://data.vision.ee.ethz.ch/csergi/share/davis/DAVIS-2017_semantics-480p.zip
```

```bash
wget https://www.mpi-inf.mpg.de/fileadmin/inf/d2/khoreva/davis_text_annotations.zip
```

Unzip these zip files.

```bash
unzip -o davis_text_annotations.zip
unzip -o DAVIS-2017_semantics-480p.zip
unzip -o DAVIS-2017-Unsupervised-trainval-480p.zip
```

Preprocess the dataset to Ref-Youtube-VOS format. (Make sure you are in the main directory)

```bash
python tools/data/convert_davis_to_ytvos.py
```

Finally, unzip the file `DAVIS-2017-Unsupervised-trainval-480p.zip` again (since we use `mv` in preprocess for efficiency).

```bash
unzip -o DAVIS-2017-Unsupervised-trainval-480p.zip
```

---

# 下载 Ref-DAVIS17 Model

```text
SAMWISE
├── pretrain
│   ├── final_model_mevis.pth
│   ├── final_model_ytvos.pth  
```

内网无法访问 google drive，自行下载到电脑上后，上传至服务器

|       Dataset       | Total Parameters | Trainable Params |   J&F    |                                              Model                                               |                                             Zip                                              |
| :-----------------: | :--------------: | :--------------: | :------: | :----------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: |
|      **MeViS**      |      210 M       |      4.9 M       | **49.5** |  [Weights](https://drive.google.com/file/d/1Molt2up2bP41ekeczXWQU-LWTskKJOV2/view?usp=sharing)   | [Zip](https://drive.google.com/file/d/10gnlVzFyPWa6pKk37eljKAR_7gJDcg72/view?usp=drive_link) |
| **MeViS - valid_u** |      210 M       |      4.9 M       | **57.1** |  [Weights](https://drive.google.com/file/d/1Molt2up2bP41ekeczXWQU-LWTskKJOV2/view?usp=sharing)   |                                              -                                               |
| **Ref-Youtube-VOS** |      210 M       |      4.9 M       | **69.2** | [Weights](https://drive.google.com/file/d/17Ei9XU678tCiiV14c-9EB9ZqXVrj4qEw/view?usp=drive_link) | [Zip](https://drive.google.com/file/d/1bkO8lyR6Vyk6lHIcQqscvlDPYRiVMQJs/view?usp=drive_link) |
|    **Ref-Davis**    |      210 M       |      4.9 M       | **70.6** | [Weights](https://drive.google.com/file/d/17Ei9XU678tCiiV14c-9EB9ZqXVrj4qEw/view?usp=drive_link) |                                              -                                               |

---

# 验证 Ref-DAVIS17 实验数据

由于我用的是5090，所以 `cuda` 和 `torch` 版本都不太一样

先修改文件 [`/SAMWISE/inference_davis.py`](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/inference_davis.py) 

我的服务器连接不上 `huggingface.co` ，所以重定向到国内镜像网站 `hf-mirror.com`

```bash
export HF_ENDPOINT=https://hf-mirror.com
export HF_HUB_ENABLE_HF_TRANSFER=0
```

开始验证：

```bash
python3 inference_davis.py --resume=/root/SAMWISE/pretrain/final_model_ytvos.pth --name_exp Ref-DAVIS17-evaluate  --HSA --use_cme_head
```



