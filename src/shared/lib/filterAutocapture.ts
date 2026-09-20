/** Keep replay visible while dropping repetitive game-control interaction events.
 * The installed PostHog SDK includes ancestor classes in $elements_chain. */
export function isNoisyAutocapture(
	event: { event: string; properties?: Record<string, unknown> } | null
): boolean {
	if (event?.event !== "$autocapture") return false;
	const elementsChain = event.properties?.$elements_chain;
	return (
		typeof elementsChain === "string" &&
		elementsChain.includes(".ph-no-autocapture")
	);
}
