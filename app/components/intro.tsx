"use client";

import { Dialog, Transition } from "@headlessui/react";
import HeroiconsBoltSlash from "~icons/heroicons/bolt-slash";
import HeroiconsLink from "~icons/heroicons/link";
import TeenyiconsGithubOutline from "~icons/teenyicons/github-outline";
import { Fragment, useRef, useState } from "react";

import { Button } from "./button";

const features = [
  {
    name: "Toggle offline",
    description: "mode in user settings and see how network restoration works",
    icon: HeroiconsBoltSlash,
  },
  {
    name: "Share this chat",
    description: "with friends to understand how fast things really are",
    icon: HeroiconsLink,
  },
  {
    name: "See sources",
    description: (
      <>
        on{" "}
        <a
          className="text-red-700 underline hover:no-underline"
          href="https://github.com/anycable/vercel-anycable-demo"
        >
          GitHub
        </a>
      </>
    ),
    icon: TeenyiconsGithubOutline,
  },
];

export function Intro({
  showIntro,
  introShownAction,
}: {
  showIntro: boolean;
  introShownAction: () => void;
}) {
  const [open, setOpen] = useState(showIntro);

  const btn = useRef<HTMLDivElement>(null);

  const close = () => {
    introShownAction();
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={close}
        initialFocus={btn}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform space-y-10 overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                <Dialog.Title
                  as="h3"
                  className="text-center text-base font-semibold leading-6 text-zinc-900"
                >
                  Welcome to AnyCable serverless demo!
                </Dialog.Title>
                <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4 text-sm leading-7 text-zinc-600">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-zinc-900">
                        <feature.icon
                          className="absolute left-1 top-1 h-5 w-5 text-red-600"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>{" "}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex justify-center" ref={btn}>
                  <Button onClick={close}>Understood</Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
