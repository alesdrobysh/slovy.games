import { Modal } from "@/shared/components/ui/Modal";
import type { GameplaySettings } from "../lib/gameplaySettings";

interface GameplaySettingsModalProps {
	isOpen: boolean;
	settings: GameplaySettings;
	onChange: (settings: GameplaySettings) => void;
	onClose: () => void;
}

const OPTIONS: Array<{
	key: keyof GameplaySettings;
	label: string;
	description: string;
}> = [
	{
		key: "stickyTitle",
		label: "Замацаваць назву",
		description: "Трымаць зашыфраваную назву артыкула зверху падчас чытання.",
	},
	{
		key: "autoScroll",
		label: "Аўтапераход да слова",
		description: "Пасля догадкі пракручваць да першага супадзення.",
	},
	{
		key: "letterCounts",
		label: "Паказваць колькасць літар",
		description: "Паказваць лічбу каля кожнай зашыфраванай палоскі.",
	},
];

export function GameplaySettingsModal({
	isOpen,
	settings,
	onChange,
	onClose,
}: GameplaySettingsModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Налады гульні">
			<fieldset className="divide-y divide-rule">
				<legend className="sr-only">Паводзіны артыкула</legend>
				{OPTIONS.map((option) => (
					<label
						key={option.key}
						className="min-h-16 py-flow-sm flex items-center justify-between gap-flow-md cursor-pointer"
					>
						<span>
							<span className="block font-semibold text-ink">
								{option.label}
							</span>
							<span className="block text-sm text-ink-muted">
								{option.description}
							</span>
						</span>
						<input
							type="checkbox"
							checked={settings[option.key]}
							onChange={(event) =>
								onChange({ ...settings, [option.key]: event.target.checked })
							}
							className="size-6 shrink-0 accent-sakretna"
						/>
					</label>
				))}
			</fieldset>
		</Modal>
	);
}
