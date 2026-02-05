export const LLM_MODELS = {
    GEMMA3: "gemma3:4b",
    LLAMA2: "llama2:latest",
    LLAMA3: "llama3.1:8b",
    GPT_OSS: "gpt-oss:20b",
};

export const OLLAMA_BASE_API = "http://localhost:11434";

export const TEMPERATURE = 0.2;

export const SYSTEM_PROMPT = `You are a helpful assistant for code review. You will be provided with code snippets and you should provide feedback on the code, including potential bugs, improvements, and best practices. Be concise and specific in your feedback. If the code looks good, say "No issues found."`;
