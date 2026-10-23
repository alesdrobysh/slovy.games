import type { Instrumentation } from "next";

export function register() {}

function getPostHogDistinctId(cookieHeader: string | string[] | undefined) {
	if (!cookieHeader) return undefined;

	const cookieString = Array.isArray(cookieHeader)
		? cookieHeader.join("; ")
		: cookieHeader;
	const match = cookieString.match(/ph_phc_.*?_posthog=([^;]+)/);
	if (!match?.[1]) return undefined;

	try {
		const value = JSON.parse(decodeURIComponent(match[1]));
		return typeof value.distinct_id === "string"
			? value.distinct_id
			: undefined;
	} catch {
		return undefined;
	}
}

export const onRequestError: Instrumentation.onRequestError = async (
	error,
	request
) => {
	if (process.env.NEXT_RUNTIME !== "nodejs") return;

	const { getPostHogClient } = await import("@/shared/lib/posthog-server");
	const posthog = getPostHogClient();
	if (!posthog) return;

	const distinctId = getPostHogDistinctId(request.headers.cookie);
	await posthog.captureException(error, distinctId);
	await posthog.flush();
};
