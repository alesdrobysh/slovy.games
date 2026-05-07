import { NextResponse } from "next/server";
import { gameService, initializeGameService } from "@/games/pobach/lib/container";
import { validateDayIndex } from "@/games/pobach/lib/utils";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const word = searchParams.get("word");
		const dayIndexStr = searchParams.get("dayIndex");

		if (!word) {
			return NextResponse.json({ error: "Патрабуецца слова" }, { status: 400 });
		}

		if (!dayIndexStr) {
			return NextResponse.json(
				{ error: "Патрабуецца dayIndex" },
				{ status: 400 },
			);
		}

		const dayIndex = parseInt(dayIndexStr, 10);
		if (Number.isNaN(dayIndex)) {
			return NextResponse.json(
				{ error: "Няправільны індэкс дня" },
				{ status: 400 },
			);
		}

		try {
			await initializeGameService();
		} catch (initError) {
			console.error("Failed to initialize game service:", initError);
			return NextResponse.json(
				{ error: "Failed to initialize game service" },
				{ status: 500 },
			);
		}

		const currentDayIndex = gameService.getDailySecret().dayIndex;
		if (!validateDayIndex(dayIndex, currentDayIndex)) {
			return NextResponse.json(
				{ error: "Недапушчальны індэкс дня" },
				{ status: 400 },
			);
		}

		const result = gameService.makeGuess(word, dayIndex);

		return NextResponse.json(
			{ ...result, dayIndex },
			{
				headers: {
					"Cache-Control": "public, s-maxage=86400",
				},
			},
		);
	} catch (error) {
		console.error("API /api/pobach/guess Error:", error);
		return NextResponse.json({ error: "Памылка сервера" }, { status: 500 });
	}
}
