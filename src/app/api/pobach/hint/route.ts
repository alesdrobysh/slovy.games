import { NextResponse } from "next/server";
import {
	parseRequiredDayIndex,
	withPobachService,
} from "@/games/pobach/lib/api-helpers";
import { gameService } from "@/games/pobach/lib/container";
import { validateDayIndex } from "@/games/pobach/lib/utils";

const MIN_HINT_RANK = 1000;

export const POST = withPobachService(async (request) => {
	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch (_e) {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const { bestRank, usedRanks = [], sessionId: _sessionId, dayIndex } = body;

	if (typeof bestRank !== "number" || bestRank < 1) {
		return NextResponse.json(
			{ error: "Няправільны параметр bestRank" },
			{ status: 400 }
		);
	}

	if (!Array.isArray(usedRanks)) {
		return NextResponse.json(
			{ error: "Няправільны параметр usedRanks" },
			{ status: 400 }
		);
	}

	const parsed = parseRequiredDayIndex(
		typeof dayIndex === "number" ? dayIndex : null
	);
	if ("errorResponse" in parsed) return parsed.errorResponse;
	const { dayIndex: validDayIndex } = parsed;

	const currentDayIndex = gameService.getDailySecret().dayIndex;
	if (!validateDayIndex(validDayIndex, currentDayIndex)) {
		return NextResponse.json(
			{ error: "Недапушчальны dayIndex" },
			{ status: 400 }
		);
	}

	usedRanks.push(1);

	let targetRank = Math.ceil(bestRank / 2);
	if (targetRank < 1) {
		targetRank = 1;
	}

	if (targetRank > MIN_HINT_RANK) {
		targetRank = MIN_HINT_RANK;
	}

	while (usedRanks.includes(targetRank)) {
		targetRank++;
		if (targetRank > 100000) break;
	}

	const word = gameService.getWordByRank(targetRank, validDayIndex);

	if (!word) {
		console.error("Failed to get word for rank:", targetRank);
		return NextResponse.json(
			{ error: "Не ўдалося знайсці падказку" },
			{ status: 500 }
		);
	}

	return NextResponse.json({
		word,
		rank: targetRank,
		dayIndex: validDayIndex,
	});
});
