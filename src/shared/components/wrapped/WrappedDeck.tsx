"use client";

export interface WrappedDeckProps {
	year: number;
}

export function WrappedDeck({ year }: WrappedDeckProps) {
	return <div data-testid="wrapped-deck">{year}</div>;
}
