export type LlmProvider = "openai" | "anthropic" | "google" | "groq" | "azure";

const DEFAULT_MODELS: Record<LlmProvider, string> = {
  openai: "gpt-4.1-mini",
  anthropic: "claude-3-5-haiku-latest",
  google: "gemini-2.0-flash",
  groq: "llama-3.3-70b-versatile",
  azure: "gpt-4.1-mini",
};

const getProviderFromEnv = (): LlmProvider => {
  const provider = process.env.LLM_PROVIDER?.toLowerCase();

  switch (provider) {
    case "openai":
    case "anthropic":
    case "google":
    case "groq":
    case "azure":
      return provider;
    default:
      return "openai";
  }
};

const requireEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const ACTIVE_LLM_PROVIDER = getProviderFromEnv();

export const WORKSPACE_GENERATOR_MODEL =
  process.env.LLM_MODEL ?? DEFAULT_MODELS[ACTIVE_LLM_PROVIDER];

export const getLanguageModel = async (modelId = WORKSPACE_GENERATOR_MODEL) => {
  switch (ACTIVE_LLM_PROVIDER) {
    case "anthropic": {
      const { anthropic } = await import("@ai-sdk/anthropic");
      return anthropic(modelId);
    }
    case "google": {
      const { google } = await import("@ai-sdk/google");
      return google(modelId);
    }
    case "groq": {
      const { groq } = await import("@ai-sdk/groq");
      return groq(modelId);
    }
    case "azure": {
      const { createAzure } = await import("@ai-sdk/azure");
      const azure = createAzure({
        apiKey: requireEnv("AZURE_API_KEY"),
        resourceName: requireEnv("AZURE_RESOURCE_NAME"),
      });

      return azure(modelId);
    }
    case "openai":
    default: {
      const { openai } = await import("@ai-sdk/openai");
      return openai(modelId);
    }
  }
};
