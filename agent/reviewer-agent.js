import fs from "fs/promises";
import path from "path";
import { reviewsDB } from "../lib/db.js";
import { REVIEWER_AGENT_SYSTEM_PROMPT } from "../lib/config.js";

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

        const reportContent = `
        ${response}
        
        ---

        ## Review Metadata
        
        - File: ${filePath}
        - Duration: ${duration.toFixed(2)} ms
        - Reviewed At: ${new Date().toISOString()}
        `;

        const reportPath = `${filePath}.review.md`;
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
