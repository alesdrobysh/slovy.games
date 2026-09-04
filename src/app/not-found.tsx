import Link from "next/link";
import { Nav } from "@/shared/components/Nav";
import { Typography } from "@/shared/components/ui/Typography";

export default function NotFound() {
	return (
		<>
			<Nav />
			<div className="page-narrow page-container page-section">
				<Link
					href="/"
					className="text-ink-soft hover:text-ink transition-colors mb-inset-lg inline-block no-underline"
				>
					<Typography variant="overline" as="span">
						← Да гульняў
					</Typography>
				</Link>

				<Typography variant="title" as="h1" className="mb-inset-xl">
					Старонка не знойдзена
				</Typography>

				<Typography variant="body" className="text-ink-soft">
					Такая старонка не існуе. Магчыма, вы перайшлі па няправільнай
					спасылцы.
				</Typography>
			</div>
		</>
	);
}
