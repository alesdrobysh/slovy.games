/**
 * Scrolls `element` to the vertical centre of the *visual* viewport.
 *
 * `scrollIntoView({ block: "center" })` centres within the layout viewport,
 * which on iOS keeps its full height while the keyboard is open, so the
 * target can land behind the keyboard. This uses the visual viewport instead.
 */
export function scrollIntoVisualViewport(element: Element): void {
	const viewport = window.visualViewport;
	if (!viewport) {
		element.scrollIntoView({ behavior: "smooth", block: "center" });
		return;
	}
	const rect = element.getBoundingClientRect();
	const elementCentre = rect.top + rect.height / 2;
	const viewportCentre = viewport.offsetTop + viewport.height / 2;
	window.scrollBy({
		top: Math.round(elementCentre - viewportCentre),
		behavior: "smooth",
	});
}
