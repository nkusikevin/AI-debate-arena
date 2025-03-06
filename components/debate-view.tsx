"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, Bot, Sparkles } from "lucide-react"
import type { ModelConfig } from "@/lib/types"

interface DebateViewProps {
  messages: any[]
  isDebating: boolean
  onReset: () => void
  model1: ModelConfig
  model2: ModelConfig
}

export default function DebateView({ messages, isDebating, onReset, model1, model2 }: DebateViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const getMessageStyle = (message: any) => {
    if (message.role === "system") {
      return "system-message"
    }
    if (message.name === model1.name) {
      return "model1-message"
    }
    if (message.name === model2.name) {
      return "model2-message"
    }
    return "bg-background"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Debate Session
        </h2>
        <Button variant="outline" onClick={onReset} disabled={isDebating} className="rounded-xl">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Debate
        </Button>
      </div>

      {messages.length === 0 ? (
        <Card className="border-dashed rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md">
          <CardContent className="pt-10 pb-10 text-center text-muted-foreground">
            <Bot className="mx-auto h-16 w-16 mb-6 opacity-50 text-primary" />
            <p className="text-lg">Configure your models and start a debate to see the results here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto p-1 pr-2 scrollbar-thin">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-5 rounded-2xl border shadow-lg backdrop-blur-sm ${getMessageStyle(message)}`}
              >
                {message.role === "system" ? (
                  <p className="text-center font-medium text-gray-200">{message.content}</p>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`h-10 w-10 rounded-full ${
                          message.name === model1.name
                            ? "bg-blue-800/80 text-blue-200 ring-2 ring-blue-600/50"
                            : "bg-purple-800/80 text-purple-200 ring-2 ring-purple-600/50"
                        } flex items-center justify-center`}
                      >
                        <Bot size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-base">{message.name}</p>
                        <p className="text-xs opacity-80">
                          {message.name === model1.name
                            ? `${model1.provider} / ${model1.model}`
                            : `${model2.provider} / ${model2.model}`}
                        </p>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</p>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {/* This empty div is used as a reference for scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>
      )}

      {isDebating && (
        <div className="flex justify-center py-6">
          <div className="flex items-center space-x-3 glass-card px-6 py-3 shadow-lg rounded-xl">
            <div className="animate-pulse text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-lg font-medium">Debate in progress...</span>
          </div>
        </div>
      )}
    </div>
  )
}

