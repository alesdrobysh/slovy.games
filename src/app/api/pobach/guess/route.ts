import { NextResponse } from "next/server";
import {
	parseRequiredDayIndex,
	withPobachService,
} from "@/games/pobach/lib/api-helpers";
import { gameService } from "@/games/pobach/lib/container";
import { validateDayIndex } from "@/games/pobach/lib/utils";

export const GET = withPobachService(async (request) => {
	const { searchParams } = new URL(request.url);
	const word = searchParams.get("word");

	if (!word) {
		return NextResponse.json({ error: "Увядзіце слова" }, { status: 400 });
	}

	const parsed = parseRequiredDayIndex(searchParams.get("dayIndex"));
	if ("errorResponse" in parsed) return parsed.errorResponse;
	const { dayIndex } = parsed;

	const currentDayIndex = gameService.getDailySecret().dayIndex;
	if (!validateDayIndex(dayIndex, currentDayIndex)) {
		return NextResponse.json(
			{ error: "Недапушчальны dayIndex" },
			{ status: 400 }
		);
	}

	const result = gameService.makeGuess(word, dayIndex);

	return NextResponse.json(
		{ ...result, dayIndex },
		{
			headers: {
				"Cache-Control": "public, s-maxage=86400",
			},
		}
	);
});
