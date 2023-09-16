import { NextResponse } from "next/server";
import { ConnectionRequest, ConnectionResponse, Status } from "../anycable";
import { extractSessionId, parsePayload } from "../utils";

export async function POST(request: Request) {
  let username: string | null = null;

  try {
    const payload = (await parsePayload(request)) as ConnectionRequest;

    const wsURL = payload.env.url;

    if (wsURL) {
      const url = new URL(wsURL);
      username = url.searchParams.get("username");
    }
  } catch (e) {
    console.error(request.body, e);
    return NextResponse.json({
      status: Status.ERROR,
      error_msg: "Server error",
    } as ConnectionResponse);
  }

  let response: ConnectionResponse;

  if (!username) {
    response = {
      status: Status.FAILURE,
      error_msg: "Unauthorized",
      transmissions: [
        JSON.stringify({ type: "disconnect", reason: "unauthorized" }),
      ],
    } as ConnectionResponse;
  } else {
    // Authentication succeeded
    const sid = extractSessionId(request);

    response = {
      status: Status.SUCCESS,
      identifiers: JSON.stringify({ username }),
      transmissions: [
        JSON.stringify({
          type: "welcome",
          sid,
        }),
      ],
    } as ConnectionResponse;
  }

  return NextResponse.json(response, {
    status: 200,
  });
}
