import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Palette, Sun, Moon, User, Lock, Trash2, ChevronRight, Save, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type Section = 'main' | 'theme' | 'profile' | 'password';

const themeColors = [
  { id: 'orange' as const, label: 'Orange', bg: 'bg-orange-500' },
  { id: 'blue' as const, label: 'Blue', bg: 'bg-blue-500' },
  { id: 'pink' as const, label: 'Pink', bg: 'bg-pink-500' },
  { id: 'purple' as const, label: 'Purple', bg: 'bg-purple-500' },
];

const Settings = () => {
  const { user, signOut } = useAuth();
  const { color, mode, setColor, setMode } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [section, setSection] = useState<Section>('main');

  // Profile fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setName(data.full_name || data.name || '');
        setAge(data.age?.toString() || '');
        setPhone(data.phone || '');
        setCity(data.city || '');
        setCountry(data.country || '');
        setGender(data.gender || '');
      }
    });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: name,
        age: age ? Number(age) : null,
        phone,
        city,
        country,
        gender,
      }, { onConflict: 'id' });
      if (error) throw error;
      toast({ title: 'Profile Updated', description: 'Your profile has been saved.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setProfileLoading(false);
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setPwLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: 'Password Changed', description: 'Your password has been updated.' });
      setNewPassword('');
      setConfirmPassword('');
      setSection('main');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setPwLoading(false);
  };

  const deleteAccount = async () => {
    setDeleteLoading(true);
    try {
      // Delete user data via RPC or direct delete - the cascade should handle related records
      if (user) {
        await supabase.from('profiles').delete().eq('id', user.id);
        await supabase.from('theme_preferences').delete().eq('user_id', user.id);
        await supabase.from('gratitude_entries').delete().eq('user_id', user.id);
        await supabase.from('user_wellness_progress').delete().eq('user_id', user.id);
      }
      await signOut();
      navigate('/');
      toast({ title: 'Account Deleted', description: 'Your account has been removed.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setDeleteLoading(false);
  };

  const Header = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center gap-3">
      <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-xl glass-card">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </button>
      <h1 className="font-display text-2xl font-bold">{title}</h1>
    </motion.div>
  );

  const renderMain = () => (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
            <SettingsIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          Settings
        </h1>
      </motion.div>

      <div className="space-y-3">
        {[
          { icon: Palette, label: 'Theme & Appearance', sec: 'theme' as const },
          { icon: User, label: 'Edit Profile', sec: 'profile' as const },
          { icon: Lock, label: 'Change Password', sec: 'password' as const },
        ].map(({ icon: Icon, label, sec }, i) => (
          <motion.button
            key={label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setSection(sec)}
            className="glass-card flex w-full items-center gap-4 p-4 text-left hover:border-primary/30 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="flex-1 font-medium text-sm">{label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        ))}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24 }}
              className="glass-card flex w-full items-center gap-4 p-4 text-left border-destructive/30 hover:border-destructive/50 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/20">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <span className="flex-1 font-medium text-sm text-destructive">Delete Account</span>
              <ChevronRight className="h-4 w-4 text-destructive/50" />
            </motion.button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass-card border-destructive/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">Delete Account?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="glass-card">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteAccount}
                disabled={deleteLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );

  const renderTheme = () => (
    <>
      <Header title="Theme & Appearance" onBack={() => setSection('main')} />
      <div className="space-y-6">
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Theme Color</h3>
          <div className="grid grid-cols-4 gap-3">
            {themeColors.map(({ id, label, bg }) => (
              <button
                key={id}
                onClick={() => setColor(id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  color === id ? 'glass-card border-primary/60 shadow-lg' : 'hover:bg-muted/30'
                }`}
              >
                <div className={`h-10 w-10 rounded-full ${bg} shadow-lg ${color === id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {mode === 'dark' ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
              <span className="text-sm font-medium">{mode === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <Switch
              checked={mode === 'light'}
              onCheckedChange={(checked) => setMode(checked ? 'light' : 'dark')}
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderProfile = () => (
    <>
      <Header title="Edit Profile" onBack={() => setSection('main')} />
      <div className="glass-card p-5 space-y-4">
        {[
          { label: 'Full Name', value: name, set: setName, type: 'text' },
          { label: 'Age', value: age, set: setAge, type: 'number' },
          { label: 'Phone', value: phone, set: setPhone, type: 'tel' },
          { label: 'City', value: city, set: setCity, type: 'text' },
          { label: 'Country', value: country, set: setCountry, type: 'text' },
        ].map(({ label, value, set, type }) => (
          <div key={label}>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
            <input type={type} value={value} onChange={e => set(e.target.value)} className="input-glass w-full" placeholder={label} />
          </div>
        ))}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value)} className="input-glass w-full">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        <button onClick={saveProfile} disabled={profileLoading} className="pill-button-primary w-full flex items-center justify-center gap-2 mt-2">
          {profileLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <><Save className="h-4 w-4" /> Save Profile</>}
        </button>
      </div>
    </>
  );

  const renderPassword = () => (
    <>
      <Header title="Change Password" onBack={() => setSection('main')} />
      <div className="glass-card p-5 space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-glass w-full" placeholder="••••••••" />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-glass w-full" placeholder="••••••••" />
        </div>
        <button onClick={changePassword} disabled={pwLoading} className="pill-button-primary w-full flex items-center justify-center gap-2 mt-2">
          {pwLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <><Lock className="h-4 w-4" /> Update Password</>}
        </button>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        {section === 'main' && renderMain()}
        {section === 'theme' && renderTheme()}
        {section === 'profile' && renderProfile()}
        {section === 'password' && renderPassword()}
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;
