import { IAIMessage } from "@/channels/chat-channel";
import { Fireworks } from "@langchain/community/llms/fireworks";
import { PromptTemplate } from "@langchain/core/prompts";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { nanoid } from "nanoid";

import { broadcastTo } from "../cable";
import { aiMentionRegex } from "../utils/markdown";
import { AIMessageWithPossibleCustomUI } from "./customUI";
import { customUIParser } from "./outputParsers/customUI";
import { SmartAiTool } from "./tools/smartAI";
import { WeatherTool } from "./tools/weather";

export class AIAssistant {
  constructor(
    private reactModel = new Fireworks({
      model: "accounts/fireworks/models/llama-v3-70b-instruct",
    }),
    private extractionModel = new Fireworks({
      model: "accounts/fireworks/models/mixtral-8x7b-instruct-hf",
      temperature: 0,
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

  async startChain(roomName: string, msg: string, history: string) {
    if (!aiMentionRegex.test(msg)) return;

    const fullHistory = history + "\n\n" + msg;

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
    await this.startReactChain(roomName, fullHistory, message);
  }

  private tools = [new WeatherTool(), new SmartAiTool()];

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
      });

      const result = await agentExecutor.invoke({ input: history });

      const refined = await this.refineOutput(result.output);

      await broadcastTo(roomName, {
        type: "update",
        msg: { ...message, body: refined },
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

  private async refineOutput(
    input: string,
  ): Promise<AIMessageWithPossibleCustomUI | string> {
    const chain = CUSTOM_UI_PROMPT.pipe(this.extractionModel).pipe(
      customUIParser,
    );
    try {
      return await chain.invoke({
        input,
        toolExample: TOOL_EXAMPLE,
        format_instructions: customUIParser.getFormatInstructions(),
      });
    } catch (err) {
      console.error("COULDNT, JUST NO", err);
      return input;
    }
  }
}

const CUSTOM_UI_PROMPT = PromptTemplate.fromTemplate(`
You'll get a free-text message. I want you to extract structured data from it if it fits the description.
NEVER reply with anything but the JSON.

{format_instructions}

{toolExample}

Now, real input.

Input:
"""
{input}
"""
Result:`);

const TOOL_EXAMPLE = `
Input:
"""
The current weather in Tokyo is 18.6°C, feels like 20.7°C, with a wind speed of 2.5 km/h, and the WMO weather code is 3.
"""
Result:
{
  "type": "weather",
  "props": {
    "cityName": "Tokyo",
    "temperature": 18.6,
    "temperatureFeel": 20.7,
    "windSpeed": 2.5,
    "weatherType": 3
  }
}`;
