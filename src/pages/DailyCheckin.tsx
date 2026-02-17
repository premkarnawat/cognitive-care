import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { apiPost } from '@/lib/api';
import { Slider } from '@/components/ui/slider';
import { ClipboardCheck, AlertTriangle, CheckCircle, Info, RotateCcw } from 'lucide-react';

interface PredictionResult {
  probability: number;
  risk_level: string;
  explanation: string;
}

const DailyCheckin = () => {
  const [fatigue, setFatigue] = useState(5);
  const [stress, setStress] = useState(5);
  const [sleepHours, setSleepHours] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [studyHours, setStudyHours] = useState('');
  const [screenTime, setScreenTime] = useState('');
  const [socialMedia, setSocialMedia] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiPost('/predict', {
        fatigue, stress, sleep_hours: Number(sleepHours), work_hours: Number(workHours),
        study_hours: Number(studyHours), screen_time: Number(screenTime), social_media_hours: Number(socialMedia),
      });
      setResult(res);
    } catch (err: any) {
      setResult({ probability: 0, risk_level: 'Error', explanation: err.message || 'Failed to get prediction' });
    }
    setLoading(false);
  };

  const riskColor = (level: string) => {
    if (level?.toLowerCase().includes('low')) return '#4ade80';
    if (level?.toLowerCase().includes('moderate') || level?.toLowerCase().includes('medium')) return '#facc15';
    return '#f87171';
  };

  const RiskIcon = (level: string) => {
    if (level?.toLowerCase().includes('low')) return CheckCircle;
    if (level?.toLowerCase().includes('high')) return AlertTriangle;
    return Info;
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
              <ClipboardCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            Daily Check-in
          </h1>
          <p className="text-muted-foreground text-sm mt-2 ml-11">How are you feeling today?</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="glass-card p-6 space-y-6"
            >
              <div>
                <label className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  <span>Fatigue Level</span>
                  <span className="text-primary font-bold text-sm normal-case">{fatigue}/10</span>
                </label>
                <Slider value={[fatigue]} onValueChange={v => setFatigue(v[0])} min={1} max={10} step={1} />
              </div>
              <div>
                <label className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  <span>Stress Level</span>
                  <span className="text-primary font-bold text-sm normal-case">{stress}/10</span>
                </label>
                <Slider value={[stress]} onValueChange={v => setStress(v[0])} min={1} max={10} step={1} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Sleep Hours"><input type="number" step="0.5" required className="input-glass w-full" value={sleepHours} onChange={e => setSleepHours(e.target.value)} placeholder="7" /></Field>
                <Field label="Work Hours"><input type="number" step="0.5" required className="input-glass w-full" value={workHours} onChange={e => setWorkHours(e.target.value)} placeholder="8" /></Field>
                <Field label="Study Hours"><input type="number" step="0.5" required className="input-glass w-full" value={studyHours} onChange={e => setStudyHours(e.target.value)} placeholder="3" /></Field>
                <Field label="Screen Time"><input type="number" step="0.5" required className="input-glass w-full" value={screenTime} onChange={e => setScreenTime(e.target.value)} placeholder="6" /></Field>
              </div>
              <Field label="Social Media Hours">
                <input type="number" step="0.5" required className="input-glass w-full" value={socialMedia} onChange={e => setSocialMedia(e.target.value)} placeholder="2" />
              </Field>
              <button type="submit" disabled={loading} className="pill-button-primary w-full flex items-center justify-center gap-2">
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : 'Submit Check-in'}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card p-6 space-y-5"
            >
              <div className="text-center">
                {(() => { const Icon = RiskIcon(result.risk_level); return <Icon className="h-14 w-14 mx-auto" style={{ color: riskColor(result.risk_level) }} />; })()}
                <h2 className="font-display text-4xl font-bold mt-4" style={{ color: riskColor(result.risk_level) }}>
                  {Math.round(result.probability * 100)}%
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Burnout Probability</p>
                <span className="inline-block mt-3 rounded-full px-5 py-1.5 text-sm font-semibold glass-card" style={{ color: riskColor(result.risk_level), borderColor: riskColor(result.risk_level) + '40' }}>
                  {result.risk_level}
                </span>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">AI Explanation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
              </div>
              <button onClick={() => setResult(null)} className="pill-button-outline w-full flex items-center justify-center gap-2">
                <RotateCcw className="h-4 w-4" /> New Check-in
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
};

export default DailyCheckin;
