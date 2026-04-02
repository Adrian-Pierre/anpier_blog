// @ts-nocheck
const MIME_BY_EXT = {
	avif: "image/avif",
	bmp: "image/bmp",
	gif: "image/gif",
	ico: "image/x-icon",
	jpeg: "image/jpeg",
	jpg: "image/jpeg",
	png: "image/png",
	svg: "image/svg+xml",
	webp: "image/webp",
} as const;

function inferImageType(target: string) {
	try {
		const pathname = new URL(target).pathname.toLowerCase();
		const ext = pathname.split(".").pop() || "";
		return MIME_BY_EXT[ext] || "application/octet-stream";
	} catch {
		return "application/octet-stream";
	}
}

export const onRequestGet = async (ctx) => {
	const requestUrl = new URL(ctx.request.url);
	const target = requestUrl.searchParams.get("url");

	if (!target) {
		return new Response("missing url", { status: 400 });
	}

	let remoteUrl;
	try {
		remoteUrl = new URL(target);
		if (!["http:", "https:"].includes(remoteUrl.protocol)) {
			throw new Error("unsupported protocol");
		}
	} catch {
		return new Response("invalid url", { status: 400 });
	}

	const upstream = await fetch(remoteUrl.toString(), {
		headers: {
			"user-agent": "Anpier Image Proxy",
		},
		cf: {
			cacheEverything: true,
			cacheTtl: 60 * 60 * 24 * 7,
		},
	});

	if (!upstream.ok || !upstream.body) {
		return new Response("upstream fetch failed", {
			status: upstream.status || 502,
		});
	}

	const upstreamType = upstream.headers.get("content-type") || "";
	const resolvedType = upstreamType.startsWith("image/")
		? upstreamType
		: inferImageType(remoteUrl.toString());

	const headers = new Headers();
	headers.set("content-type", resolvedType);
	headers.set("content-disposition", "inline");
	headers.set(
		"cache-control",
		"public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
	);

	const etag = upstream.headers.get("etag");
	if (etag) headers.set("etag", etag);

	const lastModified = upstream.headers.get("last-modified");
	if (lastModified) headers.set("last-modified", lastModified);

	return new Response(upstream.body, {
		status: 200,
		headers,
	});
};
