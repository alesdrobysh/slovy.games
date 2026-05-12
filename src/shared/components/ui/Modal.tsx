"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	maxWidth?: string;
}

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	maxWidth = "480px",
}: ModalProps) {
	useEffect(() => {
		if (!isOpen) return;
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (!isOpen) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: presentation backdrop
		<div
			onClick={onClose}
			role="presentation"
			className="fixed inset-0 z-50 flex items-center justify-center bg-paper/70 backdrop-blur-sm p-4"
		>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation only */}
			<div
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? "modal-title" : undefined}
				className="bg-card ring-1 ring-rule rounded-2xl shadow-2xl w-full overflow-y-auto"
				style={{ maxWidth, maxHeight: "90vh" }}
			>
				{title && (
					<div className="flex items-center justify-between px-6 py-4 border-b border-rule">
						<h2
							id="modal-title"
							className="font-display text-xl font-semibold text-ink"
						>
							{title}
						</h2>
						<button
							onClick={onClose}
							aria-label="Закрыць"
							type="button"
							className="w-8 h-8 flex items-center justify-center rounded-full text-ink-muted hover:bg-rule transition-colors"
						>
							<X size={18} aria-hidden="true" />
						</button>
					</div>
				)}
				<div className="px-6 py-4">{children}</div>
			</div>
		</div>
	);
}
