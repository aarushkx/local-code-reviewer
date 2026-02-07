import { reviewsDB, historyDB } from "./lib/db.js";
import { ReviewerAgent } from "./agent/reviewer-agent.js";
import { OllamaClient } from "./ollama/client.js";
import { LLM_MODELS } from "./lib/config.js";

const client = new OllamaClient({
    model: LLM_MODELS.GEMMA3,
});

const reviewer = new ReviewerAgent({
    llmClient: client,
});

const result = await reviewer.reviewFile("./test/test.js");

console.log(result);
