import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { Sparkles, Brain, Dumbbell, Wind, Music, Heart, Sun } from 'lucide-react';

const programs = [
  { icon: Brain, title: 'Guided Meditation', desc: '10-minute mindfulness session to clear your thoughts', category: 'Meditation', color: 'from-purple-500 to-indigo-500' },
  { icon: Wind, title: 'Breathing Exercises', desc: 'Box breathing & 4-7-8 techniques for instant calm', category: 'Breathing', color: 'from-cyan-500 to-blue-500' },
  { icon: Dumbbell, title: 'Desk Stretches', desc: '5-minute stretching routine to release tension', category: 'Exercise', color: 'from-emerald-500 to-green-500' },
  { icon: Music, title: 'Focus Sounds', desc: 'Ambient sounds for deep work and concentration', category: 'Audio', color: 'from-pink-500 to-rose-500' },
  { icon: Heart, title: 'Gratitude Journal', desc: 'Write 3 things you are grateful for today', category: 'Mindfulness', color: 'from-red-500 to-orange-500' },
  { icon: Sun, title: 'Morning Routine', desc: 'Start your day with energy and positivity', category: 'Lifestyle', color: 'from-amber-500 to-yellow-500' },
];

const Wellness = () => (
  <div className="relative min-h-screen bg-background pb-24">
    <div className="pointer-events-none absolute inset-0 ambient-glow" />
    <div className="relative z-10 px-5 pt-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-primary" /> Wellness Programs</h1>
        <p className="text-muted-foreground text-sm mt-1">Activities to improve your well-being</p>
      </motion.div>

      <div className="space-y-3">
        {programs.map(({ icon: Icon, title, desc, category, color }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover flex items-start gap-4 p-4"
          >
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{title}</h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{category}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <BottomNav />
  </div>
);

export default Wellness;
