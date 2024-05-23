import { request } from "@/utils/request";
import { z } from "zod";

export class WeatherProvider {
  constructor(private cityName: string) {}

  async fetchWeatherByCityName() {
    const { json: cityDataRes } = await request<{
      // https://open-meteo.com/en/docs/geocoding-api
      results: { name: string; latitude: number; longitude: number }[];
    }>(`https://geocoding-api.open-meteo.com/v1/search`, {
      queryParams: { count: 1, name: this.cityName },
    });
    const cityData = cityDataRes.results[0];

    if (!cityData) {
      return `We couldn't find a city with name ${this.cityName}. Try something else.`;
    }

    const { latitude, longitude } = cityData;
    const { json } = await request<APIForecaseResponse>(
      `https://api.open-meteo.com/v1/forecast`,
      {
        queryParams: {
          latitude,
          longitude,
          current: WeatherProvider.metrics.map((m) => m.apiCode).join(","),
        },
      },
    );

    const summary = WeatherProvider.metrics
      .map((m) => {
        const value = json.current[m.apiCode];
        return `${m.description} — ${value}`;
      })
      .join("; ");

    return `Summary for ${this.cityName}: ${summary} (remember to preserve WMO code)`;
  }

  static getWeatherTypeFromCode(code: number) {
    for (const [key, value] of Object.entries(WeatherProvider.simpleMap)) {
      if (
        (Array.isArray(value) && value.includes(code)) ||
        (typeof value === "function" && value(code))
      ) {
        return key as SimpleWeatherLabel;
      }
    }
  }

  static customUISchema = z
    .object({
      type: z.literal("weather"),
      props: z.object({
        cityName: z.string().describe("City name"),
        temperature: z.number().describe("Actual temperature in celsius"),
        temperatureFeel: z
          .number()
          .describe("How temperature feels in celsius"),
        windSpeed: z.number().describe("Wind speed in km/h"),
        weatherType: z
          .number()
          .optional()
          .nullable()
          .describe("WMO Weather interpretation code")
          .transform((code) =>
            code ? WeatherProvider.getWeatherTypeFromCode(code) : null,
          ),
      }),
    })
    .describe(
      "weather data for a single city that has temperature, how temperature feels like, wind speed and WMO Weather interpretation code",
    );

  static metrics = [
    {
      apiCode: "temperature_2m",
      description: "Temperature, in Celcius",
    },
    {
      apiCode: "apparent_temperature",
      description: "How temperature feels like, in Celcius",
    },
    {
      apiCode: "weather_code",
      description: "WMO Weather interpretation code",
    },
    {
      apiCode: "wind_speed_10m",
      description: "Wind speed in km/h",
    },
  ] as const;

  // https://open-meteo.com/en/docs#weathervariables
  private static simpleMap: Record<
    SimpleWeatherLabel,
    ((code: number) => boolean) | Array<number>
  > = {
    clear: [0, 1],
    overcast: [2, 3],
    fog: [45, 48],
    rain: (code: number) =>
      (code >= 48 && code <= 67) || code >= 95 || [80, 81, 82].includes(code),
    snow: (code: number) =>
      (code >= 71 && code <= 77) || [85, 86].includes(code),
  } as const;
}

type APIForecaseResponse = {
  current: {
    [key in (typeof WeatherProvider.metrics)[number]["apiCode"]]: number;
  };
};

type SimpleWeatherLabel = "clear" | "fog" | "overcast" | "rain" | "snow";
