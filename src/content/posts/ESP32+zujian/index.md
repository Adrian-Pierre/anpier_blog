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

见 [ ESP32S3 + 组件添加教程 ](https://blog.anpier.xyz/posts/esp32addzujian/)

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

---

# GPIO 初始化重写

## gpio_setup

点击下载 : [ Click! ](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/gpio_setup.zip)

## 添加组件

见 [ ESP32S3 + 组件添加教程 ](https://blog.anpier.xyz/posts/esp32addzujian/)

## 在 main.c 中使用

```c
#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "esp_err.h"
#include "gpio_setup.h"

void app_main(void)
{
    static const gpio_config_item_t gpio_init_table[] = {
        {
            .gpio_num = GPIO_NUM_48,
            .mode = GPIO_MODE_OUTPUT,
            .pull_up_en = false,
            .pull_down_en = false,
            .level = 0,
            .intr_type = GPIO_INTR_DISABLE,
        },
        {
            .gpio_num = GPIO_NUM_0,
            .mode = GPIO_MODE_INPUT,
            .pull_up_en = true,
            .pull_down_en = false,
            .level = 0,
            .intr_type = GPIO_INTR_DISABLE,
        },
    };

    gpio_setup_init(
        gpio_init_table,
        sizeof(gpio_init_table) / sizeof(gpio_init_table[0])
    );
}
```

---

# u8g2库 点亮 OLED

## 修改 `main\idf_component.yml`

:::note
不能用 `tab` 来缩进, 不然会报错
:::

```diff
dependencies:
  ## Required IDF version
  idf:
    version: '>=4.1.0'
+ u8g2:
+   git: https://github.com/olikraus/u8g2.git
+ u8g2-hal-esp-idf:
+   git: https://github.com/mkfrey/u8g2-hal-esp-idf.git
```

编译结束后可在 `managed_components` 中看到下载好的组件

## 在 main.c 中使用

```c
#include <stdio.h>
#include <string.h>
#include <math.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "esp_err.h"
#include "u8g2.h"
#include "u8g2_esp32_hal.h"

#define PIN_SDA   GPIO_NUM_4 
#define PIN_SCL   GPIO_NUM_5 
#define OLED_I2C_ADDRESS 0x3C

u8g2_t u8g2;

void init_display(void)
{
    u8g2_esp32_hal_t u8g2_esp32_hal = U8G2_ESP32_HAL_DEFAULT;
    u8g2_esp32_hal.bus.i2c.sda = PIN_SDA;
    u8g2_esp32_hal.bus.i2c.scl = PIN_SCL;
    u8g2_esp32_hal_init(u8g2_esp32_hal);
    
    u8g2_Setup_ssd1306_i2c_128x64_noname_f(
        &u8g2, U8G2_R0,
        u8g2_esp32_i2c_byte_cb,
        u8g2_esp32_gpio_and_delay_cb); // init u8g2 structure

    u8x8_SetI2CAddress(&u8g2.u8x8, OLED_I2C_ADDRESS * 2);
    
    u8g2_InitDisplay(&u8g2);
    u8g2_SetPowerSave(&u8g2, 0);
    u8g2_ClearBuffer(&u8g2);
    
    u8g2_SetFont(&u8g2, u8g2_font_ncenB10_tr);
}

// 绘制函数示例
void draw_content(void) {
    u8g2_FirstPage(&u8g2);
    do {
        u8g2_DrawStr(&u8g2, 0, 15, "S3 OLED Demo!");
        u8g2_DrawStr(&u8g2, 0, 30, "Adrian!");
    } while (u8g2_NextPage(&u8g2));
}

void app_main(void)
{
    init_display();
    
    while(1) {
       draw_content();
       vTaskDelay(pdMS_TO_TICKS(5));
    }
}
```