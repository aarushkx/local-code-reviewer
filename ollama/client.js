import { OLLAMA_BASE_API, TEMPERATURE } from "../lib/config.js";

export class OllamaClient {
    constructor({
        baseUrl = OLLAMA_BASE_API,
        model,
        temperature = TEMPERATURE,
        timeout = 30 * 60 * 1000, // 30 min
    } = {}) {
        if (!model) {
            throw new Error("Model is required to create OllamaClient");
        }

        this.baseUrl = baseUrl;
        this.model = model;
        this.temperature = temperature;
        this.timeout = timeout;
    }

    async generate({ system, prompt }) {
        if (!prompt) {
            throw new Error("Prompt is required");
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeout);

        try {
            const start = Date.now(); // start time

            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: this.model,
                    system,
                    prompt,
                    stream: false,
                    options: { temperature: this.temperature },
                }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`Ollama error: ${response.status}`);
            }

            const data = await response.json();

            const end = Date.now(); // end time
            const duration = end - start;

            return { response: data.response, duration };
        } catch (error) {
            console.error("ERROR :: OllamaClient.generate", error.message);
            throw error;
        } finally {
            clearTimeout(timeout);
        }
    }
}
