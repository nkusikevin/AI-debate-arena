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


export type ModelConfig = {
  model: string
  name: string
  apiKey: string
  temperature: number
  maxTokens: number
  personality?: string
  position: 'proposition' | 'opposition'
}
