import type { Readable } from "node:stream";

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function parsePayload(req: Request) {
  const stream = req.body as unknown;
  const buf = await buffer(stream as Readable);
  const rawBody = buf.toString("utf8");

  return JSON.parse(rawBody);
}

// AnyCable passes the session ID in the `x-anycable-meta-sid` header
export function extractSessionId(req: Request) {
  return req.headers.get("x-anycable-meta-sid");
}
