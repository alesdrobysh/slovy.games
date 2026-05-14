"use client";

import { Share2 } from "lucide-react";
import { useMemo } from "react";
import type { Guess } from "@/games/pobach/core/entities/game";
import { generateShareText } from "@/games/pobach/lib/share-text";
import { Button } from "@/shared/components/ui/Button";
import { Toast } from "@/shared/components/ui/Toast";
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
	const text = useMemo(
		() => generateShareText({ dayIndex, guesses, won }),
		[dayIndex, guesses, won]
	);
	const { share, isSharing, showToast } = useShare(text);

	return (
		<div className="relative inline-block">
			<Button
				onClick={share}
				disabled={isSharing}
				variant="solid"
				color="primary"
				startIcon={<Share2 size={16} />}
			>
				Падзяліцца
			</Button>
			<Toast message="Скапіравана!" visible={showToast} />
		</div>
	);
}
