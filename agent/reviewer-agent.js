import fs from "fs/promises";
import { reviewsDB } from "../lib/db.js";

export class ReviewerAgent {
    constructor({ llmClient }) {
        if (!llmClient) {
            throw new Error("llmClient is required");
        }

        this.llm = llmClient;
    }

    async reviewFile(filePath) {
        const content = await fs.readFile(filePath, "utf-8");

        const prompt = `
        Review the following code strictly.
        
        Return the response with the following:
        1. Issues: List of issues found in the code.
        2. Suggestions: List of suggestions for improving the code.
        3. Security Warnings: List of security warnings found in the code.
        4. Performance Notes: List of performance notes found in the code.
        5. Score: A number between 0 and 100 representing the overall quality of the code.
        }
        
        Code:
        ${content}
        `;

        const review = await this.llm.generate({
            prompt,
        });

        reviewsDB.insert({
            filePath,
            ...review,
            timestamp: new Date(),
        });

        return review;
    }
}
