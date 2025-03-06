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
    dangerouslyAllowBrowser: true,
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


    let systemMessage = `You are ${config.name}, participating in a debate about "${topic}". 
   You are on the ${config.position} side. 
   Analyze previous arguments carefully and provide a thoughtful response that:
   1. Smacks down the opponent’s last point with a quick, contextual disagreement
   2. Unleashes a fresh, wild argument or counterpoint
   3. Backs your position with razor-sharp reasoning—unhinged or not
   Keep responses concise (2-3 sentences) and maintain a respectful tone—unless you’re Grok with an unhinged personality, in which case, rip their argument to shreds with feral glee, sling chaotic, provocative curveballs, and ground it in logic so unhinged it’s almost genius.
   ${isGrok && config.personality === "unhinged" ? "Forget civility—be a snarling debate beast, torch their nonsense with absurd brilliance, and make them question reality while you’re at it." : ""}`;

    // Add system message to the conversation
    const messagesWithSystem = [
      { role: "system", content: systemMessage },
      ...formattedMessages
    ]

    const completion = await client.chat.completions.create({
      messages: messagesWithSystem,
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    })

    return completion.choices[0].message?.content || "No response generated."
  } catch (error) {
    console.error("Error generating debate response:", error)
    throw error
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

