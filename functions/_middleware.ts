// @ts-nocheck

export const onRequest = async (ctx) => {
	const url = new URL(ctx.request.url);
	const path = url.pathname;

	// 放行 gate 页面、校验接口、静态资源
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
