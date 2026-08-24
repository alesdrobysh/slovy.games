import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname =
	typeof __dirname !== "undefined"
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));
const chromeCandidates = [
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	"/usr/bin/google-chrome",
	"/usr/bin/chromium",
];
const systemChrome = chromeCandidates.find(existsSync);

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
	resolve: {
		alias: {
			belmorph: path.join(dirname, ".storybook/mocks/belmorph.ts"),
			"@/games/sakretna/lib/lemmatize": path.join(
				dirname,
				".storybook/mocks/sakretna-lemmatize.ts"
			),
		},
	},
	test: {
		projects: [
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({ configDir: path.join(dirname, ".storybook") }),
				],
				test: {
					name: "storybook",
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({
							launchOptions: systemChrome
								? { executablePath: systemChrome }
								: undefined,
						}),
						instances: [{ browser: "chromium" }],
					},
				},
			},
		],
	},
});
