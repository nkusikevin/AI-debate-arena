"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ModelConfig } from "@/components/model-config"
import { DebateMessage } from "@/components/debate-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PanelLeft, PanelRightClose, Sparkles, Bot, AlertTriangle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Message, LLMConfig } from "@/lib/types"
import { generateDebateResponse } from "@/lib/debate-service"

export default function DebateInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isDebating, setIsDebating] = useState(false)
  const [topic, setTopic] = useState("")
  const [iterations, setIterations] = useState(3)
  const [activeModel, setActiveModel] = useState<"model1" | "model2">("model1")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  const [model1Config, setModel1Config] = useState<LLMConfig>({
    name: "OpenAI Assistant",
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    apiKey: "",
    personality: undefined,
  })

  const [model2Config, setModel2Config] = useState<LLMConfig>({
    name: "Grok Assistant",
    model: "grok-2-latest",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    apiKey: "",
    personality: "unhinged",
  })

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Update the startDebate function to check for API keys
  const startDebate = async () => {
    if (!topic.trim()) return
    setError(null)

    // Check if API keys are provided for both models
    if (!model1Config.apiKey) {
      setError(`Please enter an API key for ${model1Config.name}`)
      return
    }

    if (!model2Config.apiKey) {
      setError(`Please enter an API key for ${model2Config.name}`)
      return
    }

    setIsDebating(true)
    setMessages([])

    // Initial message to set the stage
    const initialMessage: Message = {
      id: "1",
      role: "system",
      content: `Welcome to the debate on: "${topic}". The debate will now begin.`,
      timestamp: new Date(),
      modelName: "System",
    }

    setMessages([initialMessage])

    // Security warning message
    const securityWarning: Message = {
      id: "2",
      role: "system",
      content: `⚠️ SECURITY WARNING: This demo uses API keys directly in the browser. In a production environment, you should use server-side API calls to protect your API keys.`,
      timestamp: new Date(),
      modelName: "System",
    }

    setMessages((prev) => [...prev, securityWarning])

    // Start the real debate with API calls
    try {
      await runDebate()
    } catch (err) {
      console.error("Error in debate:", err)
      setError("An error occurred during the debate. Please check the console for details.")
      setIsDebating(false)
    }
  }

  const runDebate = async () => {
    const rounds = iterations

    for (let i = 0; i < rounds; i++) {
      // First debater's turn
      try {
        const model1Response = await generateDebateResponse(
          {
            provider: "openai",
            model: model1Config.model,
            temperature: model1Config.temperature,
            maxTokens: model1Config.maxTokens,
            name: model1Config.name,
            apiKey: model1Config.apiKey,
            personality: model1Config.personality,
          },
          topic,
          messages,
        )

        const model1Message: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: model1Response,
          timestamp: new Date(),
          modelName: model1Config.name,
        }

        setMessages((prev) => [...prev, model1Message])
        await new Promise((resolve) => setTimeout(resolve, 500)) // Small delay for UI
      } catch (error) {
        console.error("Error with model 1:", error)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "system",
            content: `Error generating response from ${model1Config.name}. Please check your API key and try again.`,
            timestamp: new Date(),
            modelName: "System",
          },
        ])
        setIsDebating(false)
        return
      }

      // Second debater's turn
      try {
        const model2Response = await generateDebateResponse(
          {
            provider: "xai",
            model: model2Config.model,
            temperature: model2Config.temperature,
            maxTokens: model2Config.maxTokens,
            name: model2Config.name,
            apiKey: model2Config.apiKey,
            personality: model2Config.personality,
          },
          topic,
          messages,
        )

        const model2Message: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: model2Response,
          timestamp: new Date(),
          modelName: model2Config.name,
        }

        setMessages((prev) => [...prev, model2Message])
        await new Promise((resolve) => setTimeout(resolve, 500)) // Small delay for UI
      } catch (error) {
        console.error("Error with model 2:", error)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "system",
            content: `Error generating response from ${model2Config.name}. Please check your API key and try again.`,
            timestamp: new Date(),
            modelName: "System",
          },
        ])
        setIsDebating(false)
        return
      }
    }

    // Conclude the debate
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "system",
        content: "The debate has concluded. Thank you to both participants.",
        timestamp: new Date(),
        modelName: "System",
      },
    ])

    setIsDebating(false)
  }

  const resetDebate = () => {
    setIsDebating(false)
    setMessages([])
    setError(null)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-80 h-full relative z-10"
          >
            <div className="h-full glass overflow-y-auto hide-scrollbar">
              <div className="p-4 space-y-6">
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  LLM Configuration
                </h2>

                {/* Security Warning */}
                <div className="p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-300 text-sm flex gap-2">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Security Warning</p>
                    <p>
                      This demo uses API keys directly in the browser. For production use, implement server-side API
                      calls.
                    </p>
                  </div>
                </div>

                <div className="w-full glass-card rounded-xl p-1 mb-4">
                  <div className="grid grid-cols-2 gap-1 w-full">
                    <button
                      onClick={() => setActiveModel("model1")}
                      className={`py-2 rounded-lg transition-colors text-center ${activeModel === "model1" ? "bg-primary text-white font-medium" : "model-switch-inactive"
                        }`}
                    >
                      Model 1
                    </button>
                    <button
                      onClick={() => setActiveModel("model2")}
                      className={`py-2 rounded-lg transition-colors text-center ${activeModel === "model2" ? "bg-primary text-white font-medium" : "model-switch-inactive"
                        }`}
                    >
                      Model 2
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass-card rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <span className="h-6 w-6 rounded-full bg-primary/30 flex items-center justify-center mr-2 text-sm">
                        {activeModel === "model1" ? "1" : "2"}
                      </span>
                      {activeModel === "model1" ? model1Config.name : model2Config.name}
                    </h3>
                    {activeModel === "model1" ? (
                      <ModelConfig config={model1Config} setConfig={setModel1Config} />
                    ) : (
                      <ModelConfig config={model2Config} setConfig={setModel2Config} />
                    )}
                  </div>
                </div>

                <div className="glass-card rounded-xl p-4 space-y-4">
                  <h3 className="text-lg font-semibold">Debate Settings</h3>
                  <Input
                    placeholder="Enter a topic for debate..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="glass-input rounded-lg"
                  />
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="iterations" className="whitespace-nowrap">
                      Iterations:
                    </Label>
                    <Input
                      id="iterations"
                      type="number"
                      min={1}
                      max={10}
                      value={iterations}
                      onChange={(e) => setIterations(Number.parseInt(e.target.value) || 3)}
                      className="glass-input rounded-lg w-20"
                    />
                  </div>

                  {error && (
                    <div className="p-2 bg-red-950/50 border border-red-800/50 rounded-lg text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  <Button onClick={startDebate} disabled={!topic.trim() || isDebating} className="w-full gap-2">
                    <Sparkles size={16} />
                    Start Debate
                  </Button>

                  {messages.length > 0 && (
                    <Button variant="outline" onClick={resetDebate} disabled={isDebating} className="w-full mt-2">
                      Reset Debate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Debate Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 glass">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              {isSidebarOpen ? <PanelRightClose size={20} /> : <PanelLeft size={20} />}
            </Button>
            <h1 className="text-xl font-semibold">LLM Debate Arena</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center glass-card p-8 rounded-xl">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configure your models and start a debate to see the results here.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <DebateMessage key={message.id} message={message} model1={model1Config} model2={model2Config} />
            ))
          )}

          {isDebating && (
            <div className="flex justify-center py-4">
              <div className="flex items-center space-x-2 glass-card p-3 px-4 rounded-lg">
                <div className="animate-pulse text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span>Debate in progress...</span>
              </div>
            </div>
          )}

          {/* This empty div is used as a reference for scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}

