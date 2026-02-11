import { reviewsDB, historyDB } from "./lib/db.js";
import { ReviewerAgent } from "./agent/reviewer-agent.js";
import { OllamaClient } from "./ollama/client.js";
import { LLM_MODELS } from "./lib/config.js";
import { reviewSourceFiles, scanCodebase } from "./utils/scanner.js";
import { MasterReviewerAgent } from "./agent/master-reviewer-agent.js";
import { nanoid } from "nanoid";
import { formatDuration } from "./utils/format.js";

const args = process.argv.slice(2);
const cmd = args[0];

const client = new OllamaClient({
    model: LLM_MODELS.LLAMA3,
});

const reviewer = new ReviewerAgent({
    llmClient: client,
});

// const masterReviewer = new MasterReviewerAgent({
//     llmClient: client,
// });

async function review() {
    const rootDir = args[1] || ".";
    const _id = nanoid(8);

    console.log("🔍 AI Code Reviewer\n");
    console.log(`🖥️  Project ID: ${_id}\n`);
    console.log("=".repeat(50));

    console.log("\n📁 Scanning codebase...\n");
    const start = Date.now();

    const sourceFiles = await scanCodebase(rootDir);
    await reviewSourceFiles(sourceFiles, reviewer, rootDir, _id);

    const end = Date.now();
    const totalDuration = end - start;

    // Not implementing for now
    // await masterReviewer.reviewMdFiles(_id, totalDuration);

    console.log("=".repeat(50));
    console.log(
        `\n🎉 Done! Files reviewed in ${formatDuration(totalDuration)}\n`,
    );
}

async function grab() {
    const _id = args[1];

    if (!_id) {
        console.log("⚠️ Please provide a project ID");
        return;
    }

    const data = reviewsDB.find({ _id });

    if (!data || data.length === 0) {
        console.log(`❌ No project found with ID ${_id}`);
        return;
    }

    console.log("📂 Project Data\n");
    console.log("=".repeat(50));
    console.log(`🖥️ Project ID: ${_id}`);
    console.log(`📄 Files Reviewed: ${data.length}`);
    console.log("=".repeat(50));

    for (let i = 0; i < data.length; i++) {
        const d = data[i];

        console.log(`\n📄 File: ${d.filePath}`);
        console.log("-".repeat(40));
        console.log(d.review);
    }

    console.log("\n✅ Done.\n");
}

function help() {
    console.log(`
🔍 AI Code Reviewer CLI

Usage:
  node index.js review [rootDir]
      -> Review a codebase (default: current directory)

  node index.js grab <project_id>
      -> Retrieve project review data by ID

  node index.js help
      -> Show this help message

  node index.js exit
      -> Exit the program
`);
}


// const _id = nanoid(8);
// console.log("🔍 AI Code Reviewer\n");
// console.log(`🖥️  Project ID: ${_id}\n`);
// console.log("=".repeat(50));

// TODO: allow user to input root dir as well
// const rootDir = ".";
// console.log("\n📁 Scanning codebase...\n");
// const start = Date.now();
// const sourceFiles = await scanCodebase(rootDir);

// await reviewSourceFiles(_id, sourceFiles, reviewer, rootDir);

// const end = Date.now();
// const totalDuration = end - start;

// Not implementing for now
// await masterReviewer.reviewMdFiles(_id, totalDuration);

// console.log("=".repeat(50));
// console.log(`\n🎉 Done! Files reviewed in ${formatDuration(totalDuration)}\n`);
