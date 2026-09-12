import { cookies } from "next/headers";
import { isWrappedOpen } from "@/shared/lib/wrapped/window";
import { HubPageClient } from "./HubPageClient";

export default async function HubPage() {
	const cookieStore = await cookies();
	const sakretnaUnlocked = cookieStore.get("sakretna_beta")?.value === "1";
	const wrappedVisible = isWrappedOpen();

	return (
		<HubPageClient
			sakretnaUnlocked={sakretnaUnlocked}
			wrappedVisible={wrappedVisible}
		/>
	);
}
