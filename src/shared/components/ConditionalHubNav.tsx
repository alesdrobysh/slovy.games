"use client";

import { usePathname } from "next/navigation";
import { HubNav } from "./HubNav";

export function ConditionalHubNav() {
	const pathname = usePathname();
	const isHub = pathname === "/";
	if (!isHub) return null;
	return <HubNav />;
}
