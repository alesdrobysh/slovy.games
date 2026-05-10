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
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			onClick={onClose}
			role="presentation"
			className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--sly-bg)]/70 backdrop-blur-sm p-4"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? "modal-title" : undefined}
				className="bg-[var(--sly-bg-card)] border border-[var(--sly-border)] rounded-2xl shadow-2xl w-full overflow-y-auto"
				style={{ maxWidth, maxHeight: "90vh" }}
			>
				{title && (
					<div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sly-border)]">
						<h2
							id="modal-title"
							className="text-[var(--sly-font-display)] text-xl font-semibold text-[var(--sly-text)]"
						>
							{title}
						</h2>
						<button
							onClick={onClose}
							aria-label="Закрыць"
							type="button"
							className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--sly-text-muted)] hover:bg-[var(--sly-border)] transition-colors text-lg leading-none"
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
