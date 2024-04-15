import { nanoid } from "nanoid";

import type { Message as IMessage } from "../../components/message";

import { broadcastTo } from "../cable";

export class AIAssistant {
  async startChain(roomName: string, history: string) {
    if (history) {
      const message: IMessage = {
        id: nanoid(),
        username: "AI Assistant",
        body: "Hey there, mere hoooman",
        createdAt: new Date().toISOString(),
        ai: true,
      };

      await broadcastTo(roomName, message);
    }
  }
}
