import { withPostHogConfig } from "@posthog/nextjs-config";
import type { NextConfig } from "next";

const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogProjectId = process.env.POSTHOG_PROJECT_ID;
const posthogIngestionHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

const nextConfig: NextConfig = {
	reactCompiler: true,
	transpilePackages: ["belmorph"],
	skipTrailingSlashRedirect: true,
	outputFileTracingIncludes: {
		"/dict/[file]": ["./node_modules/belmorph/dict/**"],
	},

	async rewrites() {
		if (!posthogIngestionHost) return [];

		return [
			{
				source: "/a/:path*",
				destination: `${posthogIngestionHost}/:path*`,
			},
		];
	},
};

export default withPostHogConfig(nextConfig, {
	personalApiKey: posthogApiKey ?? "",
	projectId: posthogProjectId,
	host: posthogIngestionHost,
	sourcemaps: {
		enabled: Boolean(posthogApiKey && posthogProjectId),
		deleteAfterUpload: true,
	},
});
