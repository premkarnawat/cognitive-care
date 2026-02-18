import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
    {children}
  </div>
);

const Register = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    gender: '', dob: '', city: '', country: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const age = form.dob ? Math.floor((Date.now() - new Date(form.dob).getTime()) / 31557600000) : null;
  const update = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (form.password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await signUp(form.email, form.password, {
        full_name: form.fullName, gender: form.gender,
        dob: form.dob, age, city: form.city, country: form.country,
      });
      toast({ title: 'Account Created! 🎉', description: 'Welcome to MindGuard!' });
      navigate('/role-selection');
    } catch (err: any) {
      toast({ title: 'Registration Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="pointer-events-none absolute inset-0 ambient-glow-bottom" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="glass-card w-full max-w-md p-8 md:p-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
            boxShadow: '0 8px 32px -8px hsl(var(--primary) / 0.4)',
          }}
        >
          <Shield className="h-7 w-7 text-primary-foreground" />
        </motion.div>

        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join MindGuard — start your wellness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full Name">
            <input required className="input-glass w-full" value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="John Doe" />
          </Field>
          <Field label="Email">
            <input type="email" required className="input-glass w-full" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Password">
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required className="input-glass w-full pr-10" value={form.password} onChange={e => update('password', e.target.value)} placeholder="••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Field label="Confirm">
              <input type="password" required className="input-glass w-full" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="••••••" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Gender">
              <select required className="input-glass w-full" value={form.gender} onChange={e => update('gender', e.target.value)}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label={`DOB ${age !== null ? `(${age}y)` : ''}`}>
              <input type="date" required className="input-glass w-full" value={form.dob} onChange={e => update('dob', e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input required className="input-glass w-full" value={form.city} onChange={e => update('city', e.target.value)} placeholder="Mumbai" />
            </Field>
            <Field label="Country">
              <input required className="input-glass w-full" value={form.country} onChange={e => update('country', e.target.value)} placeholder="India" />
            </Field>
          </div>
          <button type="submit" disabled={loading} className="pill-button-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create Account
              </>
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
