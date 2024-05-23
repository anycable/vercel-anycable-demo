import { WeatherProvider } from "@/api/assistant/providers/weatherProvider";
import { z } from "zod";

export const allCustomUISchemas = WeatherProvider.customUISchema;
export type AIMessageWithPossibleCustomUI = z.infer<typeof allCustomUISchemas>;

export type WeatherProps = z.infer<
  typeof WeatherProvider.customUISchema
>["props"];
