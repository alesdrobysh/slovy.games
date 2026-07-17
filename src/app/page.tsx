import { cookies } from "next/headers";
import { HubPageClient } from "./HubPageClient";

export default async function HubPage() {
	const cookieStore = await cookies();
	const sakretnaUnlocked = cookieStore.get("sakretna_beta")?.value === "1";

	return <HubPageClient sakretnaUnlocked={sakretnaUnlocked} />;
}
