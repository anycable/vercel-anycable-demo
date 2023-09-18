import { AuthForm } from "../components/auth-form";
import { MainLayout } from "../components/main-layout";
import { Logo } from "./logo";

export default async function AuthPage() {
  return (
    <MainLayout>
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
        <AuthForm />
      </div>
    </MainLayout>
  );
}
