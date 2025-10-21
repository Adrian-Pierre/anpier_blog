---
title: 深度学习常用库介绍
published: 2025-10-21
tags:
  - library
category: Deep Learning
draft: false
---
# All Import
	
```python
import torch
from torch.utils.data import Dataset  #torchvision
from PIL import Image  #Pillow
import cv2  #opencv-python("pip install opencv-python")  
import os
```

# Dataset 

```python
Dataset??       #查看Dataset类的官方介绍  
help(Dataset)   #查看Dataset类的官方介绍
```

```python
import torch
from torch.utils.data import Dataset  #torchvision
import os
```

```python
class MyDataSet(Dataset):
    def __init__(self, root_dir, label_dir):
        self.root_dir       = root_dir
        self.label_dir      = label_dir
        self.path           = os.path.join(self.root_dir, self.label_dir)
        self.img_path_list  = os.listdir(self.path)

    def __len__(self):
        return len(self.img_path_list)
        
    def __getitem__(self, idx):
        img_name    = self.img_path_list[idx]
        img_path    = os.path.join(self.path, img_name)
        img         = Image.open(img_path)
        label       = self.label_dir
        
        return img, label
```

```python
my_dataset = MyDataSet("root_dir", "label_dir")
print(len(my_dataset))
img, label = my_dataset[idx]
```

---

# CV2 & Image
## Image

```python
from PIL import Image
```

```python
# 打开图片
img = Image.open("test.jpg")

# 显示图片
img.show()

# 转换格式
img = img.convert("L")   # 转为灰度图

# 调整大小
img = img.resize((200, 200))

# 保存图片
img.save("out.png")
```

## CV2

```python
import cv2
```

```python
# 读取图片
img = cv2.imread("test.jpg")

# 显示图片
cv2.imshow("Image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()

# 转为灰度
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 图像处理
blur = cv2.GaussianBlur(gray, (5, 5), 0)
edges = cv2.Canny(blur, 100, 200)

# 保存结果
cv2.imwrite("edges.jpg", edges)
```

---

# TensorBoard