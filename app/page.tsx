import { redirect } from "next/navigation";
import { Chat } from "./components/chat";
import { nanoid } from "nanoid";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  if (searchParams.roomId) return <Chat />;

  return redirect(`/?roomId=${nanoid()}`);
}
