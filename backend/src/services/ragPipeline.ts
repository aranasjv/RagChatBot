import { runLlama } from "./llamaRunner"; // assuming your runLlama is in llamaRunner.ts
import logger from "../utils/logger";

export function runRagPipeline(query: string): Promise<string> {
  return new Promise(async (resolve) => {
    try {
      logger.info("Running RAG pipeline with query: %s", query);

      // Call runLlama instead of spawning Python
      const result = await runLlama(query);

      logger.info("RAG pipeline result: %s", result);
      resolve(result);
    } catch (err: any) {
      const errorMsg = `⚠️ Error in RAG pipeline: ${err.message}`;
      console.error("❌", errorMsg);
      logger.error(errorMsg, { stack: err.stack });
      resolve(errorMsg); // always return string
    }
  });
}
