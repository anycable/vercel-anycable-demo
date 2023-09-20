import { redirect } from "next/navigation";
import { Chat } from "./components/chat";
import { nanoid } from "nanoid";
import { getRoomLabel } from "./utils/room-label";
import { Header } from "./components/header/header";
import { cookies } from "next/headers";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  if (searchParams.roomId)
    return (
      <Chat
        username={cookies().get("username")!.value}
        header={<Header roomLabel={getRoomLabel(searchParams.roomId)} />}
      />
    );

  return redirect(`/?roomId=${nanoid()}`);
}
