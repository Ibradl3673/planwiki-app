import { azure } from "@ai-sdk/azure";

const defaultDeployment =
  process.env.AZURE_OPENAI_DEPLOYMENT ??
  process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ??
  "gpt-4.1-mini";

export const planningModel = azure(
  process.env.AZURE_OPENAI_BRAIN_DEPLOYMENT ?? defaultDeployment,
);

export const renderingModel = azure(
  process.env.AZURE_OPENAI_RENDER_DEPLOYMENT ?? defaultDeployment,
);
