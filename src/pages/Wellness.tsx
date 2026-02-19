import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { Sparkles, Brain, Dumbbell, Wind, Music, Heart, Sun, Zap } from 'lucide-react';

const iconMap: Record<string, any> = { Brain, Dumbbell, Wind, Music, Heart, Sun, Sparkles, Zap };

const staticCards = [
  { title: 'Gratitude Journal', desc: 'Write 3 things you are grateful for today', category: 'Mindfulness', gradient: 'from-red-500 to-orange-500', icon: Heart, path: '/gratitude' },
  { title: 'Morning Routine', desc: 'Start your day with energy and positivity', category: 'Lifestyle', gradient: 'from-amber-500 to-yellow-500', icon: Sun, path: '/morning-routine' },
  { title: 'Stress Relief', desc: 'Tips, videos & relaxation content', category: 'Relief', gradient: 'from-cyan-500 to-blue-500', icon: Wind, path: '/stress-relief' },
];

interface WellnessProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  icon_name?: string;
  gradient?: string;
  duration_minutes?: number;
}

const Wellness = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<WellnessProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('wellness_programs').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setPrograms(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            Wellness Programs
          </h1>
          <p className="text-muted-foreground text-sm mt-2 ml-11">Activities to improve your well-being</p>
        </motion.div>

        {/* Static special cards */}
        <div className="space-y-3 mb-6">
          {staticCards.map(({ title, desc, category, gradient, icon: Icon, path }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, x: 4 }}
              onClick={() => navigate(path)}
              className="glass-card flex items-start gap-4 p-4 cursor-pointer transition-all duration-300"
            >
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold">{title}</h3>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{category}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic programs from DB */}
        {loading ? (
          <div className="flex justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : programs.length > 0 ? (
          <>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Programs</h2>
            <div className="space-y-3">
              {programs.map((prog, i) => {
                const Icon = iconMap[prog.icon_name || 'Brain'] || Brain;
                return (
                  <motion.div
                    key={prog.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (staticCards.length + i) * 0.08 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    onClick={() => navigate(`/wellness/${prog.id}`)}
                    className="glass-card flex items-start gap-4 p-4 cursor-pointer transition-all duration-300"
                  >
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${prog.gradient || 'from-purple-500 to-indigo-500'} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold">{prog.title}</h3>
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{prog.category}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{prog.description}</p>
                      {prog.duration_minutes && (
                        <p className="text-[10px] text-primary mt-1">{prog.duration_minutes} min</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
      <BottomNav />
    </div>
  );
};

export default Wellness;
