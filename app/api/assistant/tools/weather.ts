import { WeatherProvider } from "@/api/assistant/providers/weatherProvider";
import { DynamicTool } from "@langchain/core/tools";

export class WeatherTool extends DynamicTool {
  constructor() {
    super({
      name: "current_weather",
      description:
        "call this to get current weather in a city on Earth. Input should be the city name. Output must always contain WMO weather code.",
      func: async (cityName: string) =>
        new WeatherProvider(cityName).fetchWeatherByCityName(),
    });
  }
}
