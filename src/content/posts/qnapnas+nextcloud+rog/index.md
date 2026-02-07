---
title: 威联通 NAS + ROG 八爪鱼 + Nextcloud：家庭私有网盘
published: 2026-02-07
description: 家里的 NAS 放了很久，官方软件的界面太难用了，正好家里有公网ip，统一搞一下
tags:
  - NAS
  - Nextcloud
  - QNAP
  - Docker
  - WireGuard
category: HomeLab
draft: false
---
# 前言

家里的威联通 NAS 放了很久，说实话一直有点**吃灰**。

官方应用功能不少，但：
- 界面复杂
- 使用路径不直观
- 更像“系统”，而不是“网盘”

最近正好家里有 **公网 IPv4**，路由器是 **ROG 八爪鱼** ，所以想实现：

> **像用网盘一样用 NAS，但数据完全在自己家里。**

最终方案是：  
**WireGuard + Nextcloud**

---

# 我的网络与硬件环境

- NAS：**威联通 QNAP 464C**
- 路由器：**ASUS ROG 八爪鱼**
- 网络：
  - 公网 IPv4
  - WireGuard 作为唯一远程入口
- 系统部署方式：**Container Station（Docker）**

:::note
不暴露公网端口，只通过 VPN 访问私有云服务。
:::

---

# Nextcloud 应用拉取

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260207154548326.png)

镜像源使用了国内镜像站，解决拉取超时问题。

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260207154805080.png)

以下是我使用的，仅供参考：

```yaml
version: "3.8"

services:
  nextcloud-db:
    image: docker.1ms.run/library/mariadb:10.11
    container_name: nextcloud-db
    environment:
      MYSQL_ROOT_PASSWORD: "自行设置密码"
      MYSQL_DATABASE: "nextcloud"
      MYSQL_USER: "nextcloud"
      MYSQL_PASSWORD: "自行设置密码"
      TZ: "Asia/Shanghai"
    volumes:
      - /share/Container/nextcloud/db:/var/lib/mysql
    restart: unless-stopped
    networks: [nextcloud-net]

  nextcloud:
    image: docker.1ms.run/linuxserver/nextcloud:latest
    container_name: nextcloud
    ports:
      - "家里NAS的本地IP地址:8383:80"
    volumes:
      - /share/Container/nextcloud/config:/config
      - /share/Container/nextcloud/data:/data
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: "Asia/Shanghai"
    restart: unless-stopped
    networks: [nextcloud-net]
    depends_on:
      - nextcloud-db
      - onlyoffice

  onlyoffice:
    image: docker.1ms.run/onlyoffice/documentserver:latest
    container_name: onlyoffice
    environment:
      TZ: "Asia/Shanghai"
      JWT_ENABLED: "true"
      JWT_SECRET: "自行设置密码"
      ALLOW_PRIVATE_IP_ADDRESS: "true"
      DB_TYPE: "postgres"
      DB_HOST: "onlyoffice-postgresql"
      DB_PORT: "5432"
      DB_NAME: "onlyoffice"
      DB_USER: "onlyoffice"
      DB_PWD: "自行设置密码"
      AMQP_URI: "amqp://onlyoffice:自行设置密码@onlyoffice-rabbitmq"
    ports:
      - "家里NAS的本地IP地址:8888:80"
    volumes:
      - /share/Container/onlyoffice/logs:/var/log/onlyoffice
      - /share/Container/onlyoffice/data:/var/www/onlyoffice/Data
      - /share/Container/onlyoffice/lib:/var/lib/onlyoffice
      - /share/Container/onlyoffice/db-cache:/var/lib/onlyoffice/documentserver/App_Data/cache/files
      - /share/Container/fonts:/usr/share/fonts/truetype/custom:ro
    restart: unless-stopped
    networks: [nextcloud-net]
    depends_on:
      - onlyoffice-postgresql
      - onlyoffice-rabbitmq

  onlyoffice-postgresql:
    image: docker.1ms.run/library/postgres:12
    container_name: onlyoffice-postgresql
    environment:
      POSTGRES_DB: "onlyoffice"
      POSTGRES_USER: "onlyoffice"
      POSTGRES_PASSWORD: "自行设置密码"
      TZ: "Asia/Shanghai"
    volumes:
      - /share/Container/onlyoffice/pgsql:/var/lib/postgresql/data
    restart: unless-stopped
    networks: [nextcloud-net]

  onlyoffice-rabbitmq:
    image: docker.1ms.run/library/rabbitmq:3
    container_name: onlyoffice-rabbitmq
    environment:
      TZ: "Asia/Shanghai"
      RABBITMQ_DEFAULT_USER: "onlyoffice"
      RABBITMQ_DEFAULT_PASS: "自行设置密码"
    volumes:
      - /share/Container/onlyoffice/rabbitmq:/var/lib/rabbitmq
    restart: unless-stopped
    networks: [nextcloud-net]

networks:
  nextcloud-net:
    driver: bridge

```

---

# 初始化 Nextcloud

第一次访问：

```C
http://NAS内网IP:8383
```

初始化页面需要注意 **数据库主机** 这一项：

```text
数据库类型：MySQL / MariaDB
数据库用户：nextcloud
数据库密码：******
数据库名：nextcloud
数据库主机：nextcloud-db:3306
```

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/e978c7aedb165e3bb82045cd97fc9efc.png)

:::note
**不要填 localhost**  
因为 Nextcloud 和数据库在不同容器中。
:::

等待5min后（有概率504，不要管），重新进入该网址，可以看到初始化成功：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/zF77pUZ0pMYjohBq1YGN0k.png)

---

# 路由器配置 DDNS

进入路由器配置界面，我这台路由器的默认本地 **IP** 是 **192.168.50.1**：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260207155113834.png)

我这里使用的是 [**NOIP**](https://www.noip.com/) 的免费服务，每一个账号享有一个，太感谢了！！

自行注册账号并添加：

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260207155804378.png)

在 **NOIP** 添加好之后，在路由器界面填写自己注册的信息，点击 **应用本页面设置** ，等待几分钟后，看到注册成功，即成功添加

---

# 添加 WireGuard VPN 服务

进入路由器配置界面
 ![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/20260207160224233.png)

创建新的 **VPN** 客户端，在手机上或者电脑上下载软件 **WireGuard** ，扫描二维码或者导入配置添加设备

之后哪怕在外面，没有连接到家里的局域网，开启 **VPN** 也可以用本地 **IP** 连接到 **路由器** 和**NAS**

---

# 总结

折腾这一圈，其实NAS 不是不好用，只是以前用法不对。

把复杂的东西都藏在后面，只留下 Nextcloud 这个“入口”，  
再用 WireGuard 把访问方式收紧，整个体验一下子就顺了。

现在用起来就是：
- 在外面先连一下 WireGuard
- 打开 Nextcloud
- 跟用普通网盘没什么区别

还不得不感叹一句，华硕的八爪鱼真NB，不愧是钞能力
