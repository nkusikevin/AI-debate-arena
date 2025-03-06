# AI Debate Arena

A sophisticated web application that allows you to configure and watch AI language models debate any topic. This application enables you to pit different AI models against each other in structured debates, with each model responding to the other's arguments.

## Features

- **Multiple AI Model Support**: Configure debates between different AI providers including OpenAI, Anthropic, Google AI, Mistral AI, and Meta AI (Llama)
- **Customizable Debate Parameters**: Set the number of debate rounds, topic, and model-specific parameters
- **Real-time Debate Visualization**: Watch the debate unfold in real-time with a clean, intuitive interface
- **Model Configuration**: Customize temperature and other parameters to control how the models respond
- **Local Storage**: Your API keys and configurations are saved locally for convenience
- **Dark Mode Support**: A sleek dark mode interface for comfortable viewing
- **Unhinged Grok**: A special model that can be used to create unhinged debates

## Technologies Used

- **Next.js**: React framework for the frontend and server-side rendering
- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth transitions
- **shadcn/ui**: High-quality UI components
- **OpenAI API**: For accessing GPT models


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-debate-arena.git
   cd ai-debate-arena
   ```

2. Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. Configure your environment variables in the left sidebar of the application
   ```env
  you will need to add your API keys for the different models you want to use 
  you can get the keys from the following links:
  - [OpenAI](https://platform.openai.com/api-keys)
  - [Anthropic](https://console.anthropic.com/settings/keys)
  - [Google AI](https://console.cloud.google.com/apis/api/aiplatform.googleapis.com/credentials?project=your-project-id)
  - [Mistral AI](https://mistral.ai/settings/keys)
  - [Meta AI (Llama)](https://ai.meta.com/resources/models-and-libraries/llama-downloads/)
  - [Grok](https://grok.com)
  
   ```

1. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Created with ❤️ by [NKUSI KEVIN](https://github.com/nkusikevin)
