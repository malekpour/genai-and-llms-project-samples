import { azure } from "@ai-sdk/azure";
import { getEdgeRuntimeResponse } from "@assistant-ui/react/edge";

export const maxDuration = 30;

export const POST = async (request: Request) => {
  const requestData = await request.json();

  if (!process.env.AZURE_DEPLOYMENT) {
    throw Error("AZURE_DEPLOYMENT environment variable must be provided.");
  }

  return getEdgeRuntimeResponse({
    options: {
      model: azure(process.env.AZURE_DEPLOYMENT),
    },
    requestData,
    abortSignal: request.signal,
  });
};
