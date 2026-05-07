import type { FC } from "react";

interface DictionaryLinkProps {
  word: string;
  className?: string;
}

const DictionaryLink: FC<DictionaryLinkProps> = (props) => (
  <a
    href={`https://verbum.by/?q=${encodeURIComponent(props.word)}`}
    className={`hover:text-[var(--accent)] transition-colors underline-offset-2 hover:underline ${props.className ?? ""}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${props.word} (адкрыецца ў новым акне)`}
  >
    {props.word}
  </a>
);

DictionaryLink.displayName = "DictionaryLink";

export default DictionaryLink;
