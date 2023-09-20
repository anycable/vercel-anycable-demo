import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { identifier } from "../../cable";

const url = process.env.CABLE_URL || "ws://localhost:8080/cable";

export async function POST(request: Request) {
  const token = cookies().get("token")?.value;

  if (token && identifier.verify(token)) {
    const data = { url: `${url}?jid=${token}` };
    return NextResponse.json(data, { status: 200 });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}