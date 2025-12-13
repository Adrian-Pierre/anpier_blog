---
title: 点亮板载RGB + 封装成组件 + ESP-IDF
published: 2025-12-13
description: 网上类似资料信息比较少, 记录一下, 防止忘记
tags:
  - project
category: Embedded System
draft: false
---

# 下载官方 RGB 组件

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251213151219064.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251213151321516.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251213151353211.png)

可以在工程中看到已经导入的组件, 如下图

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251213151438239.png)

---

# 修改工程 CMakeLists.txt

:::note
注意, 是整个工程最外面的 **CMakeLists.txt**
:::

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251213152147350.png)

修改如下, 将名为 components 的目录添加到额外的组件搜索路径中

```diff lang="c"
    cmake_minimum_required(VERSION 3.5)
    include($ENV{IDF_PATH}/tools/cmake/project.cmake)
+   set(EXTRA_COMPONENT_DIRS components)
    project(ESP32_S3_Test)
```

---

# 添加组件

下载 **组件** 文件：[ Click! ](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/Board_RGB.zip)

将其放入 **components** 文件夹中

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251213152749474.png)

# 在 main.c 中使用

可看到板载 **RGB** 以红光闪烁

```c
#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "esp_err.h"
#include "Board_RGB.h"

static const char *TAG = "main";

void app_main(void)
{
    board_rgb_t rgb = {0};

    ESP_ERROR_CHECK(board_rgb_init(&rgb, 48)); // 我的 RGB LED 连接到 GPIO 48

    ESP_LOGI(TAG, "Start blinking board RGB");

    while (1) {
        ESP_ERROR_CHECK(board_rgb_set(&rgb, 255, 0, 0));
        vTaskDelay(pdMS_TO_TICKS(500));

        ESP_ERROR_CHECK(board_rgb_off(&rgb));
        vTaskDelay(pdMS_TO_TICKS(500));
    }
}
```