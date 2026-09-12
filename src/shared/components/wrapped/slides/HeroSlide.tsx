import { Typography } from "@/shared/components/ui/Typography";
import { pluralize } from "@/shared/lib/pluralize";
import { SlideFrame } from "./SlideFrame";

export interface HeroSlideProps {
	year: number;
	activeDays: number;
}

export function HeroSlide({ year, activeDays }: HeroSlideProps) {
	return (
		<SlideFrame>
			<Typography variant="overline" className="text-ink-muted">
				Год у Словах
			</Typography>
			<Typography variant="statHero" as="p">
				{year}
			</Typography>
			<Typography variant="caption" className="text-ink-muted">
				{activeDays > 0
					? `${activeDays} ${pluralize(activeDays, "дзень")} са словамі`
					: "Год словаў чакае"}
			</Typography>
		</SlideFrame>
	);
}
