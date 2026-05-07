"use client";

import { useCallback, useEffect, useState } from "react";

interface StorageEntry {
	key: string;
	value: unknown;
}

function readGameStorage(): StorageEntry[] {
	if (typeof window === "undefined") return [];
	const entries: StorageEntry[] = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (!key) continue;
		if (!key.startsWith("vulej_") && key !== "theme") continue;
		try {
			entries.push({ key, value: JSON.parse(localStorage.getItem(key) ?? "") });
		} catch {
			entries.push({ key, value: localStorage.getItem(key) });
		}
	}
	return entries.sort((a, b) => a.key.localeCompare(b.key));
}

interface Props {
	open: boolean;
	onClose: () => void;
}

export function StorageInspector({ open, onClose }: Props) {
	const [entries, setEntries] = useState<StorageEntry[]>([]);

	const refresh = useCallback(() => setEntries(readGameStorage()), []);

	useEffect(() => {
		if (open) refresh();
	}, [open, refresh]);

	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [open, onClose]);

	const copyAll = () => {
		const data = Object.fromEntries(
			entries.map(({ key, value }) => [key, value])
		);
		navigator.clipboard.writeText(JSON.stringify(data, null, 2));
	};

	if (!open) return null;

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 9999,
				display: "flex",
				alignItems: "flex-end",
				justifyContent: "flex-end",
				padding: "1rem",
				pointerEvents: "none",
			}}
		>
			<div
				style={{
					background: "#1a1a1a",
					color: "#e0e0e0",
					borderRadius: "10px",
					border: "1px solid #444",
					width: "min(480px, calc(100vw - 2rem))",
					maxHeight: "60vh",
					display: "flex",
					flexDirection: "column",
					fontFamily: "ui-monospace, monospace",
					fontSize: "12px",
					boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
					pointerEvents: "auto",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "10px 14px",
						borderBottom: "1px solid #333",
						flexShrink: 0,
					}}
				>
					<span style={{ fontWeight: 700, color: "#fff", fontSize: "13px" }}>
						Storage Inspector
					</span>
					<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
						<button
							type="button"
							onClick={refresh}
							style={{
								background: "#333",
								border: "none",
								color: "#ccc",
								borderRadius: "4px",
								padding: "3px 8px",
								cursor: "pointer",
								fontSize: "11px",
							}}
						>
							Refresh
						</button>
						<button
							type="button"
							onClick={copyAll}
							style={{
								background: "#1a3a1a",
								border: "none",
								color: "#7ec87e",
								borderRadius: "4px",
								padding: "3px 8px",
								cursor: "pointer",
								fontSize: "11px",
							}}
						>
							Copy
						</button>
						<button
							type="button"
							onClick={onClose}
							style={{
								background: "transparent",
								border: "none",
								color: "#888",
								cursor: "pointer",
								fontSize: "18px",
								lineHeight: 1,
								padding: "0 2px",
							}}
						>
							×
						</button>
					</div>
				</div>

				{/* Entries */}
				<div style={{ overflowY: "auto", flex: 1, padding: "10px 14px" }}>
					{entries.length === 0 ? (
						<span style={{ color: "#666" }}>No game data in localStorage</span>
					) : (
						entries.map(({ key, value }) => (
							<div key={key} style={{ marginBottom: "14px" }}>
								<div
									style={{
										color: "#7ec8e3",
										marginBottom: "4px",
										fontWeight: 600,
									}}
								>
									{key}
								</div>
								<pre
									style={{
										margin: 0,
										background: "#111",
										padding: "8px",
										borderRadius: "6px",
										overflowX: "auto",
										color: "#b8e0b8",
										fontSize: "11px",
										lineHeight: 1.5,
									}}
								>
									{JSON.stringify(value, null, 2)}
								</pre>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
