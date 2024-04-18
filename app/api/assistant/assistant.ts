import { request } from "@/utils/request";
import { Fireworks } from "@langchain/community/llms/fireworks";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { DynamicTool } from "@langchain/core/tools";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { nanoid } from "nanoid";

import type { IAIMessage } from "../../components/message";

import { broadcastTo } from "../cable";
import { BooleanOutputParser } from "./outputParsers/boolean";

export class AIAssistant {
  constructor(
    private evaluateModel = new Fireworks({
      temperature: 0,
      maxTokens: 10,
      model: "accounts/fireworks/models/mixtral-8x7b-instruct-hf",
    }),
    private reactModel = new Fireworks({
      model: "accounts/fireworks/models/mixtral-8x7b-instruct-hf",
    }),
  ) {
    // Early initialization
    this.reactPrompt();
  }

  private __reactPrompt: PromptTemplate | null = null;
  async reactPrompt(): Promise<PromptTemplate> {
    if (this.__reactPrompt) return this.__reactPrompt;

    const prompt = await pull<PromptTemplate>("hwchase17/react");
    this.__reactPrompt = prompt;
    return prompt;
  }

  async startChain(roomName: string, history: string) {
    if (!history) return;
    const outputParser = new BooleanOutputParser();

    const chain = EVALUATE_PROMPT.pipe(this.evaluateModel).pipe(outputParser);

    const shouldInvokeAi = await chain.invoke({
      history,
      outputFormat: outputParser.getFormatInstructions(),
    });
    console.log(`AI evaluation result:`, { shouldInvokeAi });
    if (!shouldInvokeAi) return;

    const message: IAIMessage = {
      id: nanoid(),
      body: "",
      createdAt: new Date().toISOString(),
      ai: true,
    };
    await broadcastTo(roomName, {
      type: "create",
      msg: { ...message, loading: true },
    });
    await this.startReactChain(roomName, history, message);
  }

  private tools = [
    new DynamicTool({
      name: "current_weather",
      description:
        "call this to get current weather in a city on Earth. Input should be the city name.",
      func: async (cityName) => {
        const { json: cityDataRes } = await request<{
          // https://open-meteo.com/en/docs/geocoding-api
          results: { name: string; latitude: number; longitude: number }[];
        }>(`https://geocoding-api.open-meteo.com/v1/search`, {
          queryParams: { count: 1, name: cityName },
        });
        const cityData = cityDataRes.results[0];

        if (!cityData) {
          return `We couldn't find a city with name ${cityName}. Try something else.`;
        }
        const metrics = [
          {
            apiCode: "temperature_2m",
            description: (v: number) => "Temperature",
          },
          {
            apiCode: "apparent_temperature",
            description: (v: number) => "How temperature feels like",
          },
          {
            apiCode: "weather_code",
            description: (v: number) => weatherCodes[v.toString()] || "",
          },
          {
            apiCode: "wind_speed_10m",
            description: (v: number) => "Wind speed",
          },
        ] as const;

        const { latitude, longitude } = cityData;
        const { json: weatherData } = await request<{
          current: { [key in (typeof metrics)[number]["apiCode"]]: number };
        }>(`https://api.open-meteo.com/v1/forecast`, {
          queryParams: {
            latitude,
            longitude,
            current: metrics.map((m) => m.apiCode).join(","),
          },
        });

        let summary = metrics.map((m) => {
          const value = weatherData.current[m.apiCode];
          return `${m.description(value)} — ${value}`;
        });

        return `Summary for ${cityName}: ${summary}`;
      },
    }),
    new DynamicTool({
      name: "smart_answer",
      description:
        "call this when you need a smarter LLM to respond to some complex question. Input should be the question.",
      func: async (input) => {
        const outputParser = new StringOutputParser();

        const chain = SMARTER_LLM_PROMPT.pipe(this.reactModel).pipe(
          outputParser,
        );
        const result = await chain.invoke({ input });

        return result;
      },
    }),
  ];

  async startReactChain(
    roomName: string,
    history: string,
    message: IAIMessage,
  ) {
    try {
      const agent = await createReactAgent({
        llm: this.reactModel,
        tools: this.tools,
        prompt: await this.reactPrompt(),
      });

      const agentExecutor = new AgentExecutor({
        agent,
        tools: this.tools,
        verbose: true,
      });

      const result = await agentExecutor.invoke({
        input: history,
      });

      await broadcastTo(roomName, {
        type: "update",
        msg: { ...message, body: result.output },
      });
    } catch (err) {
      await broadcastTo(roomName, {
        type: "update",
        msg: {
          ...message,
          body: "Something went wrong. Can you try again later?",
        },
      });
    }
  }
}

const EVALUATE_PROMPT =
  PromptTemplate.fromTemplate(`You are a member of a chat with many humans. They talk to each other,
but occasionally they may ask your help, or ask you a question. They will call you out explicitly,
using words like these: "AI", "assistant", "smarty pants", "silicon brain", "silicon overlord" and others.

I need you to tell me if it calls for you attention: does anyone ask you a question or ask for
your help? You MUST answer with a single word: yes or no.

Here are a couple of examples.

Input:
"""
dkzlv: I thought about reading some stuff about Apollo mission. Do you
think I should talk to Buzz or just go to Wikipedia?
palkan: I think you should just read Wikipedia.
dkzlv: thanks, I'll do just that.
"""
Output: No

Input:
"""
dkzlv: I think I should shave my head bald. Do you think it's a good idea?
"""
Output: No

Input:
"""
dkzlv: Hey, AI, can you tell me what the weather is in Lisbon?
"""
Output: Yes

Input:
"""
dkzlv: Hey, AI, can you tell me what the weather is in Lisbon?
AI Assistant: Yes, the weather in Lisbon is 24 degrees.
dkzlv: Thanks
"""
Output: No

This is a special case: AI Assistant has already answered the question, and no new question has been raised.

Now, to the real messages history. {outputFormat}

Input:
"""
{history}
"""
Output: `);

const SMARTER_LLM_PROMPT = PromptTemplate.fromTemplate(`
You are a helpful and smart assistant. You are asked a question, try to answer it very accurately.

Here's the question along with its context:
"""
{input}
"""`);

// Made an object out of WMO Weather interpretation codes
const weatherCodes: { [key: string]: string } = {
  "0": "Clear sky",
  "1": "Mainly clear",
  "2": "Partly cloudy",
  "3": "Overcast",
  "45": "Fog",
  "48": "Depositing rime fog",
  "51": "Drizzle: Light intensity",
  "53": "Drizzle: Moderate intensity",
  "55": "Drizzle: Dense intensity",
  "56": "Freezing Drizzle: Light intensity",
  "57": "Freezing Drizzle: Dense intensity",
  "61": "Rain: Slight intensity",
  "63": "Rain: Moderate intensity",
  "65": "Rain: Heavy intensity",
  "66": "Freezing Rain: Light intensity",
  "67": "Freezing Rain: Heavy intensity",
  "71": "Snow fall: Slight intensity",
  "73": "Snow fall: Moderate intensity",
  "75": "Snow fall: Heavy intensity",
  "77": "Snow grains",
  "80": "Rain showers: Slight intensity",
  "81": "Rain showers: Moderate intensity",
  "82": "Rain showers: Violent intensity",
  "85": "Snow showers slight",
  "86": "Snow showers heavy",
  "95": "Thunderstorm: Slight or moderate",
  "96": "Thunderstorm with slight hail",
  "99": "Thunderstorm with heavy hail",
};
