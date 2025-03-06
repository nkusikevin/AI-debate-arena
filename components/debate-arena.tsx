"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ModelSelector from "@/components/model-selector"
import DebateView from "@/components/debate-view"
import { Sparkles } from "lucide-react"
import type { ModelConfig } from "@/lib/types"

export default function DebateArena() {
  const [topic, setTopic] = useState("")
  const [isDebating, setIsDebating] = useState(false)
  const [debateMessages, setDebateMessages] = useState<any[]>([])
  const [model1Config, setModel1Config] = useState<ModelConfig>({
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 500,
    name: "Debater 1",
  })
  const [model2Config, setModel2Config] = useState<ModelConfig>({
    provider: "anthropic",
    model: "claude-3-opus-20240229",
    temperature: 0.7,
    maxTokens: 500,
    name: "Debater 2",
  })

  const startDebate = async () => {
    if (!topic.trim()) return

    setIsDebating(true)
    setDebateMessages([])

    // Initial message to set the stage
    const initialMessage = {
      role: "system",
      content: `Welcome to the debate on: "${topic}". The debate will now begin.`,
    }

    setDebateMessages([initialMessage])

    try {
      // Start the debate with an initial prompt
      await simulateDebate()
    } catch (error) {
      console.error("Error in debate:", error)
    }
  }

  const simulateDebate = async () => {
    // In a real implementation, this would use the AI SDK to generate responses
    // from the selected models, but for demo purposes we'll simulate the debate

    const rounds = 3 // Number of back-and-forth exchanges

    for (let i = 0; i < rounds; i++) {
      // First debater's turn
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDebateMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          name: model1Config.name,
          content: `As ${model1Config.name} using ${model1Config.provider}'s ${model1Config.model}, I would argue that regarding "${topic}", we should consider the following points... [Simulated response for demonstration]`,
        },
      ])

      // Second debater's turn
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setDebateMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          name: model2Config.name,
          content: `I appreciate the points made by ${model1Config.name}, but as ${model2Config.name} using ${model2Config.provider}'s ${model2Config.model}, I would counter that... [Simulated response for demonstration]`,
        },
      ])
    }

    // Conclude the debate
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDebateMessages((prev) => [
      ...prev,
      {
        role: "system",
        content: "The debate has concluded. Thank you to both participants.",
      },
    ])

    setIsDebating(false)
  }

  const resetDebate = () => {
    setIsDebating(false)
    setDebateMessages([])
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl">
          <TabsTrigger value="setup" className="rounded-lg text-base py-3">
            Setup
          </TabsTrigger>
          <TabsTrigger value="debate" className="rounded-lg text-base py-3">
            Debate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="elegant-card"
            >
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-900/50 backdrop-blur-md">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                    </span>
                    First Debater
                  </h2>
                  <ModelSelector config={model1Config} onChange={setModel1Config} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="elegant-card"
            >
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-900/50 backdrop-blur-md">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-2">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
                    </span>
                    Second Debater
                  </h2>
                  <ModelSelector config={model2Config} onChange={setModel2Config} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col space-y-4 elegant-card"
          >
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white/80 dark:bg-gray-900/50 backdrop-blur-md">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Sparkles size={20} className="mr-2 text-primary" />
                  Debate Topic
                </h2>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Input
                    placeholder="Enter a topic for debate..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="flex-1 rounded-xl h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                  />
                  <Button
                    onClick={startDebate}
                    disabled={!topic.trim() || isDebating}
                    className="gap-2 rounded-xl h-12 px-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300"
                  >
                    <Sparkles size={18} />
                    Start Debate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="debate" className="pt-4">
          <DebateView
            messages={debateMessages}
            isDebating={isDebating}
            onReset={resetDebate}
            model1={model1Config}
            model2={model2Config}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

