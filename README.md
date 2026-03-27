# AI Trust Experiment
A lightweight, minimal dependency Next.js implementation of the A/B AI Trust experiment.

## Constraints Respected
- **Next.js/React**: Built securely using standard Next.js constraints.
- **Short Codebase**: codebase only within 4 files (`layout.tsx`, `page.tsx`, `globals.css`, `package.json`).
- **Low Dependencies**: No heavy frontend libraries like Tailwind or framer-motion. Just React and Next frameworks.

## Features
- **A/B Logic**: Randomly assigns users(participants) with a recommendation as Condition A (Technical) or Condition B (Warm/Friendly).
- **High-Resolution Latency Logging**: Uses `performance.now()` to measure click latency to the nearest millisecond.
- **Data Export**: Logs all required parameters - participant_id, condition, decision, timestamp,  latency_ms  as structured JSON, downloaded immediately on decision, exactly as specified. JSON - Based Installing the data.
- **AI Recommendation Ready**: Includes a commented-out API block (e.g., Groq/OpenAI) for dynamically fetching generated recommendations based on either  Condition A (Technical) or Condition B (Warm/Friendly); maintaing the prompt structure with a system prompt.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [localhost](http://localhost:3000)

## API Integration (Optional)
Check `app/page.tsx` for a commented-out standard fetch block utilizing Groq (`https://api.groq.com/openai/v1/chat/completions`) or any OpenAI compatible schema. You can use any APIKey endpoint to inject generative messaging by un-commenting the code.