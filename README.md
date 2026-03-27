# AI Trust Experiment (Next.js Refactor)

A lightweight, minimal dependency Next.js implementation of the A/B AI Trust experiment.

## Constraints Respected
- **Next.js/React**: Built securely using standard Next.js constraints.
- **Short Codebase**: Condensed logic down to 4 files (`layout.tsx`, `page.tsx`, `globals.css`, `package.json`).
- **Low Dependencies**: No heavy frontend libraries like Tailwind or framer-motion. Just React and Next frameworks.

## Features
- **A/B Logic**: Randomly assigns users to Condition A (Technical) or Condition B (Warm/Friendly).
- **High-Resolution Latency Logging**: Uses `performance.now()` to measure click latency to the nearest millisecond.
- **Data Export**: Immediately downloads a structured JSON upon decision.
- **AI Recommendation Ready**: Includes a commented-out API block (e.g., Groq/OpenAI) for dynamically fetching generated context.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## API Integration (Optional)
Check `app/page.tsx` for a commented-out standard fetch block utilizing Groq (`https://api.groq.com/openai/v1/chat/completions`) or any OpenAI compatible schema. You can use any similarly unified API endpoint to inject generative messaging by un-commenting the code.
