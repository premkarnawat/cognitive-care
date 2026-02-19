import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Sun, CheckCircle, Droplets, StretchHorizontal, Wind, Target, Sparkles, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const routineSteps = [
  { id: 'wake', icon: Sun, label: 'Wake Up Early', desc: 'Start your day at the right time' },
  { id: 'water', icon: Droplets, label: 'Drink Water', desc: 'Hydrate your body first thing' },
  { id: 'stretch', icon: StretchHorizontal, label: 'Stretch', desc: '5-minute body stretch' },
  { id: 'breathe', icon: Wind, label: 'Breathing Exercise', desc: '2-minute deep breathing' },
  { id: 'goal', icon: Target, label: 'Set Daily Goal', desc: 'What will you achieve today?' },
];

const MorningRoutine = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [affirmation, setAffirmation] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleStep = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const saveRoutine = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from('user_wellness_progress').insert({
        user_id: user.id,
        program_id: null,
        completed: true,
        completed_at: new Date().toISOString(),
        notes: JSON.stringify({
          type: 'morning_routine',
          steps_completed: Array.from(completed),
          affirmation,
          daily_goal: dailyGoal,
        }),
      });
      toast({ title: '🌅 Morning Routine Complete!', description: 'Great way to start your day!' });
      navigate('/wellness');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  const progress = (completed.size / routineSteps.length) * 100;

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate('/wellness')} className="flex h-9 w-9 items-center justify-center rounded-xl glass-card">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold flex items-center gap-2">
              <Sun className="h-6 w-6 text-primary" /> Morning Routine
            </h1>
            <p className="text-xs text-muted-foreground ml-8">Start your day with energy</p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="glass-card p-4 mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{completed.size}/{routineSteps.length}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2 mb-4">
          {routineSteps.map(({ id, icon: Icon, label, desc }, i) => (
            <motion.button
              key={id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => toggleStep(id)}
              className={`glass-card flex w-full items-center gap-4 p-4 text-left transition-all ${
                completed.has(id) ? 'border-primary/40 bg-primary/5' : ''
              }`}
            >
              <CheckCircle className={`h-6 w-6 flex-shrink-0 transition-colors ${
                completed.has(id) ? 'text-primary' : 'text-muted-foreground/30'
              }`} />
              <div className="flex-1">
                <p className={`font-semibold text-sm ${completed.has(id) ? 'line-through text-muted-foreground' : ''}`}>{label}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
              <Icon className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          ))}
        </div>

        {/* Affirmation & Goal */}
        <div className="glass-card p-5 space-y-4 mb-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Daily Affirmation
            </label>
            <input value={affirmation} onChange={e => setAffirmation(e.target.value)} className="input-glass w-full" placeholder="I am capable and strong..." />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-primary" /> Today's Main Goal
            </label>
            <input value={dailyGoal} onChange={e => setDailyGoal(e.target.value)} className="input-glass w-full" placeholder="Complete project presentation..." />
          </div>
        </div>

        <button onClick={saveRoutine} disabled={saving} className="pill-button-primary w-full flex items-center justify-center gap-2">
          {saving ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <><Save className="h-4 w-4" /> Complete Routine</>}
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default MorningRoutine;
