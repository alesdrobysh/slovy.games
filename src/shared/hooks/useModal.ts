"use client";

import { useCallback, useState } from "react";

export interface ModalState {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
	ModalProps: {
		isOpen: boolean;
		onClose: () => void;
	};
}

export function useModal(initialOpen = false): ModalState {
	const [isOpen, setIsOpen] = useState(initialOpen);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => setIsOpen((v) => !v), []);

	const ModalProps = {
		isOpen,
		onClose: close,
	};

	return { isOpen, open, close, toggle, ModalProps };
}
