import { useState } from 'react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { apiPost } from '@/lib/api';
import { Slider } from '@/components/ui/slider';
import { ClipboardCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';

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
    if (level?.toLowerCase().includes('low')) return 'text-green-400';
    if (level?.toLowerCase().includes('moderate') || level?.toLowerCase().includes('medium')) return 'text-yellow-400';
    return 'text-red-400';
  };

  const RiskIcon = (level: string) => {
    if (level?.toLowerCase().includes('low')) return CheckCircle;
    if (level?.toLowerCase().includes('high')) return AlertTriangle;
    return Info;
  };

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><ClipboardCheck className="h-6 w-6 text-primary" /> Daily Check-in</h1>
          <p className="text-muted-foreground text-sm mt-1">How are you feeling today?</p>
        </motion.div>

        {!result ? (
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium mb-3"><span>Fatigue Level</span><span className="text-primary">{fatigue}/10</span></label>
              <Slider value={[fatigue]} onValueChange={v => setFatigue(v[0])} min={1} max={10} step={1} />
            </div>
            <div>
              <label className="flex justify-between text-sm font-medium mb-3"><span>Stress Level</span><span className="text-primary">{stress}/10</span></label>
              <Slider value={[stress]} onValueChange={v => setStress(v[0])} min={1} max={10} step={1} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="mb-1 block text-sm text-muted-foreground">Sleep Hours</label><input type="number" step="0.5" required className="input-glass w-full" value={sleepHours} onChange={e => setSleepHours(e.target.value)} placeholder="7" /></div>
              <div><label className="mb-1 block text-sm text-muted-foreground">Work Hours</label><input type="number" step="0.5" required className="input-glass w-full" value={workHours} onChange={e => setWorkHours(e.target.value)} placeholder="8" /></div>
              <div><label className="mb-1 block text-sm text-muted-foreground">Study Hours</label><input type="number" step="0.5" required className="input-glass w-full" value={studyHours} onChange={e => setStudyHours(e.target.value)} placeholder="3" /></div>
              <div><label className="mb-1 block text-sm text-muted-foreground">Screen Time</label><input type="number" step="0.5" required className="input-glass w-full" value={screenTime} onChange={e => setScreenTime(e.target.value)} placeholder="6" /></div>
            </div>
            <div><label className="mb-1 block text-sm text-muted-foreground">Social Media Hours</label><input type="number" step="0.5" required className="input-glass w-full" value={socialMedia} onChange={e => setSocialMedia(e.target.value)} placeholder="2" /></div>
            <button type="submit" disabled={loading} className="pill-button-primary w-full">
              {loading ? 'Analyzing...' : 'Submit Check-in'}
            </button>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 space-y-4">
            <div className="text-center">
              {(() => { const Icon = RiskIcon(result.risk_level); return <Icon className={`h-12 w-12 mx-auto ${riskColor(result.risk_level)}`} />; })()}
              <h2 className="font-display text-2xl font-bold mt-3">{Math.round(result.probability * 100)}%</h2>
              <p className="text-sm text-muted-foreground">Burnout Probability</p>
              <span className={`inline-block mt-2 rounded-full px-4 py-1 text-sm font-semibold glass-card ${riskColor(result.risk_level)}`}>
                {result.risk_level}
              </span>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <h3 className="text-sm font-semibold mb-2 text-primary">AI Explanation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
            </div>
            <button onClick={() => setResult(null)} className="pill-button-outline w-full">New Check-in</button>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default DailyCheckin;
