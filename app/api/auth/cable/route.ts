import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { identifier, CABLE_URL } from "../../cable";

export async function POST(request: Request) {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await identifier.verify(token);
    const data = { url: `${CABLE_URL}?jid=${token}` };
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
