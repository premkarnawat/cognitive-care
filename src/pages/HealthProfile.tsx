import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { apiPost } from '@/lib/api';

const HealthProfile = () => {
  const [form, setForm] = useState({ height: '', weight: '', bloodGroup: '', bp: '', pulse: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await apiPost('/user/health-profile', form); } catch {}
    setLoading(false);
    navigate('/dashboard');
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="pointer-events-none absolute inset-0 ambient-glow-bottom" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="glass-card w-full max-w-md p-8 md:p-10"
      >
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
              boxShadow: '0 8px 32px -8px hsl(var(--primary) / 0.4)',
            }}
          >
            <Heart className="h-7 w-7 text-primary-foreground" />
          </motion.div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Step 2 of 2</p>
          <h1 className="font-display text-3xl font-bold">Health Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">Help us understand your health baseline</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Height (cm)"><input required type="number" className="input-glass w-full" value={form.height} onChange={e => update('height', e.target.value)} placeholder="170" /></Field>
            <Field label="Weight (kg)"><input required type="number" className="input-glass w-full" value={form.weight} onChange={e => update('weight', e.target.value)} placeholder="65" /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Blood Group">
              <select required className="input-glass w-full" value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)}>
                <option value="">-</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="BP"><input className="input-glass w-full" value={form.bp} onChange={e => update('bp', e.target.value)} placeholder="120/80" /></Field>
            <Field label="Pulse"><input type="number" className="input-glass w-full" value={form.pulse} onChange={e => update('pulse', e.target.value)} placeholder="72" /></Field>
          </div>
          <Field label="Health Notes (optional)">
            <textarea className="input-glass w-full min-h-[80px] resize-none" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any conditions, allergies, or notes..." />
          </Field>
          <button type="submit" disabled={loading} className="pill-button-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>Complete Setup <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default HealthProfile;
