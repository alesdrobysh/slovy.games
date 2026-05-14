import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";

const meta = {
	title: "Design/Modal",
	tags: ["autodocs"],
	argTypes: {
		title: { control: { type: "text" } },
	},
	args: {
		title: "Як гуляць?",
	},
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof Modal>;

function ModalStory({
	title,
	children,
}: {
	title?: string;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);
	return (
		<div style={{ padding: 40, background: "var(--bg)", minHeight: "100vh" }}>
			<Button variant="outline" color="primary" onClick={() => setOpen(true)}>
				Адкрыць мадальнае акно
			</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)} title={title}>
				{children}
			</Modal>
		</div>
	);
}

const bodyText = (
	<p
		style={{
			fontSize: 14,
			color: "var(--fg-2)",
			margin: 0,
			fontFamily: "var(--font-b)",
			lineHeight: 1.6,
		}}
	>
		Адгадайце слова за шэсць спроб. Кожная спроба павінна быць сапраўдным
		беларускім словам. Колер клеткі паказвае, наколькі блізка вы да
		правільнага адказу.
	</p>
);

export const Default: Story = {
	render: (args) => <ModalStory title={args.title}>{bodyText}</ModalStory>,
};

export const ScrollableContent: Story = {
	render: (args) => (
		<ModalStory title={args.title}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 12,
					fontFamily: "var(--font-b)",
					fontSize: 13,
					color: "var(--fg-2)",
					lineHeight: 1.7,
				}}
			>
				{Array.from({ length: 12 }, (_, i) => (
					<p key={i} style={{ margin: 0 }}>
						Правіла {i + 1}: Адгадайце слова за шэсць спроб. Кожная спроба
						павінна быць сапраўдным беларускім словам. Колер клеткі паказвае,
						наколькі блізка вы да правільнага адказу.
					</p>
				))}
			</div>
		</ModalStory>
	),
};
