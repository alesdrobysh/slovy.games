export interface ErrorMessageProps {
	message: string;
	word?: string | null;
	id?: string;
}

export function ErrorMessage({ message, word, id }: ErrorMessageProps) {
	return (
		<div
			id={id}
			role="alert"
			className="mt-flow-sm text-sm text-destructive"
		>
			{word && (
				<>
					<strong>&laquo;{word}&raquo;</strong> —{" "}
				</>
			)}
			{message}
		</div>
	);
}
