import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	transpilePackages: ["belmorph"],
	skipTrailingSlashRedirect: true,
	async rewrites() {
		return [
			{
				source: "/a/:path*",
				destination: "https://eu.i.posthog.com/:path*",
			},
		];
	},
	serverExternalPackages: ["belmorph"],
};

export default nextConfig;
