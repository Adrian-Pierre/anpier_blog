---
title: Cloudflare Turnstile 为静态博客添加「无感」人机验证
published: 2026-02-09
description: 给自己的网站加一个人机验证
tags:
  - Blog
  - Fuwari
  - Cloudflare
  - Turnstile
  - Middleware
category: Blog
draft: false
---
# Cloudflare 就是神，不接受反驳

Cloudflare 就是神，不接受反驳

---

# 创建 Turnstile 组件

进入 [**Cloudflare Turnstile**](https://www.cloudflare.com/zh-cn/application-services/products/turnstile/) 官网，创建组件

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/3259b53a238063cec3c70c631b41c254.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/1b0d33b24718121307c4a1a8488a0ab8.png)

:::note
**配置建议**：
- **模式**：Managed
- **域名**：你的站点域名
- **预先许可（Cookie）**：关闭（我们自己控制）
:::

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/484f177e1213f9d077ea12b4f90c866e.png)

创建完成之后可以看到页面跳转，得到两个值
- **Site Key**（前端用）
- **Secret Key**（服务端用）

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/4fce00132c7ba86def2fd8af68f72ed4.png)

---

# 在 Pages 中配置 Secret Key

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/073e6b907221fa3b701c57be6049439d.png)

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/ccfebf099107070ddbdd04eaaf65b8e7.png)

:::note
- Name: TURNSTILE_SECRET（一个字母都不能变）
- Value: xxxxxxxx（Secret Key）
:::

![](https://raw.githubusercontent.com/Adrian-Pierre/anpier_blog_image/main/src/e30d04592df603187928404ae4a991da.png)

---

# 创建 gate 页面（前端）

新建文件：

```text
src/pages/gate.astro
```

这是一个 **自动检测 token → 自动跳转** 的代码（YOUR_SITE_KEY自行修改）：

```astro
---
const siteKey = "YOUR_SITE_KEY";
const next = Astro.url.searchParams.get("next") ?? "/";
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Human verification</title>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  </head>

  <body class="gate">
    <main class="card">
      <h1>正在验证</h1>
      <p class="desc">正常用户将自动通过，请稍候…</p>
      <div class="cf-turnstile" data-sitekey={siteKey}></div>
    </main>

    <script define:vars={{ next }}>
      const timer = setInterval(async () => {
        const tokenEl = document.querySelector(
          'input[name="cf-turnstile-response"]'
        );
        const token = tokenEl?.value;
        if (!token) return;

        clearInterval(timer);

        const res = await fetch("/api/turnstile-verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token, next }),
        });

        if (res.ok) {
          const data = await res.json();
          location.replace(data.redirect || "/");
        }
      }, 400);
    </script>
  </body>
</html>

```

---

# 服务端校验 Turnstile（Pages Functions）

新建文件（ `functions` 文件夹在根目录下自行创建）：

```text
functions/api/turnstile-verify.ts
```

```ts
// @ts-nocheck

export const onRequestPost = async (ctx) => {
  const { token, next } = await ctx.request.json().catch(() => ({}));

  if (!token) {
    return new Response("missing token", { status: 400 });
  }

  const form = new FormData();
  form.append("secret", ctx.env.TURNSTILE_SECRET);
  form.append("response", token);

  const ip = ctx.request.headers.get("CF-Connecting-IP");
  if (ip) form.append("remoteip", ip);

  const verify = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: form,
    }
  );

  const result = await verify.json();
  if (!result.success) {
    return new Response("verification failed", { status: 403 });
  }

  const redirect =
    typeof next === "string" && next.startsWith("/") ? next : "/";

  const cookie =
    "cf_human=1; Path=/; Max-Age=43200; HttpOnly; Secure; SameSite=Lax";

  return new Response(JSON.stringify({ redirect }), {
    headers: {
      "content-type": "application/json",
      "set-cookie": cookie,
    },
  });
};

```

---

# 全站拦截（Middleware）

新建文件：

```text
functions/_middleware.ts
```

```ts
// @ts-nocheck

export const onRequest = async (ctx) => {
  const url = new URL(ctx.request.url);
  const path = url.pathname;

  if (
    path.startsWith("/gate") ||
    path.startsWith("/api/turnstile-verify") ||
    path.startsWith("/_astro/") ||
    path.startsWith("/assets/") ||
    path.startsWith("/favicon")
  ) {
    return ctx.next();
  }

  const cookie = ctx.request.headers.get("Cookie") || "";
  const passed = /(?:^|;\s*)cf_human=1(?:;|$)/.test(cookie);

  if (!passed) {
    const next = encodeURIComponent(path + url.search);
    return Response.redirect(`${url.origin}/gate?next=${next}`, 302);
  }

  return ctx.next();
};
```

---

# 部署与测试

将修改后的代码 `push` 到 `github` 

## 测试流程

1. 无痕窗口访问首页 → 自动跳 `/gate`
2. 正常浏览器 → 页面一闪直接回首页
3. VPN / 异常环境 → 出现 Turnstile 勾选
4. 验证成功后：
    - Cookie：`cf_human=1`
    - 12 小时内全站免验证