"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ModelConfig } from "@/lib/types"

interface ModelSelectorProps {
  config: ModelConfig
  onChange: (config: ModelConfig) => void
}

export default function ModelSelector({ config, onChange }: ModelSelectorProps) {
  const updateConfig = (key: keyof ModelConfig, value: any) => {
    onChange({ ...config, [key]: value })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-medium">
          Debater Name
        </Label>
        <Input
          id="name"
          value={config.name}
          onChange={(e) => updateConfig("name", e.target.value)}
          placeholder="Enter a name for this debater"
          className="rounded-xl h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider" className="text-base font-medium">
          Provider
        </Label>
        <Select value={config.provider} onValueChange={(value) => updateConfig("provider", value)}>
          <SelectTrigger
            id="provider"
            className="rounded-xl h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
          >
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="google">Google AI</SelectItem>
            <SelectItem value="mistral">Mistral AI</SelectItem>
            <SelectItem value="meta">Meta AI (Llama)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model" className="text-base font-medium">
          Model
        </Label>
        <Select value={config.model} onValueChange={(value) => updateConfig("model", value)}>
          <SelectTrigger
            id="model"
            className="rounded-xl h-11 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
          >
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            {config.provider === "openai" && (
              <>
                <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </>
            )}
            {config.provider === "anthropic" && (
              <>
                <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
                <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
              </>
            )}
            {config.provider === "google" && (
              <>
                <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
              </>
            )}
            {config.provider === "mistral" && (
              <>
                <SelectItem value="mistral-large-latest">Mistral Large</SelectItem>
                <SelectItem value="mistral-medium-latest">Mistral Medium</SelectItem>
                <SelectItem value="mistral-small-latest">Mistral Small</SelectItem>
              </>
            )}
            {config.provider === "meta" && (
              <>
                <SelectItem value="llama-3-70b-instruct">Llama 3 70B</SelectItem>
                <SelectItem value="llama-3-8b-instruct">Llama 3 8B</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between">
          <Label htmlFor="temperature" className="text-base font-medium">
            Temperature
          </Label>
          <span className="text-sm font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
            {config.temperature}
          </span>
        </div>
        <Slider
          id="temperature"
          min={0}
          max={1}
          step={0.1}
          value={[config.temperature]}
          onValueChange={(value) => updateConfig("temperature", value[0])}
          className="py-1"
        />
        <p className="text-xs text-muted-foreground">
          Controls randomness: Lower values are more deterministic, higher values are more creative.
        </p>
      </div>
    </div>
  )
}

