import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

function normalizeLabelKey(value: string) {
	return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function getCleanLabel(value: string) {
	return value.trim().replace(/\s+/g, " ");
}

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap = new Map<string, Tag>();
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			const cleanTag = getCleanLabel(tag);
			if (!cleanTag) return;

			const normalizedTag = normalizeLabelKey(cleanTag);
			const existingTag = countMap.get(normalizedTag);
			if (existingTag) {
				existingTag.count++;
				return;
			}

			countMap.set(normalizedTag, {
				name: cleanTag,
				count: 1,
			});
		});
	});

	return [...countMap.values()].sort((a, b) =>
		a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()),
	);
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count = new Map<string, Category>();
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			const normalizedUcKey = normalizeLabelKey(ucKey);
			const existingUc = count.get(normalizedUcKey);
			if (existingUc) {
				existingUc.count++;
				return;
			}

			count.set(normalizedUcKey, {
				name: ucKey,
				count: 1,
				url: getCategoryUrl(ucKey),
			});
			return;
		}

		const categoryName = getCleanLabel(
			typeof post.data.category === "string"
				? post.data.category
				: String(post.data.category),
		);
		if (!categoryName) return;

		const normalizedCategoryName = normalizeLabelKey(categoryName);
		const existingCategory = count.get(normalizedCategoryName);
		if (existingCategory) {
			existingCategory.count++;
			return;
		}

		count.set(normalizedCategoryName, {
			name: categoryName,
			count: 1,
			url: getCategoryUrl(categoryName),
		});
	});

	return [...count.values()].sort((a, b) =>
		a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()),
	);
}
