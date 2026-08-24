import articlesData from "@/games/sakretna/data/articles.json";
import { serverLemmaOf } from "@/games/sakretna/lib/lemmatize.server";
import { tokenize } from "@/games/sakretna/lib/tokenize";
import { SAKRETNA_EPOCH_DATE } from "@/shared/config";
import {
	dateForDayIndex,
	dayIndexForDate,
	getGameDay,
} from "@/shared/lib/timezone";
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
	const idx = dayIndexForDate(SAKRETNA_EPOCH_DATE, date);
	const safe = ((idx % ARTICLES.length) + ARTICLES.length) % ARTICLES.length;
	const article = ARTICLES[safe];
	return {
		article,
		tokens: tokenize(article.body, serverLemmaOf),
		titleTokens: tokenize(article.title, serverLemmaOf),
		date,
	};
}

function pickDate(): string {
	const dayIndex = getGameDay("sakretna");
	return dateForDayIndex(SAKRETNA_EPOCH_DATE, dayIndex)
		.toISOString()
		.slice(0, 10);
}
