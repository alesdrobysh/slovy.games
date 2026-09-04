/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	roots: ["<rootDir>/src"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^belmorph$": "<rootDir>/src/test-mocks/belmorph.ts",
		"^belmorph/node$": "<rootDir>/src/test-mocks/belmorph.ts",
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
		"\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
	},
	setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
