import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Send, Bot, User, Loader2, ArrowRight } from "lucide-react";

export const AIShopAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello! ✨ I am your **ShopZone AI Advisor**. Looking for high-fidelity headphones, pristine skincare elixirs, or premium watch collections? Tell me what styles you are exploring, and I'll tailor a curated match for you in seconds!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: `⚠️ **System Error:** ${data.error || "Failed to contact advisor."}`,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "⚠️ **Network Latency:** Unable to establish secure contact. Ensure dev server hosting is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Convert simple markdown styling to basic safe HTML or styled React output
  const formatMarkdown = (text) => {
    if (!text) return "";
    // Break headers
    let formatted = text;
    // Replace markdown headers with styled spans
    formatted = formatted.replace(
      /### (.*)/g,
      '<span class="block text-sm font-bold text-slate-100 mt-2 mb-1">$1</span>'
    );
    // Bullet points
    formatted = formatted.replace(
      /^- (.*)/gm,
      '<li class="ml-4 list-disc text-zinc-300 text-xs my-1">$1</li>'
    );
    // Bold points
    formatted = formatted.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="text-[#D4FC79] font-semibold">$1</strong>'
    );
    // Italic points
    formatted = formatted.replace(/\*(.*?)\*/g, '<span class="italic text-zinc-400">$1</span>');

    return <div className="space-y-1 text-xs" dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <>
      {/* Floating Sparkle Action Button */}
      <div className="fixed right-6 bottom-6 z-50">
        <button
          id="ai-advisor-fab"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[#D4FC79] text-zinc-950 font-bold px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-wider border border-zinc-200"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-zinc-900" />
          <span>Ask AI Advisor</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      {/* Floating Chat UI Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-advisor-drawer"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed right-6 bottom-22 z-50 w-80 sm:w-96 h-[480px] bg-zinc-950/95 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#D4FC79]/10 text-[#D4FC79]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest">
                    ShopZone AI Advisor
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[9px] text-zinc-400 font-medium">Gemini 3.5 Flash Active</span>
                  </div>
                </div>
              </div>
              <button
                id="ai-close-btn"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 max-w-[85%] ${
                    m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`p-1.5 h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-white ${
                      m.role === "user" ? "bg-[#D4FC79]/20" : "bg-zinc-800"
                    }`}
                  >
                    {m.role === "user" ? (
                      <User className="w-3.5 h-3.5 text-[#D4FC79]" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-[#D4FC79]" />
                    )}
                  </div>
                  <div
                    className={`rounded-xl p-3 leading-relaxed text-zinc-200 text-xs shadow-md border ${
                      m.role === "user"
                        ? "bg-zinc-900 border-zinc-800 text-right"
                        : "bg-zinc-900/60 border-zinc-900"
                    }`}
                  >
                    {formatMarkdown(m.text)}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
                  <div className="p-1.5 h-7 w-7 rounded-full flex items-center justify-center shrink-0 bg-zinc-800">
                    <Bot className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="rounded-xl p-3 bg-zinc-900/60 border border-zinc-900 flex items-center gap-2 text-zinc-400 font-mono text-[10px]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4FC79]" />
                    <span>Conferring with inventory registry...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 border-t border-zinc-900/40 bg-zinc-950 flex gap-2 overflow-x-auto scrollbar-none scroll-smooth">
              <button
                onClick={() => setInput("Tell me about the headphones")}
                className="shrink-0 text-[10px] bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 rounded-full px-2.5 py-1 text-zinc-400 transition-colors"
              >
                🎧 Headphones?
              </button>
              <button
                onClick={() => setInput("Any luxury skincare items?")}
                className="shrink-0 text-[10px] bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 rounded-full px-2.5 py-1 text-zinc-400 transition-colors"
              >
                🧴 Hydrating Oils?
              </button>
              <button
                onClick={() => setInput("What fragrances are available?")}
                className="shrink-0 text-[10px] bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 rounded-full px-2.5 py-1 text-zinc-400 transition-colors"
              >
                🌹 Fragrances?
              </button>
            </div>

            {/* Drawer Input */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-zinc-900 bg-zinc-900/50 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message style consultant..."
                className="flex-1 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg px-3 py-2 focus:outline-none focus:border-[#D4FC79] placeholder-zinc-500"
              />
              <button
                id="ai-send-btn"
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-[#D4FC79] text-zinc-950 p-2 rounded-lg hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
