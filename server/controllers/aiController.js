/**
 * Powers POST /api/ai/chat, which AIAssistant.jsx's getAssistantReply() will
 * call once wired up:
 *
 *   const response = await fetch("/api/ai/chat", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ message: userMessage, history: conversation }),
 *   });
 *   const { reply } = await response.json();
 *
 * Uses the Gemini REST API directly (no extra SDK dependency) so this file
 * only needs Node's built-in fetch. Requires GEMINI_API_KEY in server/.env;
 * GEMINI_MODEL is optional and defaults to a fast, low-cost model.
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const REQUEST_TIMEOUT_MS = 15000;
const MAX_HISTORY_MESSAGES = 20; // keep prompts bounded as conversations grow

const SYSTEM_INSTRUCTION = [
  "You are the SmartCitizen Assistant, a helpful civic-tech guide inside the SmartCitizen AI platform.",
  "You help citizens report civic issues (garbage, water leakage, potholes, street lights, sewage, etc.),",
  "track existing complaints, understand how the platform's AI prioritization works, and reach emergency",
  "services (Ambulance, Police, Fire, Disaster Management). Keep replies short, practical, and friendly —",
  "2 to 4 sentences unless the question genuinely needs more. If someone describes a real emergency in",
  "progress, tell them clearly to use the Emergency section or call the relevant number directly, rather",
  "than only describing the app. If a question is unrelated to civic services or this platform, answer",
  "briefly and steer back to what SmartCitizen AI can help with.",
].join(" ");

/** Converts this app's {role: "user"|"assistant", content} shape into Gemini's {role, parts}. */
function toGeminiContents(history, latestMessage) {
  const trimmedHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_MESSAGES) : [];

  const contents = trimmedHistory
    .filter((entry) => entry && typeof entry.content === "string" && entry.content.trim())
    .map((entry) => ({
      role: entry.role === "assistant" ? "model" : "user",
      parts: [{ text: entry.content.trim() }],
    }));

  contents.push({ role: "user", parts: [{ text: latestMessage }] });
  return contents;
}

/**
 * POST /api/ai/chat
 * Body: { message: string, history?: Array<{ role: "user"|"assistant", content: string }> }
 */
async function sendChatMessage(req, res, next) {
  try {
    const { message, history } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A non-empty 'message' string is required.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[aiController] GEMINI_API_KEY is not set in server/.env.");
      return res.status(500).json({
        success: false,
        message: "The AI assistant isn't configured yet. Please try again later.",
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let geminiResponse;
    try {
      geminiResponse = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: toGeminiContents(history, message.trim()),
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 300,
          },
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error(`[aiController] Gemini API error (${geminiResponse.status}):`, errorBody);

      if (geminiResponse.status === 429) {
        return res.status(429).json({
          success: false,
          message: "The assistant is getting a lot of requests right now. Please try again shortly.",
        });
      }

      return res.status(502).json({
        success: false,
        message: "The AI assistant couldn't respond right now. Please try again.",
      });
    }

    const data = await geminiResponse.json();
    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join(" ")
      .trim();

    if (!reply) {
      const blockReason = data?.promptFeedback?.blockReason;
      console.warn("[aiController] Gemini returned no usable text.", { blockReason });
      return res.status(502).json({
        success: false,
        message: "The assistant couldn't come up with a response to that. Try rephrasing?",
      });
    }

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    if (error.name === "AbortError") {
      return res.status(504).json({
        success: false,
        message: "The assistant took too long to respond. Please try again.",
      });
    }
    return next(error);
  }
}

export { sendChatMessage };