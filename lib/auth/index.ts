import * as jose from "jose";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "hey");
const alg = "HS256";

export function isCookieValid(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (token) return !!jose.jwtVerify(token, secret);
}

export async function getNewAuthCookie(username: string) {
  const token = await new jose.SignJWT({ username })
    .setProtectedHeader({ alg })
    .setExpirationTime("2h")
    .sign(secret);

  return token;
}
