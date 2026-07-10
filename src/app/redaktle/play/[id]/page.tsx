import { notFound } from "next/navigation";
import { GameShell } from "@/app/redaktle/GameShell";
import { serverLemmaOf } from "@/games/redaktle/lib/lemmatize.server";
import { getArticleById } from "@/games/redaktle/lib/puzzles";
import { tokenize } from "@/games/redaktle/lib/tokenize";

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
		date: "custom",
	};
	return <GameShell picked={picked} />;
}
