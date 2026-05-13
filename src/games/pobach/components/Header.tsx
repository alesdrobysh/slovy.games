"use client";

import { useEffect } from "react";
import { useGameNav } from "@/shared/components/GameNavContext";

export default function Header({ onHelpClick }: { onHelpClick?: () => void }) {
	const { setGameNav, clearGameNav } = useGameNav();

	useEffect(() => {
		setGameNav({ onHelpClick: onHelpClick ?? null });
		return () => clearGameNav();
	}, [onHelpClick]); // eslint-disable-line react-hooks/exhaustive-deps

	return null;
}
