import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
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

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
            <Heart className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold">Health Profile</h1>
          <p className="mt-2 text-muted-foreground">Help us understand your health baseline</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-sm font-medium text-muted-foreground">Height (cm)</label><input required type="number" className="input-glass w-full" value={form.height} onChange={e => update('height', e.target.value)} /></div>
            <div><label className="mb-1 block text-sm font-medium text-muted-foreground">Weight (kg)</label><input required type="number" className="input-glass w-full" value={form.weight} onChange={e => update('weight', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="mb-1 block text-sm font-medium text-muted-foreground">Blood Group</label>
              <select required className="input-glass w-full" value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)}>
                <option value="">-</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div><label className="mb-1 block text-sm font-medium text-muted-foreground">BP</label><input className="input-glass w-full" value={form.bp} onChange={e => update('bp', e.target.value)} placeholder="120/80" /></div>
            <div><label className="mb-1 block text-sm font-medium text-muted-foreground">Pulse</label><input type="number" className="input-glass w-full" value={form.pulse} onChange={e => update('pulse', e.target.value)} placeholder="72" /></div>
          </div>
          <div><label className="mb-1 block text-sm font-medium text-muted-foreground">Health Notes (optional)</label><textarea className="input-glass w-full min-h-[80px] resize-none" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any conditions, allergies, or notes..." /></div>
          <button type="submit" disabled={loading} className="pill-button-primary w-full mt-2">
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default HealthProfile;
