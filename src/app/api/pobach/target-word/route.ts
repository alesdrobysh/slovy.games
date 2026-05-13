import { NextResponse } from "next/server";
import {
	gameService,
	initializeGameService,
} from "@/games/pobach/lib/container";
import { validateDayIndex } from "@/games/pobach/lib/utils";

export async function POST(request: Request) {
	try {
		try {
			await initializeGameService();
		} catch (initError) {
			console.error("Failed to initialize game service:", initError);
			return NextResponse.json(
				{ error: "Failed to initialize game service" },
				{ status: 500 }
			);
		}

		let body: Record<string, unknown>;
		try {
			body = await request.json();
		} catch (_e) {
			return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
		}

		const { dayIndex } = body;

		if (!dayIndex || typeof dayIndex !== "number") {
			return NextResponse.json(
				{ error: "Не пазначаны dayIndex" },
				{ status: 400 }
			);
		}

		const currentDayIndex = gameService.getDailySecret().dayIndex;
		if (!validateDayIndex(dayIndex, currentDayIndex)) {
			return NextResponse.json({ error: "Invalid dayIndex" }, { status: 400 });
		}

		const targetDayIndex = dayIndex ?? gameService.getDailySecret().dayIndex;
		const targetWord = gameService.getTargetWord(targetDayIndex);

		return NextResponse.json({
			targetWord,
			dayIndex: targetDayIndex,
		});
	} catch (error) {
		console.error("API /api/pobach/target-word Error:", error);
		return NextResponse.json({ error: "Памылка сервера" }, { status: 500 });
	}
}
