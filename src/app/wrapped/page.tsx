import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WrappedDeck } from "@/shared/components/wrapped/WrappedDeck";
import {
	isWrappedVisible,
	WRAPPED_PREVIEW_COOKIE,
	wrappedYearFor,
} from "@/shared/lib/wrapped/window";

export const metadata: Metadata = {
	title: "Твой год у Словах",
	// Hidden feature: keep it out of search results while it is gated.
	robots: { index: false, follow: false },
};

export default async function WrappedRoute() {
	const cookieStore = await cookies();
	const hasPreviewCookie =
		cookieStore.get(WRAPPED_PREVIEW_COOKIE)?.value === "1";

	// Defence in depth: the proxy already guards this path, but the matcher
	// could change and this page must never render outside the window.
	if (!isWrappedVisible({ hasPreviewCookie })) redirect("/");

	return <WrappedDeck year={wrappedYearFor()} />;
}
