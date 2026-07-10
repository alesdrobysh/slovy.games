import Link from "next/link";
import { listArticles } from "@/games/redaktle/lib/puzzles";
import { Nav } from "@/shared/components/Nav";
import { Typography } from "@/shared/components/ui/Typography";

export const dynamic = "force-dynamic";

export default function CustomArticlePage() {
	const articles = listArticles();
	return (
		<>
			<Nav />
			<main className="mx-auto max-w-3xl px-5 sm:px-8 py-page-py flex flex-col gap-inset-lg">
				<header className="flex flex-col gap-flow-xs">
					<Typography variant="overline" as="span" className="text-redaktle">
						Рэдактле · Свой артыкул
					</Typography>
					<Typography variant="title" as="h1">
						Выберыце артыкул з нашай калекцыі
					</Typography>
					<Typography variant="body" className="text-ink-muted">
						Каб пагуляць са сваім артыкулам з Вікіпедыі, выберыце яго са спісу.
						Мы падрыхтавалі ўступы да некалькіх дзесяткаў артыкулаў пра
						Беларусь.
					</Typography>
				</header>
				<ul className="flex flex-col gap-flow-sm">
					{articles.map((a) => (
						<li key={a.id}>
							<Link
								href={`/redaktle/play/${a.id}`}
								className="block bg-card ring-1 ring-rule rounded-2xl p-inset-md hover:ring-redaktle transition-colors no-underline"
							>
								<Typography
									variant="subheading"
									as="h2"
									className="text-redaktle"
								>
									{a.title}
								</Typography>
								<Typography variant="label" as="p" className="text-ink-soft">
									{a.source.replace(
										"https://be.wikipedia.org/wiki/",
										"be.wikipedia.org › "
									)}
								</Typography>
							</Link>
						</li>
					))}
				</ul>
			</main>
		</>
	);
}
