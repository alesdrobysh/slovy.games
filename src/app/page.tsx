import { isWrappedOpen } from "@/shared/lib/wrapped/window";
import { HubPageClient } from "./HubPageClient";

export default async function HubPage() {
	const wrappedVisible = isWrappedOpen();

	return <HubPageClient wrappedVisible={wrappedVisible} />;
}
