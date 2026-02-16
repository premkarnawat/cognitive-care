import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase } from 'lucide-react';
import { apiPost } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const RoleSelection = () => {
  const [role, setRole] = useState<'student' | 'employee' | null>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (key: string, value: string) => setForm((p: any) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost('/user/role', { role, ...form });
    } catch {
      // Continue even if API fails (for demo)
    }
    setLoading(false);
    navigate('/health-profile');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold">Choose Your Role</h1>
          <p className="mt-2 text-muted-foreground">Help us personalize your experience</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {([
            { key: 'student' as const, icon: GraduationCap, label: 'Student' },
            { key: 'employee' as const, icon: Briefcase, label: 'Employee' },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => { setRole(key); setForm({}); }}
              className={`glass-card-hover flex flex-col items-center gap-3 p-6 ${role === key ? 'border-primary/60 shadow-primary/20 shadow-lg' : ''}`}
            >
              <Icon className={`h-10 w-10 ${role === key ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`font-semibold ${role === key ? 'text-primary' : ''}`}>{label}</span>
            </button>
          ))}
        </div>

        {role && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            {role === 'student' ? (
              <>
                <div><label className="mb-1 block text-sm font-medium text-muted-foreground">College</label><input required className="input-glass w-full" onChange={e => update('college', e.target.value)} /></div>
                <div><label className="mb-1 block text-sm font-medium text-muted-foreground">Course</label><input required className="input-glass w-full" onChange={e => update('course', e.target.value)} /></div>
                <div><label className="mb-1 block text-sm font-medium text-muted-foreground">Year</label><input required className="input-glass w-full" type="number" min="1" max="6" onChange={e => update('year', e.target.value)} /></div>
              </>
            ) : (
              <>
                <div><label className="mb-1 block text-sm font-medium text-muted-foreground">Company</label><input required className="input-glass w-full" onChange={e => update('company', e.target.value)} /></div>
                <div><label className="mb-1 block text-sm font-medium text-muted-foreground">Role</label><input required className="input-glass w-full" onChange={e => update('role_title', e.target.value)} /></div>
                <div><label className="mb-1 block text-sm font-medium text-muted-foreground">Department</label><input required className="input-glass w-full" onChange={e => update('department', e.target.value)} /></div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Work Type</label>
                  <select required className="input-glass w-full" onChange={e => update('work_type', e.target.value)}>
                    <option value="">Select</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </>
            )}
            <button type="submit" disabled={loading} className="pill-button-primary w-full">
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default RoleSelection;
