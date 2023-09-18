"use client";

import { useId, createContext, useContext, PropsWithChildren } from "react";

const IdContext = createContext<string>("");
const useCtxId = () => useContext(IdContext);

function Root({ label, children }: PropsWithChildren<{ label: string }>) {
  const id = useId();

  return (
    <IdContext.Provider value={id}>
      <div className="flex rounded-md shadow-sm">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        {children}
      </div>
    </IdContext.Provider>
  );
}

function Input(props: JSX.IntrinsicElements["input"]) {
  return (
    <div className="relative flex flex-grow items-stretch focus-within:z-10">
      <input
        id={useCtxId()}
        className="block w-full rounded-none rounded-l-md border-0 px-2.5 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
        {...props}
      />
    </div>
  );
}

function Button(props: JSX.IntrinsicElements["button"]) {
  return (
    <button
      className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 enabled:hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-200"
      {...props}
    />
  );
}

export const CombinedInput = { Root, Input, Button };
