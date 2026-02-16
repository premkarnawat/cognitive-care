import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { User, Settings, HelpCircle, MessageSquare, LogOut, ChevronRight } from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const name = user?.user_metadata?.full_name || 'User';
  const email = user?.email || '';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: HelpCircle, label: 'Help Center', action: () => navigate('/help') },
    { icon: MessageSquare, label: 'Send Feedback', action: () => navigate('/help') },
  ];

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground mb-3">
            {name.charAt(0).toUpperCase()}
          </div>
          <h1 className="font-display text-xl font-bold">{name}</h1>
          <p className="text-sm text-muted-foreground">{email}</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Check-ins', value: '12' },
            { label: 'Streak', value: '5 days' },
            { label: 'Avg Risk', value: 'Low' },
          ].map(({ label, value }) => (
            <div key={label} className="glass-card p-3 text-center">
              <p className="text-lg font-bold text-primary">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card divide-y divide-border/30 overflow-hidden">
          {menuItems.map(({ icon: Icon, label, action }) => (
            <button key={label} onClick={action} className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/30 transition-colors">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button onClick={handleLogout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 py-3 text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
