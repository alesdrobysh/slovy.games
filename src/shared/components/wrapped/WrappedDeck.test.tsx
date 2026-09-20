import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { HistoryRecord } from "@/games/pobach/types";
import { POBACH_EPOCH_DATE } from "@/shared/config";
import { dayIndexForDate } from "@/shared/lib/timezone";
import { WrappedDeck } from "./WrappedDeck";

function seedPobach(dates: string[]): void {
	const history: Record<string, HistoryRecord> = {};
	for (const date of dates) {
		const dayIndex = dayIndexForDate(POBACH_EPOCH_DATE, date);
		history[String(dayIndex)] = {
			dayIndex,
			won: true,
			attempts: 5,
			bestRank: 1,
			completedAt: Date.parse(`${date}T12:00:00Z`),
			guesses: [],
		};
	}
	localStorage.setItem(
		"pobach_storage",
		JSON.stringify({ version: 2, history, stats: {} })
	);
}

const SIX_DAYS = [
	"2026-03-01",
	"2026-03-02",
	"2026-03-03",
	"2026-03-04",
	"2026-03-05",
	"2026-03-06",
];

beforeEach(() => {
	localStorage.clear();
});

describe("WrappedDeck", () => {
	it("shows the hero slide first", async () => {
		seedPobach(SIX_DAYS);
		render(<WrappedDeck year={2026} />);
		expect(await screen.findByText("2026")).toBeInTheDocument();
	});

	it("renders one dot per slide and drops the valoshka group", async () => {
		seedPobach(SIX_DAYS);
		render(<WrappedDeck year={2026} />);
		// hero + common + 2 pobach + share
		expect(await screen.findAllByTestId("wrapped-dot")).toHaveLength(5);
	});

	it("advances on right-arrow and stops at the last slide", async () => {
		seedPobach(SIX_DAYS);
		render(<WrappedDeck year={2026} />);
		await screen.findByText("2026");

		await userEvent.keyboard("{ArrowRight}");
		expect(screen.getByText("Разам за год")).toBeInTheDocument();

		for (let i = 0; i < 10; i++) await userEvent.keyboard("{ArrowRight}");
		const dots = screen.getAllByTestId("wrapped-dot");
		expect(dots[dots.length - 1]).toHaveAttribute("data-active", "true");
	});

	it("goes back on left-arrow and stops at the first slide", async () => {
		seedPobach(SIX_DAYS);
		render(<WrappedDeck year={2026} />);
		await screen.findByText("2026");

		await userEvent.keyboard("{ArrowRight}");
		await userEvent.keyboard("{ArrowLeft}");
		await userEvent.keyboard("{ArrowLeft}");
		expect(screen.getAllByTestId("wrapped-dot")[0]).toHaveAttribute(
			"data-active",
			"true"
		);
	});

	it("collapses to the thin deck with too little data", async () => {
		seedPobach(["2026-03-01", "2026-03-02"]);
		render(<WrappedDeck year={2026} />);
		expect(await screen.findByText("Яшчэ мала словаў")).toBeInTheDocument();
		expect(screen.getAllByTestId("wrapped-dot")).toHaveLength(2);
	});

	it("collapses to the thin deck with no data", async () => {
		render(<WrappedDeck year={2026} />);
		expect(await screen.findByText("Яшчэ мала словаў")).toBeInTheDocument();
	});
});
