import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { ClipboardCheck, BarChart3, MessageCircle, Sparkles, BookOpen, Video } from 'lucide-react';

const BurnoutMeter = ({ value = 35 }: { value?: number }) => {
  const getColor = (v: number) => v < 40 ? '#4ade80' : v < 70 ? '#facc15' : '#f87171';
  const label = value < 40 ? 'Low Risk' : value < 70 ? 'Moderate' : 'High Risk';
  const angle = -90 + (value / 100) * 180;

  return (
    <div className="flex flex-col items-center py-2">
      <svg viewBox="0 0 200 120" className="w-52">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGrad)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 251.2} 251.2`} filter="url(#glow)" />
        <line x1="100" y1="100" x2="100" y2="28" stroke={getColor(value)} strokeWidth="3" strokeLinecap="round"
          transform={`rotate(${angle}, 100, 100)`} />
        <circle cx="100" cy="100" r="8" fill={getColor(value)} filter="url(#glow)" />
        <circle cx="100" cy="100" r="4" fill="hsl(var(--background))" />
      </svg>
      <span className="mt-2 text-lg font-bold font-display" style={{ color: getColor(value) }}>{label}</span>
      <span className="text-xs text-muted-foreground">{value}% burnout risk</span>
    </div>
  );
};

const cards = [
  { icon: ClipboardCheck, title: 'Daily Check-in', desc: 'Log how you feel today', path: '/checkin', gradient: 'from-primary to-accent' },
  { icon: BarChart3, title: 'Reports & Analytics', desc: 'Trends & insights', path: '/reports', gradient: 'from-blue-500 to-cyan-500' },
  { icon: MessageCircle, title: 'Chat with AI', desc: 'Talk to your assistant', path: '/chat', gradient: 'from-emerald-500 to-teal-500' },
  { icon: Sparkles, title: 'Wellness', desc: 'Activities & exercises', path: '/wellness', gradient: 'from-amber-500 to-yellow-500' },
  { icon: BookOpen, title: 'Blog', desc: 'Read latest articles', path: '/blog', gradient: 'from-purple-500 to-pink-500' },
  { icon: Video, title: 'Tips & Videos', desc: 'Motivation & relaxation', path: '/tips', gradient: 'from-red-500 to-orange-500' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.user_metadata?.full_name || 'User';

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Welcome back,</p>
          <h1 className="font-display text-3xl font-bold">Hey, {name.split(' ')[0]} 👋</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6 shimmer"
        >
          <h2 className="text-center font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Burnout Meter</h2>
          <BurnoutMeter value={35} />
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {cards.map(({ icon: Icon, title, desc, path, gradient }, i) => (
            <motion.button
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(path)}
              className="glass-card p-4 text-left transition-all duration-300"
            >
              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-display font-semibold text-sm">{title}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
