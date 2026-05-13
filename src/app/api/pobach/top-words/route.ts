import { NextResponse } from "next/server";
import {
	gameService,
	initializeGameService,
} from "@/games/pobach/lib/container";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const dayIndexStr = searchParams.get("dayIndex");

		if (!dayIndexStr) {
			return NextResponse.json(
				{ error: "Не пазначаны dayIndex" },
				{ status: 400 }
			);
		}

		const dayIndex = parseInt(dayIndexStr, 10);
		if (Number.isNaN(dayIndex)) {
			return NextResponse.json(
				{ error: "Няправільны dayIndex" },
				{ status: 400 }
			);
		}

		await initializeGameService();

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
	} catch (error) {
		console.error("API /api/pobach/top-words Error:", error);
		return NextResponse.json({ error: "Памылка сервера" }, { status: 500 });
	}
}
