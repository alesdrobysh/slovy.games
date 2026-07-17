"use client";

import { Share2 } from "lucide-react";
import { useMemo } from "react";
import { generateShareText } from "@/games/valoshka/lib/share-text";
import { Button } from "@/shared/components/ui/Button";
import { useShare } from "@/shared/hooks/useShare";

interface ShareButtonProps {
	date: string;
	rankName: string;
	rankIdx: number;
	score: number;
}

export function ShareButton({
	date,
	rankName,
	rankIdx,
	score,
}: ShareButtonProps) {
	const text = useMemo(
		() => generateShareText({ date, rankName, rankIdx, score }),
		[date, rankName, rankIdx, score]
	);
	const { share, isSharing, showToast } = useShare(text, {
		game: "valoshka",
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
			{showToast ? "Скапіравана!" : "Падзяліцца"}
		</Button>
	);
}
