import { Fireworks } from "@langchain/community/llms/fireworks";
import { PromptTemplate } from "@langchain/core/prompts";
import { nanoid } from "nanoid";

import type { IAIMessage, IMessage } from "../../components/message";

import { broadcastTo } from "../cable";
import { BooleanOutputParser } from "./outputParsers/boolean";

export class AIAssistant {
  constructor(
    private evaluateModel = new Fireworks({
      temperature: 0,
      maxTokens: 10,
      model: "accounts/fireworks/models/mixtral-8x7b-instruct-hf",
    }),
  ) {}

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
      body: "I'll try to help, wait!",
      createdAt: new Date().toISOString(),
      ai: true,
    };

    await broadcastTo(roomName, message);
  }
}

const EVALUATE_PROMPT =
  PromptTemplate.fromTemplate(`You are a member of a chat with many humans. They talk to each other, but occasionally they may ask your help, or ask you a question. They will call you out explicitly, using these words: "AI", "assistant", "smarty pants", "silicon brain", "silicon overlord" and others.

I need you to tell me if it calls for you attention: does anyone ask you a question or ask for your help? You MUST answer with a single word: yes or no.

Here are a couple of examples.

Input:
"""
dkzlv: I thought about reading some stuff about Apollo mission. Do you think I should talk to Buzz or just go to Wikipedia?

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

Now, to the real messages history. {outputFormat}

Input:
"""
{history}
"""
Output: `);
