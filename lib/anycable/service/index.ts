import type { Readable } from "node:stream";

import {
  ConnectionResponse,
  ConnectionRequest,
  Status,
  CommandResponse,
  CommandMessage,
  DisconnectRequest,
  DisconnectResponse,
} from "../rpc";
import { Application } from "../application";

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function parsePayload(req: Request) {
  const stream = req.body as unknown;
  const buf = await buffer(stream as Readable);
  const rawBody = buf.toString("utf8");

  return JSON.parse(rawBody);
}

// AnyCable passes the session ID in the `x-anycable-meta-sid` header
function extractSessionId(req: Request) {
  return req.headers.get("x-anycable-meta-sid");
}

export const connectHandler = async (
  request: Request,
  app: Application,
): Promise<ConnectionResponse> => {
  const payload = (await parsePayload(request)) as ConnectionRequest;
  const sid = extractSessionId(request);
  const handle = app.buildHandle(sid, payload.env);

  await app.handleOpen(handle);

  return {
    status: handle.rejected ? Status.FAILURE : Status.SUCCESS,
    identifiers: handle.identifiers
      ? app.encodeIdentifiers(handle.identifiers)
      : "",
    transmissions: handle.transmissions,
    error_msg: handle.rejected ? "Auth failed" : "",
    env: handle.envChanges,
  };
};

export const commandHandler = async (
  request: Request,
  app: Application,
): Promise<CommandResponse> => {
  const payload = (await parsePayload(request)) as CommandMessage;
  const sid = extractSessionId(request);
  const handle = app.buildHandle(sid, payload.env);
  handle.identifiedBy(app.decodeIdentifiers(payload.connection_identifiers));

  await app.handleCommand(
    handle,
    payload.command,
    payload.identifier,
    payload.data,
  );

  return {
    status: handle.rejected ? Status.FAILURE : Status.SUCCESS,
    disconnect: handle.closed,
    stop_streams: handle.stopStreams,
    transmissions: handle.transmissions,
    streams: handle.streams,
    stopped_streams: handle.stoppedStreams,
    env: handle.envChanges,
    error_msg: "",
  };
};

export const disconnectHandler = async (
  request: Request,
  app: Application,
): Promise<DisconnectResponse> => {
  const payload = (await parsePayload(request)) as DisconnectRequest;
  const sid = extractSessionId(request);
  const handle = app.buildHandle(sid, payload.env);
  handle.identifiedBy(app.decodeIdentifiers(payload.identifiers));

  await app.handleClose(handle, payload.subscriptions);

  return {
    status: Status.SUCCESS,
    error_msg: "",
  };
};
