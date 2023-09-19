import { NextResponse, type NextRequest } from "next/server";
import { identifier } from "./app/api/cable";

export function middleware(request: NextRequest) {
  if (!identifier.verify(request.cookies.get("token")?.value)) {
    const url = new URL(request.url);
    url.pathname = "/auth";

    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: "/",
};
