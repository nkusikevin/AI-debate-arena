"use client"

import type { Message, LLMConfig } from "@/lib/types"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Bot, AlertTriangle, ShieldAlert } from "lucide-react"

interface DebateMessageProps {
  message: Message
  model1: LLMConfig
  model2: LLMConfig
}

export function DebateMessage({ message, model1, model2 }: DebateMessageProps) {
  const isModel1 = message.modelName === model1.name
  const isModel2 = message.modelName === model2.name
  const isSystem = message.role === "system"

  // Check if this is an unhinged Grok message
  const isUnhingedGrok =
    (isModel1 && model1.personality === "unhinged" && model1.model.startsWith("grok")) ||
    (isModel2 && model2.personality === "unhinged" && model2.model.startsWith("grok"))

  // Check if this is a security warning
  const isSecurityWarning = isSystem && message.content.includes("SECURITY WARNING")

  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {isSystem ? (
        <div
          className={`text-center py-4 px-6 rounded-xl shadow-lg backdrop-blur-sm mx-auto max-w-[80%] ${
            isSecurityWarning
              ? "bg-yellow-900/50 border border-yellow-700/50 text-yellow-200"
              : "bg-gray-800/80 border border-gray-700/80 text-gray-200"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isSecurityWarning && <ShieldAlert className="h-5 w-5 text-yellow-300" />}
            <p className="font-medium">{message.content}</p>
          </div>
        </div>
      ) : (
        <div className={`flex ${isModel1 ? "justify-start" : "justify-end"}`}>
          <div
            className={`max-w-[80%] rounded-xl p-5 shadow-lg backdrop-blur-sm ${
              isUnhingedGrok
                ? "bg-red-950/70 border border-red-700/50 text-red-50"
                : isModel1
                  ? "bg-blue-950/70 border border-blue-700/50 text-blue-50"
                  : "bg-purple-950/70 border border-purple-700/50 text-purple-50"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  isUnhingedGrok
                    ? "bg-red-800/80 text-red-200 ring-2 ring-red-600/50"
                    : isModel1
                      ? "bg-blue-800/80 text-blue-200 ring-2 ring-blue-600/50"
                      : "bg-purple-800/80 text-purple-200 ring-2 ring-purple-600/50"
                }`}
              >
                {isUnhingedGrok ? <AlertTriangle size={18} /> : <Bot size={20} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-base">{message.modelName}</p>
                  {isUnhingedGrok && (
                    <span className="text-xs bg-red-800/80 text-red-100 px-2 py-0.5 rounded-full">Unhinged</span>
                  )}
                </div>
                <p className="text-xs opacity-80">{isModel1 ? model1.model : model2.model}</p>
              </div>
            </div>
            <div className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</div>
            <div
              className={`text-xs mt-3 ${
                isUnhingedGrok ? "text-red-300/70" : isModel1 ? "text-blue-300/70" : "text-purple-300/70"
              }`}
            >
              {formattedTime}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

