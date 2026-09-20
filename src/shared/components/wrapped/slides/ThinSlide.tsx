import { Typography } from "@/shared/components/ui/Typography";
import { SlideFrame } from "./SlideFrame";

export interface ThinSlideProps {
	year: number;
}

export function ThinSlide({ year }: ThinSlideProps) {
	return (
		<SlideFrame variant="thin">
			<div className="wrapped-thin-pattern" aria-hidden="true">
				СЛОВЫ СЛОВЫ СЛОВЫ
			</div>
			<div className="wrapped-thin-card wrapped-reveal">
				<div className="wrapped-slide-title">
					<Typography variant="displayHeading">Яшчэ мала словаў</Typography>
				</div>
				<div className="wrapped-thin-copy">
					<Typography variant="bodyCentered">
						У {year} годзе ты сыграў занадта мала, каб зрабіць вынікі году.
						Пагуляй трохі — і вяртайся.
					</Typography>
				</div>
				<a href="/" className="wrapped-cta">
					<Typography variant="label">Да гульняў →</Typography>
				</a>
			</div>
		</SlideFrame>
	);
}
