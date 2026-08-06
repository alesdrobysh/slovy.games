import { NextResponse } from "next/server";
import {
	parseRequiredDayIndex,
	withPobachService,
} from "@/games/pobach/lib/api-helpers";
import { gameService } from "@/games/pobach/lib/container";
import { validateDayIndex } from "@/games/pobach/lib/utils";

export const POST = withPobachService(async (request) => {
	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch (_e) {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const { dayIndex } = body;
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

	const targetWord = gameService.getTargetWord(validDayIndex);

	return NextResponse.json({
		targetWord,
		dayIndex: validDayIndex,
	});
});
