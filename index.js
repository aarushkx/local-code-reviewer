import { reviewsDB, historyDB } from "./lib/db.js";
import { ReviewerAgent } from "./agent/reviewer-agent.js";
import { OllamaClient } from "./ollama/client.js";
import { LLM_MODELS } from "./lib/config.js";
import { reviewSourceFiles, scanCodebase } from "./utils/scanner.js";

const client = new OllamaClient({
    model: LLM_MODELS.LLAMA3,
});

const reviewer = new ReviewerAgent({
    llmClient: client,
});

console.log("🔍 AI Code Reviewer\n");
console.log("=".repeat(50));

// TODO: allow user to input root dir as well
const rootDir = ".";
console.log("\n📁 Scanning codebase...\n");
const sourceFiles = await scanCodebase(rootDir);

await reviewSourceFiles(sourceFiles, reviewer, rootDir);

console.log("=".repeat(50));
console.log("\n🎉 Done!\n");
