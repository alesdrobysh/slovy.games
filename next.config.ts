import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	transpilePackages: ["belmorph"],
	skipTrailingSlashRedirect: true,
	outputFileTracingIncludes: {
		"/dict/[file]": ["./node_modules/belmorph/dict/**"],
	},

	async rewrites() {
		return [
			{
				source: "/a/:path*",
				destination: "https://eu.i.posthog.com/:path*",
			},
		];
	},
};

export default nextConfig;
