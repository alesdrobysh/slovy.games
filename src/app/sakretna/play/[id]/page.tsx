import { notFound } from "next/navigation";
import { GameShell } from "@/app/sakretna/GameShell";
import { serverLemmaOf } from "@/games/sakretna/lib/lemmatize.server";
import { getArticleById } from "@/games/sakretna/lib/puzzles";
import { tokenize } from "@/games/sakretna/lib/tokenize";

export const dynamic = "force-dynamic";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function PlayArticlePage({ params }: Props) {
	const { id } = await params;
	const article = getArticleById(id);
	if (!article) notFound();
	const picked = {
		article,
		tokens: tokenize(article.body, serverLemmaOf),
		titleTokens: tokenize(article.title, serverLemmaOf),
		date: "custom",
	};
	return <GameShell picked={picked} />;
}
