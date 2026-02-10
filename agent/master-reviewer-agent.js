import path from "path";
import fs from "fs/promises";
import { formatDuration, formatDateTime } from "../utils/format.js";
import { MASTER_REVIEWER_AGENT_SYSTEM_PROMPT } from "../lib/prompts.js";

export class MasterReviewerAgent {
    constructor({ llmClient }) {
        if (!llmClient) {
            throw new Error("llmClient is required");
        }
        this.llm = llmClient;
    }

    async reviewMdFiles(_id, totalDuration) {
        console.log("\n📊 Generating master review...\n");

        const dir = `_generated/${_id}`;
        const files = await fs.readdir(dir);
        const mdFiles = files.filter((f) => f.endsWith(".md"));

        if (mdFiles.length === 0) {
            console.warn("⚠️ No review files found.");
            return;
        }

        let combined = "";
        for (const file of mdFiles) {
            const fullPath = path.join(dir, file);
            const content = await fs.readFile(fullPath, "utf-8");

            combined += `\n\n--- FILE: ${file} ---\n\n`;
            combined += content;
        }

        const { response, duration } = await this.llm.generate({
            system: MASTER_REVIEWER_AGENT_SYSTEM_PROMPT,
            prompt: `Here are the file-level reviews:\n\n${combined}`,
        });

        const finalReportPath = path.join(dir, "FINAL_REVIEW.md");

        const finalContent = `
${response}

---

## Final Review Metadata

- **Files Analyzed**: ${mdFiles.length}
- **Total Time Taken**: ${formatDuration(totalDuration)}
- **Reviewed At**: ${formatDateTime(Date.now())}
`;

        await fs.writeFile(finalReportPath, finalContent);
        console.log(`✅ Final Report saved at ${finalReportPath}`);
    }
}
