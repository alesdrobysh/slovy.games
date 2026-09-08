import { getPuzzleForToday } from "@/games/valoshka/lib/puzzles";
import { Typography } from "@/shared/components/ui/Typography";
import { GameShell } from "./GameShell";

export const dynamic = "force-dynamic";

export default function ValoshkaPage() {
	const puzzle = getPuzzleForToday();
	return (
		<GameShell puzzle={puzzle} currentDate={puzzle.date}>
			<ValoshkaSeo />
		</GameShell>
	);
}

function ValoshkaSeo() {
	return (
		<section className="page-container page-section">
			<div className="page-narrow flex flex-col gap-section-gap">
				<div className="flex flex-col gap-flow-lg">
					<Typography variant="subheading" as="h2">
						Як гуляць у «Валошку»?
					</Typography>
					<Typography variant="body" as="p">
						Складайце беларускія словы з сямі прапанаваных літар. Цэнтральная
						літара абавязкова павінна ўваходзіць у кожнае слова, а само слова
						мусіць мець не менш за чатыры літары. Чым большае слова — тым больш
						балаў.
					</Typography>
				</div>
				<div className="flex flex-col gap-flow-lg">
					<Typography variant="subheading" as="h2">
						Што такое «Валошка»?
					</Typography>
					<Typography variant="body" as="p">
						«Валошка» — штодзённая беларуская слоўная гульня. Кожны дзень
						з'яўляецца новы набор літар. Гуляць можна бясплатна, анлайн і без
						рэгістрацыі — проста адкрыйце старонку і пачніце складаць словы.
					</Typography>
				</div>
			</div>
		</section>
	);
}
