import { Typography } from "@/shared/components/ui/Typography";
import { SlideFrame } from "./SlideFrame";

export interface ThinSlideProps {
	year: number;
}

export function ThinSlide({ year }: ThinSlideProps) {
	return (
		<SlideFrame>
			<Typography variant="title" as="h2">
				Яшчэ мала словаў
			</Typography>
			<Typography variant="body" className="max-w-sm text-ink-muted">
				У {year} годзе ты сыграў занадта мала, каб зрабіць вынікі году. Пагуляй
				трохі — і вяртайся.
			</Typography>
			<a href="/" className="underline">
				<Typography variant="label">Да гульняў</Typography>
			</a>
		</SlideFrame>
	);
}
