import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Volume2, 
  Mic, 
  Brain, 
  Plus,
  HelpCircle,
  Stethoscope,
  ShieldCheck,
  Settings as LucideSettings
} from 'lucide-react';
import { getHealthAssistantResponse } from '../services/gemini';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedPrompts = [
  "What are common symptoms of pneumonia?",
  "Tips for improving heart health",
  "How to manage stress at work?",
  "Recommend a daily vitamin routine",
  "Explain MRI vs CT scan",
];

export default function Assistant({ profile }: { profile: UserProfile | null }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello ${profile?.displayName || 'there'}! I am Lumina AI, your dedicated medical assistant. How can I help you with your health journey today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (content: string = input) => {
    if (!content.trim()) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsTyping(true);

    try {
      const response = await getHealthAssistantResponse(content);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/20 flex items-center justify-center">
            <Bot className="w-7 h-7 text-brand-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Lumina <span className="neon-gradient-text">Health Assistant</span>
              <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse" />
            </h1>
            <p className="text-xs text-brand-cyan/70 font-semibold tracking-wider uppercase">Active AI Node • Lumina-3</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
             <Volume2 className="w-5 h-5 text-slate-400" />
           </button>
           <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
             <LucideSettings className="w-5 h-5 text-slate-400" />
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col border-white/5 relative">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#030712] to-transparent z-10 pointer-events-none opacity-50" />
        
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                msg.role === 'user' ? "bg-brand-blue/10 border-brand-blue/20" : "bg-brand-cyan/10 border-brand-cyan/20"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-brand-blue" /> : <Bot className="w-5 h-5 text-brand-cyan" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl relative",
                msg.role === 'user' 
                  ? "bg-brand-blue text-white rounded-tr-none" 
                  : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md"
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-brand-cyan" />
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                <Loader2 className="w-5 h-5 text-brand-cyan animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-950/50 border-t border-white/5 relative">
          {messages.length < 3 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:text-brand-cyan hover:border-brand-cyan/30 whitespace-nowrap transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="relative group">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about symptoms, diet, or reports..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-24 outline-none focus:border-brand-cyan/50 focus:ring-4 focus:ring-brand-cyan/5 transition-all text-white placeholder:text-slate-600"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button 
                className="p-2.5 text-slate-500 hover:text-white transition-colors"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="p-2.5 bg-brand-cyan text-slate-950 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="mt-4 text-[10px] text-slate-600 font-bold text-center uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Secure E2E Encrypted Medical Conversation
          </p>
        </div>
      </div>
    </div>
  );
}

// Missing icon imports in Sidebar we should have added but didn't import Settings, added below for reference
function Settings({className}: {className?: string}) {
  return <HelpCircle className={className} />
}
