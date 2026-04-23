import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type UserProfile } from "@/data/mockData";
import { generateChatResponse } from "@/lib/ai";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", content: "Hi! I'm your SmartPlate AI assistant 🌿\n\nI can help you with diet advice, food alternatives, and nutritional guidance. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem("userProfile");
    if (storedProfile) setProfile(JSON.parse(storedProfile));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim() || typing) return;
    const userContent = input.trim();
    const userMsg: Message = { id: Date.now(), role: "user", content: userContent };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const chatHistory = messages
      .filter(m => m.id !== 0) // exclude welcome message from AI history if needed, but usually fine to include
      .map(m => ({ role: m.role, content: m.content }));
    
    chatHistory.push({ role: "user", content: userContent });

    const response = await generateChatResponse(chatHistory, profile);
    
    setMessages((prev) => [...prev, { 
      id: Date.now() + 1, 
      role: "assistant", 
      content: response 
    }]);
    setTyping(false);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl gradient-mint flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-sm">AI Assistant</h2>
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant" ? "gradient-mint" : "bg-secondary"
              }`}>
                {msg.role === "assistant" ? (
                  <Bot className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === "assistant"
                  ? "soft-card"
                  : "bg-primary text-primary-foreground"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl gradient-mint flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="soft-card px-4 py-3 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border bg-card">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your diet..."
            className="bg-secondary/50 border-border rounded-xl h-11"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="gradient-mint text-primary-foreground rounded-xl h-11 w-11 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-[10px] text-muted-foreground mt-2 text-center font-medium">
          SmartPlate AI provides general nutritional guidance. Consult a healthcare professional for medical advice.
        </p>
      </div>
    </div>
  );
}
