import { nanoid } from "nanoid";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Chat } from "./components/chat";
import { Header } from "./components/header/header";
import { Intro } from "./components/intro";
import { getRoomLabel } from "./utils/room-label";

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
  if (!searchParams.roomId) {
    return redirect(`/?roomId=${nanoid()}`);
  }
  const showIntro = !cookies().get("introShown")?.value;

  async function introShownAction() {
    "use server";

    cookies().set("introShown", "1");
  }

  return (
    <>
      <Chat
        username={cookies().get("username")!.value}
        header={<Header roomLabel={getRoomLabel(searchParams.roomId)} />}
      />
      <Intro showIntro={showIntro} introShownAction={introShownAction} />
    </>
  );
}
