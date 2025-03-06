"use client"

import type { Message } from "@/lib/types"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { User, Bot } from "lucide-react"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[80%] md:max-w-[70%] flex ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-2`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
          }`}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div
          className={`rounded-2xl p-4 backdrop-blur-md ${
            isUser
              ? "bg-primary/20 border border-primary/30 text-primary-foreground"
              : "bg-secondary/10 border border-secondary/20 text-secondary-foreground"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          <div className={`text-xs mt-2 ${isUser ? "text-primary/70" : "text-secondary/70"}`}>{formattedTime}</div>
        </div>
      </div>
    </motion.div>
  )
}

