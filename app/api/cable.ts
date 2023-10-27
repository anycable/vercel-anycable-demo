import {
  Application,
  ConnectionHandle,
  broadcaster,
  identificator,
} from "@anycable/serverless-js";
import ChatChannel from "./channels/chat-channel";

export type CableIdentifiers = {
  username: string;
};

export const CABLE_URL = process.env.CABLE_URL || "ws://localhost:8080/cable";

// Broadcasting configuration
const broadcastURL =
  process.env.ANYCABLE_HTTP_BROADCAST_URL || "http://localhost:8090/_broadcast";
const broadcastToken = process.env.ANYCABLE_HTTP_BROADCAST_SECRET || "";

export const broadcastTo = broadcaster(broadcastURL, broadcastToken);

const jwtSecret = process.env.ANYCABLE_JWT_ID_KEY || "hey";
const jwtTTL = "2h";

export const identifier = identificator<CableIdentifiers>(jwtSecret, jwtTTL);

class CableApplication extends Application<CableIdentifiers> {
  // Override this method to handle connection open event
  async connect(handle: ConnectionHandle<CableIdentifiers>) {
    const url = handle.env.url;
    const params = new URL(url).searchParams;

    if (params.has("jid")) {
      const jwtPayload = await identifier.verifyAndFetch(params.get("jid")!);

      if (jwtPayload) {
        handle.identifiedBy(jwtPayload);
      } else {
        handle.reject();
      }
    }
  }

  // Override this method to handle connection close event
  async disconnect(handle: ConnectionHandle<CableIdentifiers>) {
    console.log(`User ${handle.identifiers!.username} disconnected`);
  }
}

const app = new CableApplication();

// Register channels here
app.registerChannel("chat", new ChatChannel());

export default app;
