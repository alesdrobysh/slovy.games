"use client";

import {
	createContext,
	useContext,
	useState,
	type ReactNode,
} from "react";

interface GameNavState {
	onHelpClick: (() => void) | null;
	extraActions: ReactNode | null;
}

interface GameNavContextValue extends GameNavState {
	setGameNav: (state: Partial<GameNavState>) => void;
	clearGameNav: () => void;
}

const GameNavContext = createContext<GameNavContextValue>({
	onHelpClick: null,
	extraActions: null,
	setGameNav: () => {},
	clearGameNav: () => {},
});

export function GameNavProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<GameNavState>({
		onHelpClick: null,
		extraActions: null,
	});

	return (
		<GameNavContext.Provider
			value={{
				...state,
				setGameNav: (next) => setState((prev) => ({ ...prev, ...next })),
				clearGameNav: () =>
					setState({ onHelpClick: null, extraActions: null }),
			}}
		>
			{children}
		</GameNavContext.Provider>
	);
}

export function useGameNav() {
	return useContext(GameNavContext);
}
