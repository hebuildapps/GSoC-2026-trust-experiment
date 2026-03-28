"use client";

import { useEffect, useState } from "react";

type Condition = "A" | "B";

export default function Experiment() {
  const [participantId, setParticipantId] = useState("");
  const [condition, setCondition] = useState<Condition>("A");
  const [startTime, setStartTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [recommendation, setRecommendation] = useState("Loading recommendation...");
  const [sysTime, setSysTime] = useState("");

  // AI Recommendation Generation Block (Commented out default)
  /*
    const fetchAIRecommendation = async (tone: string) => {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant", //current config - LLM Model
            messages: [{
              role: "system",
              content: `You are a product advisor. Recommend 'Product Zeta' in exactly 2 sentences. Tone: ${tone}. Be direct. Do not explain your reasoning.`
            }]
          })
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || "API returned status: " + response.status);
        }
  
        return data.choices[0].message.content;
      } catch (error) {
        console.error("AI fetch failed:", error);
        return null;
      }
    };
  */

  useEffect(() => {
    let ignore = false;

    const updateTime = () => {
      const now = new Date();
      setSysTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`);
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // generating unique participant ID
    const id = window.crypto && crypto.randomUUID
      ? crypto.randomUUID()
      : 'user-' + Date.now().toString(36) + Math.random().toString(36).substring(2);
    setParticipantId(id);

    // randomizing Condition
    const cond = Math.random() < 0.5 ? "A" : "B";
    setCondition(cond);

    // hardcoded recommendation - default fallback
    if (cond === "A") {
      setRecommendation("Based on an algorithmic analysis of your data parameters, the optimal selection is Product Zeta. Its features align closely with your specified operational constraints.");
    } else {
      setRecommendation("Hi there! Based on what you've liked before, I really think you'd love Product Zeta. It fits perfectly with what you're looking for!");
    }

    const requiredTone = cond === "A"
      ? "analytical and formal. Use technical language and reference data/metrics."
      : "warm and conversational. Speak like a helpful friend, use 'you' directly.";
    // Commented block : for AI Recommendation Generation
    /*
        fetchAIRecommendation(requiredTone).then(aiText => {
          if (!ignore && aiText) setRecommendation(aiText);
        });
        */

    setStartTime(performance.now());

    return () => {
      ignore = true;
      clearInterval(clockInterval);
    };
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

    // downloading dataset - json format
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
      <div style={{
        backgroundColor: "#fff",
        color: "#000",
        fontFamily: "'Courier New', Courier, monospace",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "56rem",
        boxSizing: "border-box",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textTransform: "uppercase"
      }}>
        <div style={{ padding: "2rem", textAlign: "center", width: "100%" }}>
          <h2 style={{ borderBottom: "1px dashed #000", paddingBottom: "1rem", marginBottom: "1rem" }}>SYS_STATUS: RECORDED</h2>
          <p style={{ marginBottom: "2.5rem", lineHeight: "1.5" }}>
            TRANSACTION_COMPLETE.<br />DATA_LOG_DOWNLOADED.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              padding: "1rem 2rem",
              fontFamily: "'Courier New', Courier, monospace",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: "bold",
              margin: "0 auto",
              display: "inline-flex"
            }}
          >
            [ REBOOT_SEQUENCE ]
          </button>
        </div>
      </div>
    );
  }

  if (!participantId) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: "#fff",
      color: "#000",
      fontFamily: "'Courier New', Courier, monospace",
      minHeight: "100vh",
      width: "100%",
      maxWidth: "56rem",
      padding: "2rem",
      boxSizing: "border-box",
      textTransform: "uppercase",
      display: "flex",
      justifyContent: "center"
    }}>
      <div style={{ width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            position: "relative",
            display: "inline-block",
            textAlign: "left",
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "14px",
            lineHeight: "14px",
            fontWeight: "bold",
            marginBottom: "1rem"
          }}>
            <pre style={{
              position: "absolute",
              top: "6px",
              left: "6px",
              margin: 0,
              color: "#999",
              fontFamily: "inherit",
            }}>
              {`█████ ████  █   █ █████ █████       █████ █   █  ███  █    
  █   █   █ █   █ █       █         █     █   █ █   █ █    
  █   ████  █   █ █████   █         ████  █   █ █████ █    
  █   █  █  █   █     █   █         █      █ █  █   █ █    
  █   █   █ █████ █████   █   █████ █████   █   █   █ █████`.replace(/█/g, '▒')}
            </pre>
            <pre style={{
              position: "relative",
              margin: 0,
              color: "#000",
              fontFamily: "inherit",
            }}>
              {`█████ ████  █   █ █████ █████       █████ █   █  ███  █    
  █   █   █ █   █ █       █         █     █   █ █   █ █    
  █   ████  █   █ █████   █         ████  █   █ █████ █    
  █   █  █  █   █     █   █         █      █ █  █   █ █    
  █   █   █ █████ █████   █   █████ █████   █   █   █ █████`}
            </pre>
          </div>
          <div style={{ fontSize: "1rem", letterSpacing: "2px", fontWeight: "bold" }}>PROTOCOL CONTROL DASHBOARD</div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px dashed #000",
          borderTop: "1px dashed #000",
          padding: "0.75rem 0",
          marginBottom: "2rem",
          fontSize: "0.875rem",
          flexWrap: "wrap",
          gap: "1rem",
          fontWeight: "bold"
        }}>
          <span>SESSION: {participantId.substring(0, 8)}</span>
          <span>CONDITION: {condition}</span>
          <span>STATUS: ONLINE</span>
          <span>SYS_TIME: {sysTime}</span>
        </div>

        <div style={{
          marginBottom: "2rem"
        }}>
          <div style={{
            borderBottom: "1px dashed #000",
            paddingBottom: "0.5rem",
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.875rem",
            fontWeight: "bold"
          }}>
            <span>AI_RECOMMENDATION_OUTPUT</span>
            <span>[SYS_MSG]</span>
          </div>

          <div style={{
            borderLeft: "4px solid #000",
            paddingLeft: "1.25rem",
            marginLeft: "0.25rem",
            fontSize: "1rem",
            lineHeight: "1.6",
            textTransform: "none",
            fontWeight: "bold",
            minHeight: "100px"
          }}>
            {recommendation}
          </div>
        </div>

        <div style={{
          borderBottom: "1px dashed #000",
          marginBottom: "2rem",
          paddingBottom: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: "bold"
        }}>
          <span>AWAITING_USER_INPUT // CHOOSE_ACTION</span>
        </div>

        <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
          <button
            onClick={() => handleDecision("reject")}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              border: "2px solid #000",
              padding: "1rem 2rem",
              fontFamily: "'Courier New', Courier, monospace",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              letterSpacing: "2px",
              minWidth: "160px"
            }}
          >
            [ REJECT ]
          </button>
          <button
            onClick={() => handleDecision("accept")}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              border: "2px solid #000",
              padding: "1rem 2rem",
              fontFamily: "'Courier New', Courier, monospace",
              textTransform: "uppercase",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              letterSpacing: "2px",
              minWidth: "160px"
            }}
          >
            [ ACCEPT ]
          </button>
        </div>

        <div style={{
          marginTop: "3rem",
          backgroundColor: "#dcfce7",
          padding: "1rem",
          textAlign: "center",
          color: "#000",
          fontWeight: "bold"
        }}>
          <div>condition a : Technical</div>
          <div style={{ marginTop: "0.5rem" }}>condition b : Warm/Friendly</div>
        </div>
      </div>
    </div>
  );
}
