import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { listArticles } from "@/games/sakretna/lib/puzzles";
import { WrappedDeck } from "@/shared/components/wrapped/WrappedDeck";
import { isWrappedVisible, wrappedYearFor } from "@/shared/lib/wrapped/window";

export const metadata: Metadata = {
	title: "Твой год у Словах",
	// Hidden feature: keep it out of search results while it is gated.
	robots: { index: false, follow: false },
};

export default async function WrappedRoute({
	searchParams,
}: {
	searchParams: Promise<{ preview?: string }>;
}) {
	const { preview } = await searchParams;

	// Defence in depth: the proxy already guards this path, but the matcher
	// could change and this page must never render outside the window.
	if (!isWrappedVisible({ hasPreview: preview === "1" })) redirect("/");

	// Сакрэтна progress stores only the article id; the full article list is
	// too large for the client, so ship just the titles.
	const sakretnaTitles = Object.fromEntries(
		listArticles().map((a) => [a.id, a.title])
	);

	return (
		<WrappedDeck year={wrappedYearFor()} sakretnaTitles={sakretnaTitles} />
	);
}
