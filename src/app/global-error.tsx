"use client";

import posthog from "posthog-js";
import { useEffect, useState } from "react";
import {
	isChunkLoadError,
	reloadOnceForChunkError,
} from "@/shared/lib/chunkReload";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const [reloading, setReloading] = useState(() => isChunkLoadError(error));

	useEffect(() => {
		posthog.captureException(error);
		setReloading(reloadOnceForChunkError(error));
	}, [error]);

	if (reloading) {
		return (
			<html lang="be">
				<body />
			</html>
		);
	}

	return (
		<html lang="be">
			<body>
				<h1>Нешта пайшло не так</h1>
				<button type="button" onClick={reset}>
					Паспрабаваць яшчэ раз
				</button>
			</body>
		</html>
	);
}
