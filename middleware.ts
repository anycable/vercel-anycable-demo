import { NextResponse, type NextRequest } from "next/server";
import { isCookieValid } from "./lib/auth";

export function middleware(request: NextRequest) {
  if (!isCookieValid(request)) {
    const url = new URL(request.url);
    url.pathname = "/auth";

    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: "/",
};
