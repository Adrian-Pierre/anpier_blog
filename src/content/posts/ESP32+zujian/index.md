---
title: ESP32 + 自己编写的组件陈列
published: 2025-12-15
description: 都是自己写的组件
tags:
  - project
  - ESP32
category: Embedded System
draft: false
---

# 板载 RGB

## board_rgb

点击下载 : [ Click! ](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/Board_RGB.zip)

## 下载官方 RGB 组件

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251213151219064.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251213151321516.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251213151353211.png)

可以在工程中看到已经导入的组件, 如下图

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20251213151438239.png)

## 添加组件

见 [ ESP32S3 + 组件添加教程 ]()

## 在 main.c 中使用

可看到板载 **RGB** 以红光闪烁

```c
#include <stdio.h>
#include <string.h>
#include <math.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "esp_err.h"
#include "board_rgb.h"

static const char *TAG = "main";

static void hsv_to_rgb(float h, float s, float v,
                       uint8_t *r, uint8_t *g, uint8_t *b)
{
    float c = v * s;
    float x = c * (1 - fabsf(fmodf(h / 60.0f, 2) - 1));
    float m = v - c;

    float rf = 0, gf = 0, bf = 0;
    
    if (h < 60) {
        rf = c; gf = x; bf = 0;
    } else if (h < 120) {
        rf = x; gf = c; bf = 0;
    } else if (h < 180) {
        rf = 0; gf = c; bf = x;
    } else if (h < 240) {
        rf = 0; gf = x; bf = c;
    } else if (h < 300) {
        rf = x; gf = 0; bf = c;
    } else {
        rf = c; gf = 0; bf = x;
    }
    
    *r = (uint8_t)((rf + m) * 255);
    *g = (uint8_t)((gf + m) * 255);
    *b = (uint8_t)((bf + m) * 255);

}

void app_main(void)
{
    board_rgb_t rgb = {0};

    ESP_ERROR_CHECK(board_rgb_init(&rgb, 48)); // 我的 RGB LED 连接到 GPIO 48
    
    ESP_LOGI(TAG, "Start rainbow RGB effect");
    
    float hue = 0.0f;
    uint8_t r, g, b;
    
    while (1) {
        hsv_to_rgb(hue, 1.0f, 0.3f, &r, &g, &b); // 0.3 比较柔和，不刺眼
        ESP_ERROR_CHECK(board_rgb_set(&rgb, r, g, b));
    
        hue += 2.0f;          // 调整这个值控制“转得快不快”
        if (hue >= 360.0f) {
            hue = 0.0f;
        }
    
        vTaskDelay(pdMS_TO_TICKS(20)); // 越小越顺
    }

}
```

