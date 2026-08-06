import { NextResponse } from "next/server";
import { initializeGameService } from "@/games/pobach/lib/container";

/** Wraps a pobach API route handler with the initialize-or-500 and
 *  catch-all-error-500 boilerplate every /api/pobach/* route repeats. */
export function withPobachService(
	handler: (request: Request) => Promise<Response>
) {
	return async (request: Request): Promise<Response> => {
		try {
			await initializeGameService();
		} catch (initError) {
			console.error("Failed to initialize game service:", initError);
			return NextResponse.json(
				{ error: "Failed to initialize game service" },
				{ status: 500 }
			);
		}

		try {
			return await handler(request);
		} catch (error) {
			console.error(`API ${new URL(request.url).pathname} Error:`, error);
			return NextResponse.json({ error: "Памылка сервера" }, { status: 500 });
		}
	};
}

/** Parses and requires a dayIndex from a query string or a JSON body value.
 *  Returns either the parsed number or the error response to send as-is. */
export function parseRequiredDayIndex(
	raw: string | number | null | undefined
): { dayIndex: number } | { errorResponse: NextResponse } {
	if (raw === null || raw === undefined || raw === "") {
		return {
			errorResponse: NextResponse.json(
				{ error: "Не пазначаны dayIndex" },
				{ status: 400 }
			),
		};
	}

	const dayIndex = typeof raw === "number" ? raw : Number.parseInt(raw, 10);
	if (Number.isNaN(dayIndex)) {
		return {
			errorResponse: NextResponse.json(
				{ error: "Няправільны dayIndex" },
				{ status: 400 }
			),
		};
	}

	return { dayIndex };
}
