import { OLLAMA_BASE_API, TEMPERATURE, SYSTEM_PROMPT } from "../lib/config.js";

export class OllamaClient {
    constructor({
        baseUrl = OLLAMA_BASE_API,
        model,
        temperature = TEMPERATURE,
        systemPrompt = SYSTEM_PROMPT,
        timeout = 30 * 60 * 1000, // 30 min
    } = {}) {
        if (!model) {
            throw new Error("Model is required to create OllamaClient");
        }

        this.baseUrl = baseUrl;
        this.model = model;
        this.temperature = temperature;
        this.systemPrompt = systemPrompt;
        this.timeout = timeout;
    }

    async generate({
        prompt,
        temperatureOverride,
        systemOverride,
        json = false,
    }) {
        if (!prompt) {
            throw new Error("Prompt is required");
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt,
                    system: systemOverride ?? this.systemPrompt,
                    stream: false,
                    format: json ? "json" : undefined,
                    options: {
                        temperature: temperatureOverride ?? this.temperature,
                    },
                }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`Ollama error: ${response.status}`);
            }

            const data = await response.json();
            return json ? JSON.parse(data.response) : data.response;
        } catch (error) {
            console.error("ERROR :: OllamaClient.generate", error.message);
            throw error;
        } finally {
            clearTimeout(timeout);
        }
    }
}
