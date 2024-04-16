import { BaseOutputParser } from "@langchain/core/output_parsers";

export class BooleanOutputParser extends BaseOutputParser<boolean> {
  lc_namespace = ["langchain", "output_parsers"];

  async parse(llmOutput: string) {
    return llmOutput.toLocaleLowerCase().trim().startsWith("yes");
  }

  getFormatInstructions(): string {
    return `Answer with a single word: "Yes" or "No".`;
  }
}
