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
		},
	);

	const result = (await verify.json()) as { success: boolean };

	if (!result.success) {
		return new Response("verification failed", { status: 403 });
	}

	const redirect =
		typeof next === "string" && next.startsWith("/") ? next : "/";

	const cookie =
		`cf_human=1; Path=/; Max-Age=${60 * 60 * 12}; ` +
		"HttpOnly; Secure; SameSite=Lax";

	return new Response(JSON.stringify({ redirect }), {
		headers: {
			"content-type": "application/json",
			"set-cookie": cookie,
		},
	});
};
