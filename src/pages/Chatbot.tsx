import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    { role: 'assistant', content: "Hi! I'm your **MindGuard AI** assistant. 😊\n\nI can help you with:\n- Understanding your stress patterns\n- Wellness tips & techniques\n- Analyzing your check-in reports\n\nHow can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    endRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages]);

  // ✅ CLEAN SEND FUNCTION
  const sendMessage = async (content: string, endpoint = '/chat') => {
    if (!content.trim() && endpoint === '/chat') return;

    const userMsg: Message = { role: 'user', content: content || 'Analyze my reports' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiPost(endpoint, {
        message: content
      });

      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant',
          content: res.reply || res.response || res.message || "No response"
        }
      ]);

    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Sorry, I couldn't process that." }
      ]);
    }

    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    sendMessage(input); 
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 border-b border-border/20 px-5 py-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))', boxShadow: '0 4px 16px -4px hsl(var(--primary) / 0.4)' }}>
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display font-bold text-base">MindGuard AI</h1>
          <p className="text-[11px] text-muted-foreground">Your wellness companion</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendMessage('', '/chat_with_report')}
          className="ml-auto glass-card px-4 py-2 text-xs font-semibold text-primary flex items-center gap-1.5 hover:border-primary/40 transition-all"
        >
          <FileText className="h-3.5 w-3.5" /> Analyze Reports
        </motion.button>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 mt-1 h-8 w-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-br-md text-primary-foreground'
                  : 'glass-card rounded-bl-md'
              }`}
                style={msg.role === 'user'
                  ? { background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }
                  : {}}
              >
                {msg.role === 'assistant'
                  ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                  : msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 mt-1 h-8 w-8 rounded-xl bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div className="flex gap-2.5 items-start">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="glass-card rounded-2xl rounded-bl-md px-5 py-4 flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 z-20 px-4 pb-2">
        <form onSubmit={handleSubmit} className="glass-card flex items-center gap-2 p-2 rounded-full">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground disabled:opacity-40 transition-all"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export default Chatbot;
