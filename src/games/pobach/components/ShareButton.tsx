"use client";

import { Share2 } from "lucide-react";
import { useMemo } from "react";
import { generateShareText } from "@/games/pobach/lib/share-text";
import type { Guess } from "@/games/pobach/types";
import { Button } from "@/shared/components/ui/Button";
import { useDictReady } from "@/shared/hooks/useDictReady";
import { useShare } from "@/shared/hooks/useShare";

type ShareButtonProps = {
	dayIndex: number;
	guesses: Guess[];
	won: boolean;
};

export default function ShareButton({
	dayIndex,
	guesses,
	won,
}: ShareButtonProps) {
	useDictReady();
	const text = useMemo(
		() => generateShareText({ dayIndex, guesses, won }),
		[dayIndex, guesses, won]
	);
	const { share, isSharing } = useShare(text, {
		game: "pobach",
		context: "finish",
	});

	return (
		<Button
			onClick={share}
			disabled={isSharing}
			variant="solid"
			color="primary"
			startIcon={<Share2 size={16} />}
		>
			Падзяліцца
		</Button>
	);
}
