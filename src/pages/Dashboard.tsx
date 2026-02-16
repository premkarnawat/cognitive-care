import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { ClipboardCheck, TrendingUp, BarChart3, Calendar, MessageCircle, Sparkles } from 'lucide-react';

const BurnoutMeter = ({ value = 35 }: { value?: number }) => {
  const angle = -90 + (value / 100) * 180;
  const getColor = (v: number) => v < 40 ? 'hsl(120, 60%, 50%)' : v < 70 ? 'hsl(45, 90%, 55%)' : 'hsl(0, 80%, 55%)';
  const label = value < 40 ? 'Low Risk' : value < 70 ? 'Moderate' : 'High Risk';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-48">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(120, 60%, 50%)" />
            <stop offset="50%" stopColor="hsl(45, 90%, 55%)" />
            <stop offset="100%" stopColor="hsl(0, 80%, 55%)" />
          </linearGradient>
        </defs>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 251.2} 251.2`} />
        <line x1="100" y1="100" x2="100" y2="30" stroke={getColor(value)} strokeWidth="3" strokeLinecap="round"
          transform={`rotate(${angle}, 100, 100)`} />
        <circle cx="100" cy="100" r="6" fill={getColor(value)} />
      </svg>
      <span className="mt-1 text-lg font-bold" style={{ color: getColor(value) }}>{label}</span>
      <span className="text-sm text-muted-foreground">{value}% burnout risk</span>
    </div>
  );
};

const cards = [
  { icon: ClipboardCheck, title: 'Daily Check-in', desc: 'Log how you feel today', path: '/checkin', color: 'from-primary to-accent' },
  { icon: TrendingUp, title: 'Burnout Risk', desc: 'View your risk score', path: '/reports', color: 'from-red-500 to-orange-500' },
  { icon: BarChart3, title: 'Weekly Report', desc: 'Trends & insights', path: '/reports', color: 'from-blue-500 to-cyan-500' },
  { icon: Calendar, title: 'Monthly Report', desc: 'Long-term patterns', path: '/reports', color: 'from-purple-500 to-pink-500' },
  { icon: MessageCircle, title: 'Chat with AI', desc: 'Talk to your assistant', path: '/chat', color: 'from-emerald-500 to-teal-500' },
  { icon: Sparkles, title: 'Wellness Programs', desc: 'Activities & exercises', path: '/wellness', color: 'from-amber-500 to-yellow-500' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.user_metadata?.full_name || 'User';

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-muted-foreground text-sm">Welcome back,</p>
          <h1 className="font-display text-3xl font-bold">Hey, {name.split(' ')[0]} 👋</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-6">
          <h2 className="text-center font-display text-lg font-semibold mb-2">Burnout Meter</h2>
          <BurnoutMeter value={35} />
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {cards.map(({ icon: Icon, title, desc, path, color }, i) => (
            <motion.button
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              onClick={() => navigate(path)}
              className="glass-card-hover p-4 text-left"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Dashboard;
