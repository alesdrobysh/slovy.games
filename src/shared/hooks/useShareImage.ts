"use client";

import posthog from "posthog-js";
import { useCallback, useState } from "react";

export type ShareImageFeedback =
	| "shared"
	| "downloaded"
	| "copied"
	| "failed"
	| null;

export interface UseShareImageOptions {
	/** Produces the PNG. Called before the share so the blob is ready. */
	getBlob: () => Promise<Blob>;
	filename: string;
	text: string;
	url: string;
}

function download(blob: Blob, filename: string): void {
	const href = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = href;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(href);
}

/** Share a rendered image: native file share, else download, else copy the
 *  text and link. Mirrors `useShare`'s shape and PostHog event. */
export function useShareImage({
	getBlob,
	filename,
	text,
	url,
}: UseShareImageOptions) {
	const [isSharing, setIsSharing] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [feedback, setFeedback] = useState<ShareImageFeedback>(null);

	const share = useCallback(async () => {
		if (isSharing) return;
		setIsSharing(true);

		let method = "failed";
		let result: ShareImageFeedback = "failed";

		try {
			const blob = await getBlob();
			const file = new File([blob], filename, { type: "image/png" });

			if (navigator.canShare?.({ files: [file] }) && navigator.share) {
				try {
					await navigator.share({ files: [file], text, url });
					method = "native_files";
					result = "shared";
				} catch (err) {
					if (err instanceof Error && err.name === "AbortError") {
						setIsSharing(false);
						return;
					}
					download(blob, filename);
					method = "download";
					result = "downloaded";
				}
			} else {
				download(blob, filename);
				method = "download";
				result = "downloaded";
			}
		} catch {
			try {
				await navigator.clipboard.writeText(`${text} ${url}`);
				method = "clipboard_text";
				result = "copied";
				setShowToast(true);
				setTimeout(() => setShowToast(false), 2000);
			} catch {
				method = "failed";
				result = "failed";
			}
		}

		posthog.capture("share_clicked", {
			game: "wrapped",
			context: "wrapped",
			method,
		});

		setFeedback(result);
		setTimeout(() => setFeedback(null), 2500);
		setIsSharing(false);
	}, [getBlob, filename, text, url, isSharing]);

	return { share, isSharing, showToast, feedback };
}
