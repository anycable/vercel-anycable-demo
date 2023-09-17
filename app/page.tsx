import { MessageList } from "./components/message-list"
import { NewMessageForm } from "./components/new-message-form"

export default function Home() {
  return (
    <main className="container min-h-screen mx-auto pt-28 pb-28 px-5 flex h-screen">
      <div className="flex flex-col justify-end min-h-full">
        <MessageList />
        <NewMessageForm />
      </div>
    </main>
  )
}
