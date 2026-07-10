import articlesData from "@/games/redaktle/data/articles.json";
import { serverLemmaOf } from "@/games/redaktle/lib/lemmatize.server";
import { tokenize } from "@/games/redaktle/lib/tokenize";
import { REDAKTLE_EPOCH_DATE } from "@/shared/config";
import { getMskDayIndex } from "@/shared/lib/timezone";
import type { Article, PickedArticle } from "../types";

const ARTICLES = articlesData as Article[];

export function listArticles(): Article[] {
	return ARTICLES;
}

export function getArticleById(id: string): Article | null {
	return ARTICLES.find((a) => a.id === id) ?? null;
}

export function getArticleForToday(): PickedArticle {
	const today = pickDate();
	return pickForDate(today);
}

export function pickForDate(date: string): PickedArticle {
	const idx = dayIndexForDate(date);
	const safe = ((idx % ARTICLES.length) + ARTICLES.length) % ARTICLES.length;
	const article = ARTICLES[safe];
	return {
		article,
		tokens: tokenize(article.body, serverLemmaOf),
		date,
	};
}

function pickDate(): string {
	const dayIndex = getMskDayIndex(REDAKTLE_EPOCH_DATE);
	return formatDateForDayIndex(REDAKTLE_EPOCH_DATE, dayIndex);
}

function dayIndexForDate(date: string): number {
	const target = new Date(`${date}T00:00:00Z`).getTime();
	const epoch = new Date(REDAKTLE_EPOCH_DATE).getTime();
	return Math.floor((target - epoch) / 86400000);
}

function formatDateForDayIndex(epoch: string, dayIndex: number): string {
	const e = new Date(epoch).getTime() + dayIndex * 86400000;
	return new Date(e).toISOString().slice(0, 10);
}
