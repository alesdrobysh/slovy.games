import type { Preview } from "@storybook/nextjs-vite";
import { useEffect } from "react";
// @ts-expect-error css side-effect import
import "../src/app/globals.css";

export const globalTypes = {
	theme: {
		name: "Theme",
		defaultValue: "light",
		toolbar: {
			icon: "circlehollow",
			items: [
				{ value: "light", title: "Light", icon: "sun" },
				{ value: "dark", title: "Dark", icon: "moon" },
			],
			dynamicTitle: true,
		},
	},
};

const preview: Preview = {
	decorators: [
		(Story, context) => {
			const isDark = context.globals.theme === "dark";
			useEffect(() => {
				document.documentElement.dataset.theme = isDark ? "dark" : "";
			}, [isDark]);
			return <Story />;
		},
	],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		viewport: {
			options: {
				mobile360: {
					name: "Mobile 360 × 800",
					styles: { width: "360px", height: "800px" },
				},
				mobile390: {
					name: "Mobile 390 × 844",
					styles: { width: "390px", height: "844px" },
				},
				mobile360short: {
					name: "Mobile 360 × 300 (keyboard / landscape)",
					styles: { width: "360px", height: "300px" },
				},
			},
		},
		a11y: { test: "todo" },
	},
};

export default preview;
