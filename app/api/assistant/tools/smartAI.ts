import { Fireworks } from "@langchain/community/llms/fireworks";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { DynamicTool } from "@langchain/core/tools";

export class SmartAiTool extends DynamicTool {
  constructor(
    private smartAiModel = new Fireworks({
      model: "accounts/fireworks/models/llama-v3-70b-instruct",
    }),
  ) {
    super({
      name: "smart_answer",
      description:
        "call this when you need a smarter LLM to respond to some complex question. Input should be the question.",
      func: (input: string) => this.fn(input),
    });
  }

  private async fn(input: string) {
    const outputParser = new StringOutputParser();

    const chain = SmartAiTool.SMARTER_LLM_PROMPT.pipe(this.smartAiModel).pipe(
      outputParser,
    );
    const result = await chain.invoke({ input });

    return result;
  }

  private static SMARTER_LLM_PROMPT = PromptTemplate.fromTemplate(`
You are a helpful and smart assistant. You are asked a question, try to answer it very accurately.

Here's the question along with its context:
"""
{input}
"""`);
}
