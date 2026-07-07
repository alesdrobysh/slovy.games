import Link from "next/link";

interface TryOtherGamesLinkProps {
	className?: string;
}

export function TryOtherGamesLink({ className = "" }: TryOtherGamesLinkProps) {
	return (
		<Link
			href="/"
			className={`text-sm underline underline-offset-4 transition-colors hover:opacity-80 ${className}`}
		>
			Паспрабуйце іншыя гульні →
		</Link>
	);
}
