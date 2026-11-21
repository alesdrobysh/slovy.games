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
	const isGzip = file.endsWith(".gz");

	return new Response(data, {
		headers: {
			"Content-Type": isGzip ? "application/octet-stream" : "application/json",
			// Serve the .gz files' own gzip layer as the transport encoding.
			// Otherwise the CDN may gzip them again; the browser then strips only
			// the outer layer, and belmorph's loader (which skips decompression
			// when Content-Encoding is gzip) parses still-compressed bytes.
			...(isGzip && { "Content-Encoding": "gzip" }),
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
