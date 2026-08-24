import path from "node:path";
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		"@chromatic-com/storybook",
		"@storybook/addon-vitest",
		"@storybook/addon-a11y",
		"@storybook/addon-docs",
		"@storybook/addon-mcp",
	],
	framework: "@storybook/nextjs-vite",
	staticDirs: ["../public"],
	async viteFinal(viteConfig) {
		const existing = viteConfig.resolve?.alias ?? [];
		const aliases = Array.isArray(existing)
			? existing
			: Object.entries(existing).map(([find, replacement]) => ({
					find,
					replacement,
				}));
		viteConfig.resolve = {
			...viteConfig.resolve,
			alias: [
				{
					find: /^belmorph$/,
					replacement: path.resolve(
						process.cwd(),
						".storybook/mocks/belmorph.ts"
					),
				},
				{
					find: /^@\/games\/sakretna\/lib\/lemmatize$/,
					replacement: path.resolve(
						process.cwd(),
						".storybook/mocks/sakretna-lemmatize.ts"
					),
				},
				...aliases,
			],
		};
		return viteConfig;
	},
};

export default config;
