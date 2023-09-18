"use client";

import { useEffect } from "react";
import { MessageList } from "./message-list";
import { NewMessageForm } from "./new-message-form";
import { $roomId, addAutoScroll } from "../stores/messages";
import { useSearchParams } from "next/navigation";
import { useStore } from "@nanostores/react";
import { $cable } from "../stores/cable";

export function Chat() {
  // Initializing cable creation
  useStore($cable);

  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  useEffect(() => {
    if (roomId) $roomId.set(roomId);
  }, [roomId]);

  useEffect(() => addAutoScroll(document.documentElement), []);

  return (
    <div className="flex h-screen w-full flex-col gap-2">
      <div className="flex-1">
        <MessageList />
      </div>
      <div className="sticky bottom-0 -mx-2 bg-red-50 py-2">
        <div className="px-2">
          <NewMessageForm />
        </div>
      </div>
    </div>
  );
}
