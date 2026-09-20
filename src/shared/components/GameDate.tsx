import { Typography } from "@/shared/components/ui/Typography";
import type { GameId } from "@/shared/config";

const GAME_ACCENT_CLASSES: Record<GameId, string> = {
	pobach: "text-pobach",
	valoshka: "text-valoshka",
	sakretna: "text-sakretna",
};

interface GameDateProps {
	game: GameId;
	date: string;
}

export function GameDate({ game, date }: GameDateProps) {
	return (
		<Typography
			variant="overline"
			as="span"
			className={GAME_ACCENT_CLASSES[game]}
		>
			{date}
		</Typography>
	);
}
