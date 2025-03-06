"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { SendHorizonal } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isTyping: boolean
}

export function ChatInput({ onSendMessage, isTyping }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isTyping) {
      onSendMessage(input)
      setInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="w-full rounded-full py-3 px-4 backdrop-blur-md bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
          disabled={isTyping}
        />
      </div>
      <Button
        type="submit"
        disabled={!input.trim() || isTyping}
        className="rounded-full h-12 w-12 p-0 flex items-center justify-center bg-primary/80 hover:bg-primary backdrop-blur-md"
      >
        <SendHorizonal size={18} />
      </Button>
    </form>
  )
}

