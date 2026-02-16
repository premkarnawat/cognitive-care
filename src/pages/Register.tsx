import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    setLoading(true);
    try {
      await signUp(form.email, form.password, {
        full_name: form.fullName, gender: form.gender,
        dob: form.dob, age, city: form.city, country: form.country,
      });
      toast({ title: 'Account Created!', description: 'Please check your email to verify, or continue.' });
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold">Create Account</h1>
          <p className="mt-2 text-muted-foreground">Join MindGuard today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Full Name</label>
            <input required className="input-glass w-full" value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">Email</label>
            <input type="email" required className="input-glass w-full" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required className="input-glass w-full pr-10" value={form.password} onChange={e => update('password', e.target.value)} placeholder="••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Eye className="h-4 w-4" /></button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Confirm</label>
              <input type="password" required className="input-glass w-full" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="••••••" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Gender</label>
              <select required className="input-glass w-full" value={form.gender} onChange={e => update('gender', e.target.value)}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">DOB {age !== null && <span className="text-primary">({age}y)</span>}</label>
              <input type="date" required className="input-glass w-full" value={form.dob} onChange={e => update('dob', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">City</label>
              <input required className="input-glass w-full" value={form.city} onChange={e => update('city', e.target.value)} placeholder="Mumbai" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Country</label>
              <input required className="input-glass w-full" value={form.country} onChange={e => update('country', e.target.value)} placeholder="India" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="pill-button-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <><UserPlus className="h-4 w-4" /> Create Account</>}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
