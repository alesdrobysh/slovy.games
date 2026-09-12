import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WrappedDeck } from "@/shared/components/wrapped/WrappedDeck";
import { isWrappedVisible, wrappedYearFor } from "@/shared/lib/wrapped/window";

export const metadata: Metadata = {
	title: "Твой год у Словах",
	// Hidden feature: keep it out of search results while it is gated.
	robots: { index: false, follow: false },
};

export default async function WrappedRoute({
	searchParams,
}: {
	searchParams: Promise<{ preview?: string }>;
}) {
	const { preview } = await searchParams;

	// Defence in depth: the proxy already guards this path, but the matcher
	// could change and this page must never render outside the window.
	if (!isWrappedVisible({ hasPreview: preview === "1" })) redirect("/");

	return <WrappedDeck year={wrappedYearFor()} />;
}
