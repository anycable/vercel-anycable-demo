import { IAIMessage } from "@/channels/chat-channel";
import { Fireworks } from "@langchain/community/llms/fireworks";
import { PromptTemplate } from "@langchain/core/prompts";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { nanoid } from "nanoid";

import { broadcastTo } from "../cable";
import { AIMessageWithPossibleCustomUI } from "./customUI";
import { BooleanOutputParser } from "./outputParsers/boolean";
import { customUIParser } from "./outputParsers/customUI";
import { SmartAiTool } from "./tools/smartAI";
import { WeatherTool } from "./tools/weather";

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
        verbose: true,
      });

      const result = await agentExecutor.invoke({
        input: history,
      });

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
    const chain = CUSTOM_UI_PROMPT.pipe(this.reactModel).pipe(customUIParser);
    try {
      return await chain.invoke({
        input,
        format_instructions: customUIParser.getFormatInstructions(),
      });
    } catch (err) {
      return input;
    }
  }
}

const EVALUATE_PROMPT =
  PromptTemplate.fromTemplate(`You are a member of a chat with many humans. They talk to each other,
but occasionally they may ask your help, or ask you a question. They will ALWAYS mention you explicitly,
using words like these: "AI", "assistant", "smarty pants", "silicon brain", "silicon overlord" and others.

I need you to tell me if it calls for you attention: does anyone ask you a question or ask for
your help? You MUST answer with a single word: yes or no.

Examples:

Input:
///
user1: I thought about reading some stuff about Apollo mission. Do you
think I should talk to Buzz or just go to Wikipedia?
user2: I think you should just read Wikipedia.
user1: thanks, I'll do just that.
///
Output: No
Reason: Nobody mentioned AI assistant explicitly

Input:
///
user1: """I think I should shave my head bald. Do you think it's a good idea?"""
///
Output: No
Reason: Nobody mentioned AI assistant explicitly

Input:
///
user1: """Hey, AI, can you tell me what the weather is in Lisbon?"""
///
Output: Yes
Reason: AI assistant was mentioned explicitly

Input:
///
user1: """Hey, AI, can you tell me what the weather is in Lisbon?"""
AI Assistant: """Yes, the weather in Lisbon is 24 degrees."""
user1: """Thanks"""
///
Output: No
Reason: AI Assistant has already answered the question, and no new question has been raised.

Input:
///
user1: """Hey, AI, can you tell me what the weather is in Lisbon?"""
AI Assistant: """Yes, the weather in Lisbon is 24 degrees."""
user1: """Thanks"""
user1: """Also, what's the weather like in Berlin?"""
///
Output: No
Reason: AI assistant wasn't mentioned explicitly

Input:
///
user1: """I don't know what we should talk about.
Never been in a situation like this before"""
user2: """Hey, AI, suggest a few topics to talk to with a friend."""
AI Assistant: """You can talk about hobbies, work or school, travel experiences, personal growth and development."""
user1: """see, Mike, I told you this is smart"""
///
Output: No
Reason: Last message does not explicitly mentioned the AI assistant. Humans mention only each other.

Input:
///
user1: """I don't know what we should talk about.
Never been in a situation like this before"""
user2: """Hey, AI, suggest a few topics to talk to with a friend."""
AI Assistant: """You can talk about hobbies, work or school, travel experiences, personal growth and development."""
user1: """great, let's talk about hobbies, I think?"""
///
Output: No
Reason: last message does not explicitly mention the AI assistant. It seems humans are happy with the response and went on.

Now, to the real messages history. {outputFormat}

Input:
///
{history}
///
Output: `);

const CUSTOM_UI_PROMPT = PromptTemplate.fromTemplate(`
You'll get a free-text message. I want you to either extract structured data from it if it fits the description.

{format_instructions}

If it doesn't fit any data type above (e.g., weather), just return "ERROR".

Input:
"""
{input}
"""`);
