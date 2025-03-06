import OpenAI from "openai"
import type { ModelConfig } from "./types"

//grok-2-1212

// Create OpenAI client for each provider
const createOpenAIClient = (apiKey: string) => {
  if (!apiKey) {
    console.error("OpenAI API key is missing")
    throw new Error("OpenAI API key is required")
  }
  console.log("Creating OpenAI client with key length:", apiKey.length) // Debug log
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  })
}
// Create Grok client (X.AI)
const createGrokClient = (apiKey: string) => {
  return new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.x.ai/v1",
    dangerouslyAllowBrowser: true, // SECURITY WARNING: This exposes your API key in the browser
  })
}

export async function generateDebateResponse(config: ModelConfig, topic: string, previousMessages: any[]) {
  try {
    // Format messages for the API
    const formattedMessages = formatMessagesForAPI(previousMessages, topic, config)

    // Determine if this is a Grok model
    const isGrok = config.model.startsWith("grok")

    // Create the appropriate client
    const client = isGrok ? createGrokClient(config.apiKey || "") : createOpenAIClient(config.apiKey || "")

    // Set system message based on personality
    let systemMessage = `You are ${config.name}, participating in a debate about "${topic}". Provide brief, clear responses (2-3 sentences max) with concise arguments. Be direct and to the point.`

    // If this is a Grok model with unhinged personality, modify the system message
    if (isGrok && config.personality === "unhinged") {
      systemMessage = `You are ${config.name}, participating in an unfiltered debate about "${topic}". Be provocative and brutally honest, but keep responses short (2-3 sentences max). Be direct and impactful.`
    }

    // Add system message to the beginning
    formattedMessages.unshift({
      role: "system",
      content: systemMessage,
    })

    // Make the API call
    const completion = await client.chat.completions.create({
      model: config.model,
      messages: formattedMessages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    })

    return completion.choices[0]?.message?.content || "No response generated."
  } catch (error) {
    console.error("Error generating debate response:", error)
    return `Error: Unable to generate a response. Please check your API key and try again.`
  }
}

// Helper function to format messages for the API
function formatMessagesForAPI(messages: any[], topic: string, config: ModelConfig) {
  // Filter out system messages and format for the API
  return messages
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      role: msg.role,
      content: msg.content,
      name: msg.modelName === config.name ? config.name : undefined,
    }))
}

