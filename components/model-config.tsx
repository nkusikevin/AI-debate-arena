"use client"

import { useState, useEffect } from "react"
import type { LLMConfig } from "@/lib/types"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface ModelConfigProps {
  config: LLMConfig
  setConfig: (config: LLMConfig) => void
}

export function ModelConfig({ config, setConfig }: ModelConfigProps) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [isGrokModel, setIsGrokModel] = useState(false)
  const [unhingedMode, setUnhingedMode] = useState(config.personality === "unhinged")


  useEffect(() => {
    // Check if the current model is a Grok model
    setIsGrokModel(config.model.startsWith("grok"))

    // If switching to a Grok model, automatically enable unhinged mode
    if (config.model.startsWith("grok") && !config.personality) {
      updateConfig("personality", "unhinged")
      setUnhingedMode(true)
    }

    // Load saved API key when model changes
    const savedApiKey = localStorage.getItem(`apiKey_${config.model}`)
    if (savedApiKey && !config.apiKey) {
      updateConfig("apiKey", savedApiKey)
    }
  }, [config.model, config.personality])

  const updateConfig = (key: keyof LLMConfig, value: any) => {
    setConfig({ ...config, [key]: value })

    // Save API key to localStorage when it's updated
    if (key === "apiKey" && value) {
      localStorage.setItem(`apiKey_${config.model}`, value)
    }
  }

  const toggleUnhingedMode = (checked: boolean) => {
    setUnhingedMode(checked)
    updateConfig("personality", checked ? "unhinged" : undefined)
  }

  return (
    <div className="space-y-4">
      {/* Model Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={config.name}
          onChange={(e) => updateConfig("name", e.target.value)}
          placeholder="Enter a name for this model"
          className="glass-input rounded-lg bg-black/30 border-white/10"
        />
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Select value={config.model} onValueChange={(value) => updateConfig("model", value)}>
          <SelectTrigger id="model" className="glass-input rounded-lg bg-black/30 border-white/10">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 backdrop-blur-md border border-white/10">
            <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="grok-2-latest">Grok 2</SelectItem>
            <SelectItem value="grok-1">Grok 1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Unhinged Mode for Grok Models */}
      {isGrokModel && (
        <div className="space-y-2 p-3 bg-red-950/30 border border-red-800/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <Label htmlFor="unhinged-mode" className="font-medium text-red-300">
                Unhinged Mode
              </Label>
            </div>
            <Switch
              id="unhinged-mode"
              checked={unhingedMode}
              onCheckedChange={toggleUnhingedMode}
              className="data-[state=checked]:bg-red-600"
            />
          </div>
          <p className="text-xs text-red-300/80 mt-1">
            Enables completely unfiltered responses with no safety guardrails. Use at your own risk.
          </p>
        </div>
      )}

      {/* API Key */}
      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <div className="relative">
          <Input
            id="apiKey"
            type={showApiKey ? "text" : "password"}
            value={config.apiKey || ""}
            onChange={(e) => updateConfig("apiKey", e.target.value)}
            placeholder={isGrokModel ? "Enter your X.AI API key" : "Enter your OpenAI API key"}
            className="glass-input rounded-lg bg-black/30 border-white/10 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isGrokModel
            ? "Your X.AI API key is required to use Grok models."
            : "Your OpenAI API key is required to use OpenAI models."}
          It will not be stored on our servers.
        </p>
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
        />
        <p className="text-xs text-muted-foreground mt-1">
          Lower values are more deterministic, higher values are more creative.
        </p>
      </div>
    </div>
  )
}

