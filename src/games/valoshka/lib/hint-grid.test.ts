import { buildHintGrid } from "./hint-grid";

const answers = [
	"аба",
	"абвг",
	"абвгд",
	"абвгде",
	"абвгдеж",
	"ба",
	"вада",
	"гара",
	"аб",
];
const pangrams = ["абвгдеж"];

describe("buildHintGrid", () => {
	it("returns full grid when no words found", () => {
		const grid = buildHintGrid(answers, [], pangrams);
		expect(grid.lengthCounts.get(2)).toBe(2);
		expect(grid.lengthCounts.get(3)).toBe(1);
		expect(grid.lengthCounts.get(4)).toBe(3);
		expect(grid.lengthCounts.get(5)).toBe(1);
		expect(grid.lengthCounts.get(6)).toBe(1);
		expect(grid.lengthCounts.get(7)).toBe(1);
		expect(grid.unfoundPangramCount).toBe(1);
	});

	it("returns empty counts when all words found", () => {
		const grid = buildHintGrid(answers, [...answers], pangrams);
		expect(grid.lengthCounts.size).toBe(0);
		expect(grid.firstLetterGrid.size).toBe(0);
		expect(grid.prefixCounts.size).toBe(0);
		expect(grid.unfoundPangramCount).toBe(0);
	});

	it("excludes found words from counts", () => {
		const grid = buildHintGrid(answers, ["абвг", "вада", "абвгдеж"], pangrams);
		expect(grid.lengthCounts.get(4)).toBe(1);
		expect(grid.unfoundPangramCount).toBe(0);
	});

	it("builds firstLetterGrid with per-length counts", () => {
		const grid = buildHintGrid(answers, [], pangrams);
		const aGrid = grid.firstLetterGrid.get("а");
		expect(aGrid).toBeDefined();
		expect(aGrid?.get(2)).toBe(1);
		expect(aGrid?.get(3)).toBe(1);
		expect(aGrid?.get(4)).toBe(1);
		expect(aGrid?.get(5)).toBe(1);
		expect(aGrid?.get(6)).toBe(1);
		expect(aGrid?.get(7)).toBe(1);
	});

	it("builds two-letter prefix counts", () => {
		const grid = buildHintGrid(answers, [], pangrams);
		expect(grid.prefixCounts.get("аб")).toBe(6);
		expect(grid.prefixCounts.get("ва")).toBe(1);
		expect(grid.prefixCounts.get("га")).toBe(1);
	});

	it("handles case-insensitive matching", () => {
		const grid = buildHintGrid(["абвг", "вада"], ["АБВГ"], ["абвгдеж"]);
		expect(grid.lengthCounts.size).toBe(1);
		expect(grid.lengthCounts.get(4)).toBe(1);
		expect(grid.firstLetterGrid.get("в")?.get(4)).toBe(1);
	});
});
