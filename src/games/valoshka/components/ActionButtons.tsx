"use client";

interface ActionButtonsProps {
	onDelete: () => void;
	onShuffle: () => void;
	onSubmit: () => void;
}

function ShuffleIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M16 3h5v5" />
			<path d="M4 20L21 3" />
			<path d="M21 16v5h-5" />
			<path d="M15 15l5.1 5.1" />
			<path d="M4 4l5 5" />
		</svg>
	);
}

const btnBase: React.CSSProperties = {
	border: "1.5px solid var(--border)",
	background: "transparent",
	color: "var(--text-muted)",
	borderRadius: "9999px",
	fontFamily: "var(--font-manrope), sans-serif",
	fontSize: "14px",
	fontWeight: "600",
	cursor: "pointer",
	transition: "background 0.15s, border-color 0.15s, color 0.15s",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "6px",
	letterSpacing: "0.02em",
};

export function ActionButtons({
	onDelete,
	onShuffle,
	onSubmit,
}: ActionButtonsProps) {
	return (
		<div className="flex items-center justify-center gap-3">
			<button
				type="button"
				style={{ ...btnBase, padding: "10px 22px" }}
				onClick={onDelete}
				onMouseEnter={(e) => {
					const el = e.currentTarget as HTMLButtonElement;
					el.style.background = "var(--bg-surface)";
					el.style.borderColor = "var(--text-muted)";
					el.style.color = "var(--text)";
				}}
				onMouseLeave={(e) => {
					const el = e.currentTarget as HTMLButtonElement;
					el.style.background = "transparent";
					el.style.borderColor = "var(--border)";
					el.style.color = "var(--text-muted)";
				}}
			>
				Выдаліць
			</button>

			<button
				type="button"
				style={{
					...btnBase,
					width: "44px",
					height: "44px",
					padding: "0",
					borderRadius: "50%",
				}}
				onClick={onShuffle}
				aria-label="Перамяшаць"
				onMouseEnter={(e) => {
					const el = e.currentTarget as HTMLButtonElement;
					el.style.background = "var(--bg-surface)";
					el.style.borderColor = "var(--text-muted)";
					el.style.color = "var(--text)";
				}}
				onMouseLeave={(e) => {
					const el = e.currentTarget as HTMLButtonElement;
					el.style.background = "transparent";
					el.style.borderColor = "var(--border)";
					el.style.color = "var(--text-muted)";
				}}
			>
				<ShuffleIcon />
			</button>

			<button
				type="button"
				style={{
					...btnBase,
					padding: "10px 22px",
					background: "var(--cornflower)",
					color: "var(--cell-letter-center)",
					border: "1.5px solid var(--cornflower)",
					fontWeight: "700",
				}}
				onClick={onSubmit}
				onMouseEnter={(e) => {
					const el = e.currentTarget as HTMLButtonElement;
					el.style.background = "var(--cornflower-light)";
					el.style.borderColor = "var(--cornflower-light)";
				}}
				onMouseLeave={(e) => {
					const el = e.currentTarget as HTMLButtonElement;
					el.style.background = "var(--cornflower)";
					el.style.borderColor = "var(--cornflower)";
				}}
			>
				Увесці
			</button>
		</div>
	);
}
