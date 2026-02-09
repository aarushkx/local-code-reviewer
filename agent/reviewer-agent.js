import fs from "fs/promises";
import path from "path";
import { reviewsDB } from "../lib/db.js";
import { REVIEWER_AGENT_SYSTEM_PROMPT } from "../lib/config.js";
import { formatDuration, formatDateTime } from "../utils/format.js";

export class ReviewerAgent {
    constructor({ llmClient }) {
        if (!llmClient) {
            throw new Error("llmClient is required");
        }

        this.llm = llmClient;
    }

    async reviewFile(filePath) {
        const content = await fs.readFile(filePath, "utf-8");

        const { response, duration } = await this.llm.generate({
            system: REVIEWER_AGENT_SYSTEM_PROMPT,
            prompt: `Review this code:\n\n${content}`,
        });

        const outputDir = path.resolve("_generated");
        await fs.mkdir(outputDir, { recursive: true });

        const cleanPath = filePath
            .replace(/^\.\/|^\//, "") // Remove leading ./ or /
            .replace(/\.[^.]+$/, "") // Remove file extension
            .replace(/[\/\\]/g, "__"); // Replace path separators with __

        const fileName = `gen_${cleanPath}.review.md`;
        const reportPath = path.join(outputDir, fileName);

        const reportContent = `
${response}
---

## Review Metadata

- **File**: ${filePath}
- **Duration**: ${formatDuration(duration)}
- **Reviewed At**: ${formatDateTime(Date.now())}
`;

        await fs.writeFile(reportPath, reportContent);

        reviewsDB.insert({
            filePath,
            review: response,
            durationMs: duration,
            reportPath,
            timestamp: new Date(),
        });

        return {
            review: response,
            duration,
            reportPath,
        };
    }
}
