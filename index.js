import { reviewsDB } from "./lib/db.js";
import { ReviewerAgent } from "./agent/reviewer-agent.js";
import { OllamaClient } from "./ollama/client.js";
import { LLM_MODELS } from "./lib/config.js";
import { reviewSourceFiles, scanCodebase } from "./utils/scanner.js";
import { MasterReviewerAgent } from "./agent/master-reviewer-agent.js";
import { nanoid } from "nanoid";
import { formatDuration } from "./utils/format.js";
import readline from "readline";

const client = new OllamaClient({
    model: LLM_MODELS.LLAMA3,
});

const reviewer = new ReviewerAgent({
    llmClient: client,
});

// const masterReviewer = new MasterReviewerAgent({
//     llmClient: client,
// });

const _id = nanoid(8);
console.log("🔍 AI Code Reviewer\n");
console.log(`🖥️ Project ID: ${_id}\n`);
console.log("=".repeat(50));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askRootDir() {
    return new Promise((resolve) => {
        rl.question("\n📂 Enter root directory (default: .): ", (ans) => {
            resolve(ans.trim() || ".");
        });
    });
}

const rootDir = await askRootDir();
rl.close();

console.log("\n📁 Scanning codebase...\n");

const start = Date.now();
const sourceFiles = await scanCodebase(rootDir);

await reviewSourceFiles(_id, sourceFiles, reviewer, rootDir);

const end = Date.now();
const totalDuration = end - start;

// Not implementing for now
// await masterReviewer.reviewMdFiles(_id, totalDuration);

console.log("=".repeat(50));
console.log(`\n🎉 Done! Files reviewed in ${formatDuration(totalDuration)}\n`);
