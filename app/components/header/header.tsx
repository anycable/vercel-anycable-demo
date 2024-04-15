import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AvatarActions } from "./avatar-actions";
import { RoomActions } from "./room-actions";

export function Header({ roomLabel }: { roomLabel: string }) {
  const username = cookies().get("username")?.value!;

  async function signOut() {
    "use server";

    cookies().delete("token");
    cookies().delete("username");
    return redirect("/auth");
  }

  return (
    <div className="rounded-b-lg border-zinc-200 bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RoomActions newRoomId={nanoid()} />
          <div className="flex flex-col">
            <div className="text-2xs uppercase text-zinc-500">Room</div>
            <div className="truncate font-semibold">{roomLabel}</div>
          </div>
        </div>
        <div>
          <AvatarActions usernameOrEmail={username} signOutAction={signOut} />
        </div>
      </div>
    </div>
  );
}
