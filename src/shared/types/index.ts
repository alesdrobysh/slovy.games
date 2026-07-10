export interface GameInfo {
	id: string;
	name: string;
	nameBel: string;
	description: string;
	descriptionBel: string;
	path: string;
	color: string;
	colorDark: string;
	icon: string;
	enabled: boolean;
}

export interface PlayerStats {
	totalGamesPlayed: number;
	currentStreak: number;
	longestStreak: number;
}

export interface HubGameStatus {
	hasPlayedToday: boolean;
	quickStats: PlayerStats;
}

export const GAMES: GameInfo[] = [
	{
		id: "pobach",
		name: "Pobač",
		nameBel: "Побач",
		description:
			"Адгадайце схаванае слова, параўноўваючы значэнне вашых варыянтаў з мэтай.",
		descriptionBel: "Здагадайцеся слова па сэнсавай блізкасці",
		path: "/pobach",
		color: "#E58E3F",
		colorDark: "#F5A848",
		icon: "🔍",
		enabled: true,
	},
	{
		id: "valoshka",
		name: "Valoška",
		nameBel: "Валошка",
		description:
			"Складайце словы з сямі літар. Цэнтральная літара — абавязковая ў кожным слове.",
		descriptionBel: "Складайце словы з 7 прапанаваных літар",
		path: "/valoshka",
		color: "#5b6fa8",
		colorDark: "#7a8fc8",
		icon: "🌸",
		enabled: true,
	},
	{
		id: "sakretna",
		name: "Sakretna",
		nameBel: "Сакрэтна",
		description:
			"Здагадайцеся, пра які артыкул Вікіпедыі ідзе гаворка, расшыфроўваючы схаваныя словы.",
		descriptionBel: "Здагадайцеся артыкул Вікіпедыі па расшыфраваных словах",
		path: "/sakretna",
		color: "#2E6B4F",
		colorDark: "#5C9C7E",
		icon: "📕",
		enabled: true,
	},

];
