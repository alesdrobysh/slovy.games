import posthog from "posthog-js";
import type { FC } from "react";

interface DictionaryLinkProps {
	word: string;
	source: string;
	className?: string;
}

const DictionaryLink: FC<DictionaryLinkProps> = (props) => (
	<a
		href={`https://verbum.by/?q=${encodeURIComponent(props.word)}`}
		className={`hover:text-(--accent) transition-colors underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-valoshka/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm ${props.className ?? ""}`}
		target="_blank"
		rel="noopener noreferrer"
		aria-label={`${props.word} (адкрыецца ў новым акне)`}
		onClick={() =>
			posthog.capture("dictionary_link_clicked", {
				word: props.word,
				source: props.source,
			})
		}
	>
		{props.word}
	</a>
);

DictionaryLink.displayName = "DictionaryLink";

export default DictionaryLink;
