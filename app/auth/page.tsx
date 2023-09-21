import { AuthForm } from "../components/auth-form";
import { MainLayout } from "../components/main-layout";
import { Logo } from "./logo";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { identifier } from "../api/cable";
import { nanoid } from "nanoid";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  async function login(form: FormData) {
    "use server";

    let username = form.get("username");
    if (typeof username === "string") {
      username = username.trim();
      if (username) {
        cookies().set({
          name: "token",
          value: await identifier.generateToken({ username }),
          httpOnly: true,
          maxAge: 3600 * 60,
        });
        cookies().set({
          name: "username",
          value: username,
          maxAge: 3600 * 60,
        });

        const id = searchParams.roomId ?? nanoid();
        return redirect(`/?roomId=${id}`);
      }
    }

    throw new Error("Invalid username");
  }

  return (
    <MainLayout>
      <div className="grid h-screen items-center">
        <div className="-mt-12 flex max-w-xs flex-col">
          <div className="mx-auto">
            <Logo />
          </div>
          <div className="my-10">
            <h1 className="mb-4 text-center text-2xl font-semibold text-balance">
              Welcome to AnyCable demo!
            </h1>
            <p className="text-sm">
              Before joining a room please set up a username. You can also enter
              your email to see your Gravatar near your messages!
            </p>
          </div>
          <AuthForm action={login} />
        </div>
      </div>
    </MainLayout>
  );
}
