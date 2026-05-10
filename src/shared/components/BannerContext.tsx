"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

type BannerId = "cookie" | "sw-update";

interface BannerContextValue {
	register: (id: BannerId, priority: number) => void;
	unregister: (id: BannerId) => void;
	setWantsToShow: (id: BannerId, val: boolean) => void;
	activeBannerId: BannerId | null;
}

const BannerContext = createContext<BannerContextValue | null>(null);

export function BannerProvider({ children }: { children: React.ReactNode }) {
	const registryRef = useRef<Map<BannerId, number>>(new Map());
	const [wants, setWants] = useState<Set<BannerId>>(new Set());

	const activeBannerId = useMemo(() => {
		let best: BannerId | null = null;
		let bestPriority = -Infinity;
		for (const id of wants) {
			const priority = registryRef.current.get(id) ?? -Infinity;
			if (priority > bestPriority) {
				best = id;
				bestPriority = priority;
			}
		}
		return best;
	}, [wants]);

	const register = useCallback((id: BannerId, priority: number) => {
		registryRef.current.set(id, priority);
	}, []);

	const unregister = useCallback((id: BannerId) => {
		registryRef.current.delete(id);
		setWants((prev) => {
			if (!prev.has(id)) return prev;
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
	}, []);

	const setWantsToShow = useCallback((id: BannerId, val: boolean) => {
		setWants((prev) => {
			const has = prev.has(id);
			if (val === has) return prev;
			const next = new Set(prev);
			val ? next.add(id) : next.delete(id);
			return next;
		});
	}, []);

	const value = useMemo(
		() => ({ register, unregister, setWantsToShow, activeBannerId }),
		[register, unregister, setWantsToShow, activeBannerId]
	);

	return (
		<BannerContext.Provider value={value}>{children}</BannerContext.Provider>
	);
}

export function useBannerSlot(id: BannerId, priority: number) {
	const ctx = useContext(BannerContext);
	if (!ctx) throw new Error("useBannerSlot must be used within BannerProvider");

	const { register, unregister, setWantsToShow, activeBannerId } = ctx;
	const [localWants, setLocalWants] = useState(false);

	useEffect(() => {
		register(id, priority);
		return () => unregister(id);
	}, [id, priority, register, unregister]);

	const show = useCallback(() => {
		setLocalWants(true);
		setWantsToShow(id, true);
	}, [id, setWantsToShow]);

	const dismiss = useCallback(() => {
		setLocalWants(false);
		setWantsToShow(id, false);
	}, [id, setWantsToShow]);

	return {
		isVisible: activeBannerId === id,
		isPreempted: localWants && activeBannerId !== id,
		show,
		dismiss,
	};
}
