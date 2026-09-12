import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
	isWrappedVisible,
	WRAPPED_PREVIEW_COOKIE,
} from "@/shared/lib/wrapped/window";

const COOKIE_NAME = "sakretna_beta";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days
const WRAPPED_COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export function proxy(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;

	const wrappedToken = searchParams.get("wrapped");
	const wrappedSecret = process.env.WRAPPED_PREVIEW_TOKEN;
	if (wrappedSecret && wrappedToken === wrappedSecret) {
		const url = request.nextUrl.clone();
		url.searchParams.delete("wrapped");
		const response = NextResponse.redirect(url);
		response.cookies.set(WRAPPED_PREVIEW_COOKIE, "1", {
			maxAge: WRAPPED_COOKIE_MAX_AGE,
			path: "/",
			sameSite: "lax",
		});
		return response;
	}

	const betaToken = searchParams.get("beta");
	const secret = process.env.SAKRETNA_BETA_TOKEN;
	const hasValidToken = !!secret && betaToken === secret;

	if (hasValidToken) {
		const url = request.nextUrl.clone();
		url.searchParams.delete("beta");
		const response = NextResponse.redirect(url);
		response.cookies.set(COOKIE_NAME, "1", {
			maxAge: COOKIE_MAX_AGE,
			path: "/",
			sameSite: "lax",
		});
		return response;
	}

	const isUnlocked = request.cookies.get(COOKIE_NAME)?.value === "1";
	if (pathname.startsWith("/sakretna") && !isUnlocked) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (pathname.startsWith("/wrapped")) {
		const hasPreviewCookie =
			request.cookies.get(WRAPPED_PREVIEW_COOKIE)?.value === "1";
		if (!isWrappedVisible({ hasPreviewCookie })) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
