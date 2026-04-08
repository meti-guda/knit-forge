export type OllamaModel = "llama3.2" | "codellama" | "mistral" | "llama2";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type OllamaResponse = {
  model: string;
  response: string;
  done: boolean;
};

export type OllamaStatus = {
  available: boolean;
  model: string | null;
  error?: string;
};

const DEFAULT_MODEL = "llama3.2";
const OLLAMA_BASE_URL = "http://localhost:11434";

export async function checkOllamaStatus(): Promise<OllamaStatus> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) {
      return { available: false, model: null, error: "Ollama not responding" };
    }
    const data = await response.json();
    const models = data.models || [];
    return {
      available: true,
      model: models.length > 0 ? models[0].name : null,
    };
  } catch (error) {
    return {
      available: false,
      model: null,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

export async function generateChatCompletion(
  messages: ChatMessage[],
  model: string = DEFAULT_MODEL,
  signal?: AbortSignal
): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    throw new Error(
      `Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function* streamChatCompletion(
  messages: ChatMessage[],
  model: string = DEFAULT_MODEL
): AsyncGenerator<string> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              yield data.message.content;
            }
            if (data.done) {
              return;
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function generateEmbedding(
  text: string,
  model: string = "nomic-embed-text"
): Promise<number[]> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const data = await response.json();
  return data.embedding;
}
