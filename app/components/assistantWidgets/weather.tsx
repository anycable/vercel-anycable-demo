import type { WeatherProps } from "@/api/assistant/customUI";

import { persistentAtom } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";
import { computed } from "nanostores";
import { ReactNode } from "react";

type Props = WeatherProps;

const celciusToFar = (c: number) => Math.round(c * (9 / 5) + 32),
  kmhToMph = (kph: number) => Math.round(kph * 0.6214);

const LABELING = {
  metric: {
    temp: "°C",
    speed: "km/h",
  },
  imperial: {
    temp: "°F",
    speed: "mp/h",
  },
};

const $systemOfUnits = persistentAtom<"imperial" | "metric">("units", "metric");
const toggleSystem = () => {
  $systemOfUnits.set($systemOfUnits.value === "metric" ? "imperial" : "metric");
};

const $converter = computed($systemOfUnits, (system) => (props: Props) => {
  if (system === "metric") return { ...props, system };
  return {
    ...props,
    system,
    temperature: celciusToFar(props.temperature),
    temperatureFeel: celciusToFar(props.temperatureFeel),
    windSpeed: kmhToMph(props.windSpeed),
  };
});

export function WeatherWidget(props: Props): ReactNode {
  const { temperature, temperatureFeel, windSpeed, weatherType, system } =
    useStore($converter)(props);

  return (
    <div className="flex items-center gap-4 p-3 pb-1">
      {weatherType && (
        <div className="text-xl">{weatherTypeMap[weatherType]}</div>
      )}
      <div className="flex flex-col">
        <div>
          <span className="font-semibold">
            {temperature}
            {LABELING[system].temp}
          </span>
          , feels like{" "}
          <span className="font-semibold">
            {temperatureFeel}
            {LABELING[system].temp}
          </span>
        </div>
        <div className="text-sm text-zinc-600">
          Wind speed: {windSpeed}
          {LABELING[system].speed}
        </div>
      </div>
      <button
        className="ms-2 text-sm uppercase text-blue-500 underline decoration-dotted"
        onClick={toggleSystem}
        title={`Switch unit system, current: ${system}`}
      >
        {system[0]}
      </button>
    </div>
  );
}

const weatherTypeMap: Record<
  NonNullable<WeatherProps["weatherType"]>,
  string
> = {
  clear: "☀️",
  fog: "🌫️",
  overcast: "🌥️",
  rain: "🌧️",
  snow: "🌨️",
};
