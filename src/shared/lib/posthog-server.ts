import { PostHog } from "posthog-node";

let posthogClient: PostHog | null | undefined;

export function getPostHogClient(): PostHog | null {
	if (posthogClient !== undefined) return posthogClient;

	const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
	const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
	if (!key || !host) {
		if (process.env.NODE_ENV !== "production") {
			const variable = key
				? "NEXT_PUBLIC_POSTHOG_HOST"
				: "NEXT_PUBLIC_POSTHOG_KEY";
			throw new Error(
				`${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
			);
		}
		posthogClient = null;
		return posthogClient;
	}

	posthogClient = new PostHog(key, {
		host,
		flushAt: 1,
		flushInterval: 0,
		enableExceptionAutocapture: true,
	});
	return posthogClient;
}
