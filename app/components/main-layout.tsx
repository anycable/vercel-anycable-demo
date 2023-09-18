import { PropsWithChildren } from "react";

export function MainLayout(props: PropsWithChildren) {
  return (
    <div className="mx-auto h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid h-full max-w-2xl content-center">
        {props.children}
      </div>
    </div>
  );
}
