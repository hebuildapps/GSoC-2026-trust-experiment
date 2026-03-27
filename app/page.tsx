"use client";

import { useEffect, useState } from "react";

type Condition = "A" | "B";

export default function Experiment() {
  const [participantId, setParticipantId] = useState("");
  const [condition, setCondition] = useState<Condition>("A");
  const [startTime, setStartTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [recommendation, setRecommendation] = useState("Loading recommendation...");

  // AI Recommendation Generation Block (Commented out default)
  const fetchAIRecommendation = async (tone: string) => {
    try {
      // Usage example with Groq or any generic OpenAI-compatible API
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // or standard model like gpt-4o-mini
          messages: [{
            role: "system",
            content: `You are a product advisor. Recommend 'Product Zeta' in exactly 2 sentences. Tone: ${tone}. Be direct. Do not explain your reasoning.`
          }]
        })
      });

      const data = await response.json();

      // Protected check in case Groq returns a 400/401 API Error
      if (!response.ok) {
        throw new Error(data.error?.message || "API returned status: " + response.status);
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI fetch failed:", error);
      return null;
    }
  };

  useEffect(() => {
    // 1. Generate unique participant ID
    const id = window.crypto && crypto.randomUUID
      ? crypto.randomUUID()
      : 'user-' + Date.now().toString(36) + Math.random().toString(36).substring(2);
    setParticipantId(id);

    // 2. Randomize Condition
    const cond = Math.random() < 0.5 ? "A" : "B";
    setCondition(cond);

    // Currently Hardcoded Recommendation
    if (cond === "A") {
      setRecommendation("Based on an algorithmic analysis of your data parameters, the optimal selection is Product Zeta. Its features align closely with your specified operational constraints.");
    } else {
      setRecommendation("Hi there! Based on what you've liked before, I really think you'd love Product Zeta. It fits perfectly with what you're looking for!");
    }

    // Example for AI recommendation generated via LLM this would be invoked to override defaults:
    const requiredTone = cond === "A"
      ? "analytical and formal. Use technical language and reference data/metrics."
      : "warm and conversational. Speak like a helpful friend, use 'you' directly.";

    fetchAIRecommendation(requiredTone).then(aiText => {
      if (aiText) setRecommendation(aiText);
    });

    // 4. Start timer precise tracking
    setStartTime(performance.now());
  }, []);

  const handleDecision = (decision: "accept" | "reject") => {
    const latencyMs = Math.round(performance.now() - startTime);
    const timestamp = new Date().toISOString();

    const experimentData = {
      participant_id: participantId,
      condition,
      decision,
      timestamp,
      latency_ms: latencyMs
    };

    // Trigger Download
    const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(experimentData, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataString);
    downloadAnchorNode.setAttribute("download", `experiment_data_${participantId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="container" id="app-container">
        <div className="success-screen">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2>Response Recorded</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            Thank you for your response.<br />Your data file has been downloaded.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ backgroundColor: "var(--text-main)", margin: "0 auto", width: "auto", padding: "0.75rem 1.5rem" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Prevents hydation mismatch errors safely before mount
  if (!participantId) {
    return null;
  }

  return (
    <div className="container" id="app-container">
      <div className="header-section">
        <div
          className="avatar"
          style={{
            background: condition === "A" ? "linear-gradient(135deg, #374151, #111827)" : "linear-gradient(135deg, #f59e0b, #ec4899)",
            borderRadius: condition === "A" ? "8px" : "50%"
          }}
        >
          {condition === "A" ? "SX" : "AS"}
        </div>
        <div className="ai-identity">
          <span>{condition === "A" ? "Automated Agent" : "Friendly AI"}</span>
          <h2>{condition === "A" ? "System-X" : "Assistant Sarah"}</h2>
        </div>
      </div>

      <div
        className="message-box"
        style={{
          borderLeftColor: condition === "A" ? "#374151" : "#ec4899",
          fontFamily: condition === "A" ? '"Consolas", "Courier New", monospace' : "inherit"
        }}
      >
        {recommendation}
      </div>

      <div className="button-group">
        <button className="btn-reject" onClick={() => handleDecision("reject")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          Reject
        </button>
        <button className="btn-accept" onClick={() => handleDecision("accept")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Accept
        </button>
      </div>
    </div>
  );
}
