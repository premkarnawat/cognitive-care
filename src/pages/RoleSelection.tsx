import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { apiPost } from '@/lib/api';

const RoleSelection = () => {
  const [role, setRole] = useState<'student' | 'employee' | null>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (key: string, value: string) => setForm((p: any) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await apiPost('/user/role', { role, ...form }); } catch {}
    setLoading(false);
    navigate('/health-profile');
  };

  const roles = [
    { key: 'student' as const, icon: GraduationCap, label: 'Student', desc: 'College or university' },
    { key: 'employee' as const, icon: Briefcase, label: 'Employee', desc: 'Working professional' },
  ];

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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Step 1 of 2</motion.p>
          <h1 className="font-display text-3xl font-bold">Choose Your Role</h1>
          <p className="mt-2 text-sm text-muted-foreground">This helps us personalize your experience</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {roles.map(({ key, icon: Icon, label, desc }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setRole(key); setForm({}); }}
              className={`glass-card flex flex-col items-center gap-3 p-6 transition-all duration-300 ${
                role === key
                  ? 'border-primary/50 shadow-xl'
                  : ''
              }`}
              style={role === key ? { boxShadow: '0 8px 32px -8px hsl(var(--primary) / 0.3)' } : {}}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${
                role === key
                  ? 'bg-gradient-to-br from-primary to-accent shadow-lg'
                  : 'bg-muted'
              }`}>
                <Icon className={`h-7 w-7 ${role === key ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              </div>
              <span className={`font-display font-semibold ${role === key ? 'text-primary' : ''}`}>{label}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {role && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="glass-card p-6 space-y-4 overflow-hidden"
            >
              {role === 'student' ? (
                <>
                  <Field label="College"><input required className="input-glass w-full" onChange={e => update('college', e.target.value)} placeholder="MIT" /></Field>
                  <Field label="Course"><input required className="input-glass w-full" onChange={e => update('course', e.target.value)} placeholder="Computer Science" /></Field>
                  <Field label="Year"><input required className="input-glass w-full" type="number" min="1" max="6" onChange={e => update('year', e.target.value)} placeholder="3" /></Field>
                </>
              ) : (
                <>
                  <Field label="Company"><input required className="input-glass w-full" onChange={e => update('company', e.target.value)} placeholder="Google" /></Field>
                  <Field label="Role"><input required className="input-glass w-full" onChange={e => update('role_title', e.target.value)} placeholder="Software Engineer" /></Field>
                  <Field label="Department"><input required className="input-glass w-full" onChange={e => update('department', e.target.value)} placeholder="Engineering" /></Field>
                  <Field label="Work Type">
                    <select required className="input-glass w-full" onChange={e => update('work_type', e.target.value)}>
                      <option value="">Select</option>
                      <option value="remote">Remote</option>
                      <option value="onsite">On-site</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </Field>
                </>
              )}
              <button type="submit" disabled={loading} className="pill-button-primary w-full flex items-center justify-center gap-2">
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <>Continue <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
