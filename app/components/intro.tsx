"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, SVGProps, useRef, useState } from "react";
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
                  className="text-center text-base font-semibold leading-6 text-gray-900"
                >
                  Welcome to AnyCable serverless demo!
                </Dialog.Title>
                <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4 text-sm leading-7 text-gray-600">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
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

function HeroiconsBoltSlash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25L12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21"
      ></path>
    </svg>
  );
}

function HeroiconsLink(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
      ></path>
    </svg>
  );
}

function TeenyiconsGithubOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        fill="currentColor"
        d="M5.65 12.477a.5.5 0 1 0-.3-.954l.3.954Zm-3.648-2.96l-.484-.128l-.254.968l.484.127l.254-.968ZM9 14.5v.5h1v-.5H9Zm.063-4.813l-.054-.497a.5.5 0 0 0-.299.852l.352-.354ZM12.5 5.913h.5V5.91l-.5.002Zm-.833-2.007l-.466-.18a.5.5 0 0 0 .112.533l.354-.353Zm-.05-2.017l.456-.204a.5.5 0 0 0-.319-.276l-.137.48Zm-2.173.792l-.126.484a.5.5 0 0 0 .398-.064l-.272-.42Zm-3.888 0l-.272.42a.5.5 0 0 0 .398.064l-.126-.484ZM3.383 1.89l-.137-.48a.5.5 0 0 0-.32.276l.457.204Zm-.05 2.017l.354.353a.5.5 0 0 0 .112-.534l-.466.181ZM2.5 5.93H3v-.002l-.5.002Zm3.438 3.758l.352.355a.5.5 0 0 0-.293-.851l-.06.496ZM5.5 11H6l-.001-.037L5.5 11ZM5 14.5v.5h1v-.5H5Zm.35-2.977c-.603.19-.986.169-1.24.085c-.251-.083-.444-.25-.629-.49a4.8 4.8 0 0 1-.27-.402c-.085-.139-.182-.302-.28-.447c-.191-.281-.473-.633-.929-.753l-.254.968c.08.02.184.095.355.346c.082.122.16.252.258.412c.094.152.202.32.327.484c.253.33.598.663 1.11.832c.51.168 1.116.15 1.852-.081l-.3-.954Zm4.65-.585c0-.318-.014-.608-.104-.878c-.096-.288-.262-.51-.481-.727l-.705.71c.155.153.208.245.237.333c.035.105.053.254.053.562h1Zm-.884-.753c.903-.097 1.888-.325 2.647-.982c.78-.675 1.237-1.729 1.237-3.29h-1c0 1.359-.39 2.1-.892 2.534c-.524.454-1.258.653-2.099.743l.107.995ZM13 5.91a3.354 3.354 0 0 0-.98-2.358l-.707.706c.438.44.685 1.034.687 1.655l1-.003Zm-.867-1.824c.15-.384.22-.794.21-1.207l-1 .025a2.12 2.12 0 0 1-.142.82l.932.362Zm.21-1.207a3.119 3.119 0 0 0-.27-1.195l-.913.408c.115.256.177.532.184.812l1-.025Zm-.726-.99c.137-.481.137-.482.136-.482h-.003l-.004-.002a.462.462 0 0 0-.03-.007a1.261 1.261 0 0 0-.212-.024a2.172 2.172 0 0 0-.51.054c-.425.091-1.024.317-1.82.832l.542.84c.719-.464 1.206-.634 1.488-.694a1.2 1.2 0 0 1 .306-.03l-.008-.001a.278.278 0 0 1-.01-.002l-.006-.002h-.003l-.002-.001c-.001 0-.002 0 .136-.482Zm-2.047.307a8.209 8.209 0 0 0-4.14 0l.252.968a7.209 7.209 0 0 1 3.636 0l.252-.968Zm-3.743.064c-.797-.514-1.397-.74-1.822-.83a2.17 2.17 0 0 0-.51-.053a1.259 1.259 0 0 0-.241.03l-.004.002h-.003l.136.481l.137.481h-.001l-.002.001l-.003.001a.327.327 0 0 1-.016.004l-.008.001h.008a1.19 1.19 0 0 1 .298.03c.282.06.769.23 1.488.694l.543-.84Zm-2.9-.576a3.12 3.12 0 0 0-.27 1.195l1 .025a2.09 2.09 0 0 1 .183-.812l-.913-.408Zm-.27 1.195c-.01.413.06.823.21 1.207l.932-.362a2.12 2.12 0 0 1-.143-.82l-1-.025Zm.322.673a3.354 3.354 0 0 0-.726 1.091l.924.38c.118-.285.292-.545.51-.765l-.708-.706Zm-.726 1.091A3.354 3.354 0 0 0 2 5.93l1-.003c0-.31.06-.616.177-.902l-.924-.38ZM2 5.93c0 1.553.458 2.597 1.239 3.268c.757.65 1.74.88 2.64.987l.118-.993C5.15 9.09 4.416 8.89 3.89 8.438C3.388 8.007 3 7.276 3 5.928H2Zm3.585 3.404c-.5.498-.629 1.09-.584 1.704L6 10.963c-.03-.408.052-.683.291-.921l-.705-.709ZM5 11v3.5h1V11H5Zm5 3.5V13H9v1.5h1Zm0-1.5v-2.063H9V13h1Z"
      ></path>
    </svg>
  );
}
