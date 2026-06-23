import { readFile } from "node:fs/promises";
import { join } from "node:path";

const DICT_DIR = join(process.cwd(), "node_modules", "belmorph", "dict");

const ALLOWED = new Set([
	"meta.json",
	"dict.dawg.gz",
	"paradigms.bin.gz",
	"predict.dawg.gz",
]);

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ file: string }> }
): Promise<Response> {
	const { file } = await params;
	if (!ALLOWED.has(file)) return new Response("Not found", { status: 404 });

	const data = await readFile(join(DICT_DIR, file));
	const contentType = file.endsWith(".json")
		? "application/json"
		: "application/octet-stream";

	return new Response(data, {
		headers: {
			"Content-Type": contentType,
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
