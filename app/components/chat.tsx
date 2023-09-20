"use client";

import { ReactNode, useEffect } from "react";
import { MessageList } from "./message-list";
import { NewMessageForm } from "./new-message-form";
import { $channel, $roomId, addAutoScroll } from "../stores/messages";
import { useSearchParams } from "next/navigation";
import { useStore } from "@nanostores/react";
import { $user } from "../stores/user";
import { OfflineOverlay } from "./offline-overlay";

export function Chat({
  header,
  username,
}: {
  header: ReactNode;
  username: string;
}) {
  // Initializing connection
  useStore($channel);

  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  useEffect(() => {
    if (roomId) $roomId.set(roomId);
  }, [roomId]);

  useEffect(() => $user.set({ username }), [username]);
  useEffect(() => addAutoScroll(document.documentElement), []);

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-3">
      <div className="sticky top-0 z-10 -mx-2 bg-red-50">
        <div className="px-2">{header}</div>
      </div>
      <div className="flex-1">
        <MessageList />
      </div>
      <div className="sticky bottom-0 -mx-2 bg-red-50 py-2 pb-10">
        <div className="px-2">
          <NewMessageForm />
        </div>
      </div>
      <OfflineOverlay />
    </div>
  );
}
