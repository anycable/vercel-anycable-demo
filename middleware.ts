import { NextResponse, type NextRequest } from "next/server";
import { identifier } from "./app/api/cable";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (token) {
    console.log("token", token);
    try {
      await identifier.verify(token);
      console.log("token verified");
      return;
    } catch (e) {
      console.log(e);
    }
  }

  const url = new URL(request.url);
  url.pathname = "/auth";

  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/",
};
