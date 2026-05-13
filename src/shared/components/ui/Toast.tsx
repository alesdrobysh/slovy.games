export interface ToastProps {
	message: string;
	visible: boolean;
	position?: "top" | "bottom";
}

export function Toast({ message, visible, position = "top" }: ToastProps) {
	const positionClass = position === "top" ? "-top-10" : "-bottom-10";

	return (
		<div
			aria-live="polite"
			className={`absolute left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-ink text-paper text-xs font-medium whitespace-nowrap shadow-lg transition-all duration-300 ${positionClass} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
		>
			{message}
		</div>
	);
}
