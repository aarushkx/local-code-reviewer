// DELETE THIS FILE

import { OllamaClient } from "./client.js";
import { LLM_MODELS } from "../lib/config.js";

const codeReviewer = new OllamaClient({
    model: LLM_MODELS.LLAMA2,
    temperature: 0.1,
    systemPrompt: "You are a strict senior code reviewer.",
});
