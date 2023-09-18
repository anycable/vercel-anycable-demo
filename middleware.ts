import { NextResponse, type NextRequest } from "next/server";
import { isCookieValid } from "./lib/auth";

export function middleware(request: NextRequest) {
  if (!isCookieValid(request))
    return NextResponse.redirect(new URL("/auth", request.url));
}

export const config = {
  matcher: "/",
};
