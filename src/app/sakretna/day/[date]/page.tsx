import { notFound } from "next/navigation";
import { pickForDate } from "@/games/sakretna/lib/puzzles";
import { GameShell } from "../../GameShell";

interface Props {
	params: Promise<{ date: string }>;
}

export const dynamic = "force-dynamic";

export default async function SakretnaDayPage({ params }: Props) {
	const { date } = await params;
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
	return <GameShell picked={pickForDate(date)} />;
}
