export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  modelName?: string
}

export interface LLMConfig {
  name: string
  model: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  apiKey?: string
  personality?: string
}

export interface ModelConfig {
  provider: string
  model: string
  temperature: number
  maxTokens: number
  name: string
  apiKey?: string
  personality?: string
}

