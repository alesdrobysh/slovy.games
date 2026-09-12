import { cookies } from "next/headers";
import {
	isWrappedVisible,
	WRAPPED_PREVIEW_COOKIE,
} from "@/shared/lib/wrapped/window";
import { HubPageClient } from "./HubPageClient";

export default async function HubPage() {
	const cookieStore = await cookies();
	const sakretnaUnlocked = cookieStore.get("sakretna_beta")?.value === "1";
	const wrappedVisible = isWrappedVisible({
		hasPreviewCookie: cookieStore.get(WRAPPED_PREVIEW_COOKIE)?.value === "1",
	});

	return (
		<HubPageClient
			sakretnaUnlocked={sakretnaUnlocked}
			wrappedVisible={wrappedVisible}
		/>
	);
}
