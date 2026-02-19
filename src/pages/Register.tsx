import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiPost } from '@/lib/api';
import { supabase } from '@/lib/supabase';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </label>
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

  const age = form.dob
    ? Math.floor((Date.now() - new Date(form.dob).getTime()) / 31557600000)
    : null;

  const update = (key: string, value: string) =>
    setForm(p => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      // ✅ Create Auth User
      await signUp(form.email, form.password);

      // ✅ Get User ID
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // ✅ Save profile
      await apiPost('/save_profile', {
        user_id: userId,
        full_name: form.fullName,
        gender: form.gender,
        age,
        city: form.city,
        country: form.country
      });

      toast({ title: 'Account Created!', description: 'Welcome to MindGuard 🎉' });
      navigate('/health-profile');

    } catch (err: any) {
      toast({ title: 'Registration Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <motion.div className="glass-card w-full max-w-md p-8">

        <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Field label="Full Name">
            <input className="input-glass w-full"
              value={form.fullName}
              onChange={e => update('fullName', e.target.value)}
            />
          </Field>

          <Field label="Email">
            <input type="email" className="input-glass w-full"
              value={form.email}
              onChange={e => update('email', e.target.value)}
            />
          </Field>

          <Field label="Password">
            <input type="password" className="input-glass w-full"
              value={form.password}
              onChange={e => update('password', e.target.value)}
            />
          </Field>

          <Field label="Confirm Password">
            <input type="password" className="input-glass w-full"
              value={form.confirmPassword}
              onChange={e => update('confirmPassword', e.target.value)}
            />
          </Field>

          <Field label="Gender">
            <select className="input-glass w-full"
              value={form.gender}
              onChange={e => update('gender', e.target.value)}>
              <option value="">Select</option>
              <option>male</option>
              <option>female</option>
              <option>other</option>
            </select>
          </Field>

          <Field label="DOB">
            <input type="date" className="input-glass w-full"
              value={form.dob}
              onChange={e => update('dob', e.target.value)}
            />
          </Field>

          <Field label="City">
            <input className="input-glass w-full"
              value={form.city}
              onChange={e => update('city', e.target.value)}
            />
          </Field>

          <Field label="Country">
            <input className="input-glass w-full"
              value={form.country}
              onChange={e => update('country', e.target.value)}
            />
          </Field>

          <button type="submit" disabled={loading} className="pill-button-primary w-full">
            Create Account
          </button>

        </form>

        <p className="mt-4 text-center text-sm">
          Already have account? <Link to="/login">Login</Link>
        </p>

      </motion.div>
    </div>
  );
};

export default Register;
