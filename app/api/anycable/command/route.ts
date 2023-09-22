import { NextResponse } from "next/server";
import { commandHandler, Status } from "@anycable/serverless-js";
import app from "../../cable";

export async function POST(request: Request) {
  try {
    const response = await commandHandler(request, app);
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      status: Status.ERROR,
      error_msg: "Server error",
    });
  }
}
