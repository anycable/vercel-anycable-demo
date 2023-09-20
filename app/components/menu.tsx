import { Menu as HMenu, Transition } from "@headlessui/react";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { PropsWithChildren, Fragment, createElement, SVGProps } from "react";

const Root = ({ children }: PropsWithChildren) => {
  return (
    <HMenu as="div" className="relative">
      {children}
    </HMenu>
  );
};

function HeroiconsEllipsisVertical(props: SVGProps<SVGSVGElement>) {
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
        d="M12 6.75a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5Zm0 6a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5Zm0 6a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5Z"
      ></path>
    </svg>
  );
}

const Trigger = ({
  children,
  label = "More",
}: PropsWithChildren<{ label?: string }>) => (
  <HMenu.Button className="-m-3 block p-3">
    <span className="sr-only">{label}</span>
    {children ?? (
      <HeroiconsEllipsisVertical
        className="h-5 w-5 text-gray-500"
        aria-hidden="true"
      />
    )}
  </HMenu.Button>
);

const Body = ({
  children,
  align = "right",
}: PropsWithChildren<{ align?: "right" | "left" }>) => {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <HMenu.Items
        className={cx(
          "absolute z-10 mt-0.5 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-900/5 focus:outline-none",
          align === "right" && "right-0",
          align === "left" && "left-0",
        )}
      >
        {children}
      </HMenu.Items>
    </Transition>
  );
};

function InteractiveItem<T extends "button" | "a">({
  as,
  ...props
}: JSX.IntrinsicElements[T] & { as: T }) {
  const Element = (as == "a" ? Link : as) as unknown as any;
  return createElement(Element, {
    ...props,
    className:
      "block w-full pr-3 pl-6 py-1 text-left text-sm leading-6 text-gray-900 hover:bg-gray-100 disabled:text-gray-600",
  });
}

function TextItem({ children }: PropsWithChildren) {
  return (
    <div className="w-full truncate py-1 pl-6 pr-3 text-sm leading-6 text-gray-500">
      {children}
    </div>
  );
}

export const Menu = {
  Root,
  Trigger,
  Body,
  ItemRoot: HMenu.Item,
  InteractiveItem,
  TextItem,
};
