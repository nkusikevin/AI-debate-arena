"use client"

import type { LLMConfig } from "@/lib/types"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles } from "lucide-react"

interface SidebarProps {
  config: LLMConfig
  setConfig: (config: LLMConfig) => void
}

export function Sidebar({ config, setConfig }: SidebarProps) {
  const updateConfig = (key: keyof LLMConfig, value: any) => {
    setConfig({ ...config, [key]: value })
  }

  return (
    <div className="h-full backdrop-blur-xl bg-white/20 dark:bg-gray-900/30 border-r border-white/20 dark:border-gray-800/30 p-6 overflow-y-auto shadow-lg">
      <div className="flex items-center space-x-2 mb-8">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold">LLM Configuration</h2>
      </div>

      <div className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={config.model} onValueChange={(value) => updateConfig("model", value)}>
            <SelectTrigger
              id="model"
              className="backdrop-blur-md bg-white/10 dark:bg-gray-800/30 border-white/20 dark:border-gray-700/30"
            >
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
              <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
              <SelectItem value="llama-3-70b">Llama 3 70B</SelectItem>
              <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="temperature">Temperature</Label>
            <span className="text-sm text-muted-foreground">{config.temperature}</span>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.1}
            value={[config.temperature]}
            onValueChange={(value) => updateConfig("temperature", value[0])}
            className="[&>span]:bg-primary/50 [&>span]:backdrop-blur-md"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Controls randomness: Lower values are more deterministic, higher values are more creative.
          </p>
        </div>

        {/* Max Tokens */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="maxTokens">Max Tokens</Label>
            <span className="text-sm text-muted-foreground">{config.maxTokens}</span>
          </div>
          <Slider
            id="maxTokens"
            min={100}
            max={4000}
            step={100}
            value={[config.maxTokens]}
            onValueChange={(value) => updateConfig("maxTokens", value[0])}
            className="[&>span]:bg-primary/50 [&>span]:backdrop-blur-md"
          />
          <p className="text-xs text-muted-foreground mt-1">Maximum length of generated response.</p>
        </div>

        {/* Top P */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="topP">Top P</Label>
            <span className="text-sm text-muted-foreground">{config.topP}</span>
          </div>
          <Slider
            id="topP"
            min={0}
            max={1}
            step={0.05}
            value={[config.topP]}
            onValueChange={(value) => updateConfig("topP", value[0])}
            className="[&>span]:bg-primary/50 [&>span]:backdrop-blur-md"
          />
          <p className="text-xs text-muted-foreground mt-1">Controls diversity via nucleus sampling.</p>
        </div>

        {/* Frequency Penalty */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="frequencyPenalty">Frequency Penalty</Label>
            <span className="text-sm text-muted-foreground">{config.frequencyPenalty}</span>
          </div>
          <Slider
            id="frequencyPenalty"
            min={0}
            max={2}
            step={0.1}
            value={[config.frequencyPenalty]}
            onValueChange={(value) => updateConfig("frequencyPenalty", value[0])}
            className="[&>span]:bg-primary/50 [&>span]:backdrop-blur-md"
          />
          <p className="text-xs text-muted-foreground mt-1">Reduces repetition of frequent tokens.</p>
        </div>

        {/* Presence Penalty */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="presencePenalty">Presence Penalty</Label>
            <span className="text-sm text-muted-foreground">{config.presencePenalty}</span>
          </div>
          <Slider
            id="presencePenalty"
            min={0}
            max={2}
            step={0.1}
            value={[config.presencePenalty]}
            onValueChange={(value) => updateConfig("presencePenalty", value[0])}
            className="[&>span]:bg-primary/50 [&>span]:backdrop-blur-md"
          />
          <p className="text-xs text-muted-foreground mt-1">Reduces repetition of all tokens used so far.</p>
        </div>
      </div>
    </div>
  )
}

