import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { apiPost } from '@/lib/api';
import { Send, FileText, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your MindGuard AI assistant. How can I help you today? 😊" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (content: string, endpoint = '/chat') => {
    if (!content.trim() && endpoint === '/chat') return;
    const userMsg: Message = { role: 'user', content: content || 'Analyze my reports' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await apiPost(endpoint, { message: content, messages: [...messages, userMsg] });
      setMessages(prev => [...prev, { role: 'assistant', content: res.response || res.message || JSON.stringify(res) }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I couldn't process that. ${err.message}` }]);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  return (
    <div className="relative flex min-h-screen flex-col bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 border-b border-border/30 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display font-bold">MindGuard AI</h1>
          <p className="text-xs text-muted-foreground">Your wellness companion</p>
        </div>
        <button onClick={() => sendMessage('', '/chat_with_report')} className="ml-auto glass-card px-3 py-1.5 text-xs font-medium text-primary flex items-center gap-1 hover:bg-primary/10 transition-colors">
          <FileText className="h-3 w-3" /> Analyze Reports
        </button>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 mt-1 h-7 w-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'glass-card rounded-bl-md'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm prose-invert max-w-none"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
              ) : msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="flex-shrink-0 mt-1 h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-2 items-center text-muted-foreground">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 z-20 px-4 pb-2">
        <form onSubmit={handleSubmit} className="glass-card flex items-center gap-2 p-2 rounded-full">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground" />
          <button type="submit" disabled={loading || !input.trim()} className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground disabled:opacity-50 transition-all hover:scale-105">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export default Chatbot;
