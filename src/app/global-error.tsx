"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		posthog.captureException(error);
	}, [error]);

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
