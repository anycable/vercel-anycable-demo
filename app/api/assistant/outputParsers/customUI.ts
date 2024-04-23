import { StructuredOutputParser } from "@langchain/core/output_parsers";

import { allCustomUISchemas } from "../customUI";

export const customUIParser =
  StructuredOutputParser.fromZodSchema(allCustomUISchemas);
