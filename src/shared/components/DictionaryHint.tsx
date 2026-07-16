import { BookOpen } from "lucide-react";
import { Typography } from "@/shared/components/ui/Typography";

export function DictionaryHint() {
	return (
		<Typography
			variant="overline"
			as="span"
			className="flex items-center gap-flow-xs text-ink-muted normal-case tracking-normal"
		>
			<BookOpen size={12} />
			<span className="hidden sm:inline">Слоўнік па кліку на слова</span>
			<span className="sm:hidden">Націсніце на слова</span>
		</Typography>
	);
}
