import { memo, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const SUGGESTED_PROMPTS = [
  "How do I report a pothole?",
  "Check the status of my complaint",
  "What emergency numbers are available?",
  "How does AI prioritize complaints?",
];

const INITIAL_MESSAGE = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Hi, I'm the SmartCitizen Assistant. Ask me about reporting an issue, tracking a complaint, or getting emergency help.",
};

// Set VITE_API_URL in the frontend's .env for other environments,
// e.g. VITE_API_URL=https://api.smartcitizen.ai/api
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Sends the user's message plus prior conversation to the Gemini-backed
 * chat endpoint. `history` is this component's own message list mapped to
 * { role, content } pairs, matching what aiController.js expects.
 */
async function getAssistantReply(userMessage, history) {
  const response = await axios.post(
    `${API_BASE_URL}/ai/chat`,
    { message: userMessage, history },
    { timeout: 20000 }
  );
  return response.data.reply;
}

function AssistantAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-[0_6px_16px_rgba(37,99,235,0.3)]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3.5l1.7 3.8 3.8 1.7-3.8 1.7L12 14.5l-1.7-3.8-3.8-1.7 3.8-1.7L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={["flex items-end gap-2.5", isUser ? "justify-end" : "justify-start"].join(" ")}>
      {!isUser && <AssistantAvatar />}
      <div
        className={[
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6 sm:text-[15px] sm:leading-7",
          isUser
            ? "rounded-br-md bg-sky-600 text-white shadow-[0_10px_25px_rgba(2,132,199,0.22)]"
            : "rounded-bl-md border border-slate-200/80 bg-white/90 text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.05)]",
        ].join(" ")}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5" aria-hidden="true">
      <AssistantAvatar />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-200/80 bg-white/90 px-4 py-3.5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 motion-reduce:animate-none"
            style={{ animationDelay: `${dot * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function AIAssistant() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const messageIdRef = useRef(1);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = useCallback(
    async (rawText) => {
      const text = rawText.trim();
      if (!text || isLoading) return;

      const userMessage = {
        id: `user-${messageIdRef.current++}`,
        role: "user",
        content: text,
      };

      // Snapshot the conversation so far (before this message) to send as context.
      const conversationHistory = messages.map(({ role, content }) => ({ role, content }));

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setIsLoading(true);

      try {
        const reply = await getAssistantReply(text, conversationHistory);
        setMessages((prev) => [
          ...prev,
          { id: `assistant-${messageIdRef.current++}`, role: "assistant", content: reply },
        ]);
      } catch (error) {
        const friendlyMessage =
          error.response?.data?.message ||
          (error.code === "ECONNABORTED"
            ? "That's taking longer than expected. Please try again."
            : "Something went wrong reaching the assistant. Please try again.");

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${messageIdRef.current++}`,
            role: "assistant",
            content: friendlyMessage,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const hasConversationStarted = messages.length > 1;

  return (
    <section
      id="ai-assistant"
      aria-labelledby="ai-assistant-heading"
      className="relative w-full max-w-[100vw] overflow-x-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-linear(circle_at_bottom,rgba(37,99,235,0.06),transparent_35%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.22em]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
            AI Smart Assistant
          </div>

          <h2
            id="ai-assistant-heading"
            className="mt-6 wrap-break-word text-3xl font-black leading-tight tracking-[-0.02em] text-slate-900 sm:text-4xl md:text-5xl"
          >
            Ask, and get a{" "}
            <span className="bg-linear-to-r from-cyan-600 via-sky-500 to-blue-700 bg-clip-text text-transparent">
              straight answer
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            No menus to dig through — ask the assistant how to report an
            issue, check a status, or reach emergency services.
          </p>
        </div>

        {/* Chat card */}
        <div className="mt-10 flex h-128 flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_25px_70px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:mt-14 sm:h-144">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <AssistantAvatar />
              <div>
                <p className="text-sm font-semibold text-slate-900 sm:text-base">
                  SmartCitizen Assistant
                </p>
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Online
                </p>
              </div>
            </div>
            <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 sm:inline-flex">
              Beta
            </span>
          </div>

          {/* Messages */}
          <div
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
            role="log"
            aria-live="polite"
            aria-label="Conversation with SmartCitizen Assistant"
          >
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts — hidden once the conversation is underway */}
          {!hasConversationStarted && (
            <div className="flex gap-2 overflow-x-auto border-t border-slate-200/70 px-4 py-3 sm:px-6">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors duration-200 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t border-slate-200/70 p-3 sm:gap-3 sm:p-4"
          >
            <label htmlFor="ai-assistant-input" className="sr-only">
              Message the SmartCitizen Assistant
            </label>
            <textarea
              id="ai-assistant-input"
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your question..."
              disabled={isLoading}
              className="max-h-30 flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-60 sm:text-[15px]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white shadow-[0_10px_25px_rgba(2,132,199,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 sm:h-11 sm:w-11"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 12l16-7-6.5 16-2.8-7.2L4 12Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default memo(AIAssistant);