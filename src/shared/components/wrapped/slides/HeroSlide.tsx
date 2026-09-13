import { Typography } from "@/shared/components/ui/Typography";
import { pluralize } from "@/shared/lib/pluralize";
import { SlideFrame } from "./SlideFrame";

export interface HeroSlideProps {
	year: number;
	activeDays: number;
}

export function HeroSlide({ year, activeDays }: HeroSlideProps) {
	return (
		<SlideFrame variant="hero">
			<div className="wrapped-year-pattern" aria-hidden="true">
				{`${year}· `.repeat(32)}
			</div>
			<div className="wrapped-hero-ribbon" aria-hidden="true">
				СЛОВЫ · СЛОВЫ · СЛОВЫ
			</div>
			<div className="wrapped-burst wrapped-reveal">
				<Typography variant="overline">Год у Словах</Typography>
				<div className="wrapped-year">
					<Typography variant="displayHuge">{year}</Typography>
				</div>
				<Typography variant="caption">
					{activeDays > 0
						? `${activeDays} ${pluralize(activeDays, "дзень")} са словамі`
						: "Год словаў чакае"}
				</Typography>
			</div>
		</SlideFrame>
	);
}
