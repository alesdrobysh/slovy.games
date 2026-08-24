"use client";

import { ArrowDown, ArrowUp, ChevronsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/Button";

interface ArticleNavigatorProps {
	highlighted?: string | null;
}

function matchingHits(lemma: string | null | undefined): HTMLElement[] {
	if (!lemma) return [];
	return Array.from(
		document.querySelectorAll<HTMLElement>("[data-sakretna-lemma]")
	).filter((element) => element.dataset.sakretnaLemma === lemma);
}

export function ArticleNavigator({ highlighted }: ArticleNavigatorProps) {
	const [current, setCurrent] = useState(0);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		const hits = matchingHits(highlighted);
		setTotal(hits.length);
		setCurrent(hits.length > 0 ? 1 : 0);
	}, [highlighted]);

	const move = (direction: -1 | 1) => {
		const hits = matchingHits(highlighted);
		if (hits.length === 0) return;
		const next =
			((Math.max(current, 1) - 1 + direction + hits.length) % hits.length) + 1;
		setCurrent(next);
		hits[next - 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	return (
		<nav
			className="flex items-center gap-flow-xs"
			aria-label="Навігацыя па артыкуле"
		>
			<Button
				variant="ghost"
				size="sm"
				startIcon={<ChevronsUp size={16} />}
				aria-label="Да назвы артыкула"
				onClick={() =>
					document
						.getElementById("sakretna-article-top")
						?.scrollIntoView({ behavior: "smooth", block: "start" })
				}
			/>
			{total > 0 && (
				<>
					<Button
						variant="ghost"
						size="sm"
						startIcon={<ArrowUp size={16} />}
						aria-label="Папярэдняе супадзенне"
						onClick={() => move(-1)}
					/>
					<output
						className="min-w-12 text-center text-xs text-ink-muted"
						aria-live="polite"
					>
						{current} / {total}
					</output>
					<Button
						variant="ghost"
						size="sm"
						startIcon={<ArrowDown size={16} />}
						aria-label="Наступнае супадзенне"
						onClick={() => move(1)}
					/>
				</>
			)}
		</nav>
	);
}
