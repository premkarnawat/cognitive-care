import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Play, Pause, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Step {
  id: string;
  step_text: string;
  step_order: number;
}

const WellnessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [program, setProgram] = useState<any>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchProgram = async () => {
      const { data: prog } = await supabase.from('wellness_programs').select('*').eq('id', id).single();
      setProgram(prog);
      if (prog?.duration_minutes) setTimeLeft(prog.duration_minutes * 60);

      const { data: s } = await supabase.from('wellness_steps').select('*').eq('program_id', id).order('step_order');
      setSteps(s || []);
      setLoading(false);
    };
    if (id) fetchProgram();
  }, [id]);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else {
      clearInterval(timerRef.current);
      if (timeLeft === 0 && timerRunning) {
        setTimerRunning(false);
        markCompleted();
      }
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timeLeft]);

  const markCompleted = async () => {
    if (!user || !id) return;
    await supabase.from('user_wellness_progress').insert({
      user_id: user.id,
      program_id: id,
      completed: true,
      completed_at: new Date().toISOString(),
    });
    toast({ title: '🎉 Program Completed!', description: 'Great job on finishing this wellness activity.' });
  };

  const toggleStep = (stepId: string) => {
    setCheckedSteps(prev => {
      const next = new Set(prev);
      next.has(stepId) ? next.delete(stepId) : next.add(stepId);
      return next;
    });
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Program not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate('/wellness')} className="flex h-9 w-9 items-center justify-center rounded-xl glass-card">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold">{program.title}</h1>
            <p className="text-xs text-muted-foreground">{program.category} • {program.duration_minutes || '—'} min</p>
          </div>
        </motion.div>

        {/* Video */}
        {program.video_url && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden rounded-2xl mb-4">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={program.video_url}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}

        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{program.description}</p>
        </motion.div>

        {/* Timer */}
        {program.duration_minutes && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5 mb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timer</span>
            </div>
            <p className="font-display text-4xl font-bold text-primary mb-4">{formatTime(timeLeft)}</p>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="pill-button-primary px-8 py-2.5 text-sm flex items-center justify-center gap-2 mx-auto"
            >
              {timerRunning ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> {timeLeft === program.duration_minutes * 60 ? 'Start' : 'Resume'}</>}
            </button>
          </motion.div>
        )}

        {/* Steps */}
        {steps.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Steps</h3>
            <div className="space-y-2">
              {steps.map(step => (
                <button
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
                    checkedSteps.has(step.id) ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/30'
                  }`}
                >
                  <CheckCircle className={`h-5 w-5 flex-shrink-0 transition-colors ${
                    checkedSteps.has(step.id) ? 'text-primary' : 'text-muted-foreground/30'
                  }`} />
                  <span className={`text-sm ${checkedSteps.has(step.id) ? 'line-through text-muted-foreground' : ''}`}>
                    {step.step_text}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Manual complete */}
        {!program.duration_minutes && (
          <button onClick={markCompleted} className="pill-button-primary w-full mt-4 flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" /> Mark as Completed
          </button>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default WellnessDetail;
