import { redirect } from "next/navigation";
import { Chat } from "./components/chat";
import { nanoid } from "nanoid";
import { getRoomLabel } from "./utils/room-label";
import { Header } from "./components/header/header";
import { cookies } from "next/headers";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams: { roomId },
}: {
  searchParams: { [key: string]: string };
}): Promise<Metadata> {
  const roomLabel = getRoomLabel(roomId);

  return {
    title: `${roomLabel} | AnyCable Next.js Demo`,
    openGraph: {
      images: [
        {
          url: `/api/og/?roomLabel=${roomLabel}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

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
