import { NextResponse } from "next/server";
import {
	parseRequiredDayIndex,
	withPobachService,
} from "@/games/pobach/lib/api-helpers";
import { gameService } from "@/games/pobach/lib/container";

export const GET = withPobachService(async (request) => {
	const { searchParams } = new URL(request.url);
	const parsed = parseRequiredDayIndex(searchParams.get("dayIndex"));
	if ("errorResponse" in parsed) return parsed.errorResponse;
	const { dayIndex } = parsed;

	const currentDayIndex = gameService.getDailySecret().dayIndex;
	if (dayIndex > currentDayIndex) {
		return NextResponse.json(
			{ error: "Недапушчальны dayIndex" },
			{ status: 403 }
		);
	}

	const topWords = gameService.getTopWords(dayIndex, 100);

	return NextResponse.json(topWords, {
		headers: {
			"Cache-Control": "public, s-maxage=86400",
		},
	});
});
