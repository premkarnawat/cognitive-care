import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, BookOpen, Sparkles, LogOut, Video } from 'lucide-react';
import UserManagement from './UserManagement';
import BlogManagement from './BlogManagement';
import WellnessManagement from './WellnessManagement';
import TipsManagement from './TipsManagement';

type Tab = 'overview' | 'users' | 'blogs' | 'wellness' | 'tips';

const tabs = [
  { id: 'overview' as const, label: 'Overview', icon: ShieldCheck },
  { id: 'users' as const, label: 'Users', icon: Users },
  { id: 'blogs' as const, label: 'Blogs', icon: BookOpen },
  { id: 'wellness' as const, label: 'Wellness', icon: Sparkles },
  { id: 'tips' as const, label: 'Tips/Videos', icon: Video },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-border/20 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-base">Admin Panel</h1>
            <p className="text-[11px] text-muted-foreground">Cognitive Care Management</p>
          </div>
        </div>
        <button onClick={handleLogout} className="glass-card px-3 py-2 text-xs font-semibold text-destructive flex items-center gap-1.5">
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </div>

      {/* Tab nav */}
      <div className="relative z-10 flex overflow-x-auto border-b border-border/20 px-3">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-5">
        {activeTab === 'overview' && <OverviewPanel />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'blogs' && <BlogManagement />}
        {activeTab === 'wellness' && <WellnessManagement />}
        {activeTab === 'tips' && <TipsManagement />}
      </div>
    </div>
  );
};

const OverviewPanel = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
    <h2 className="font-display text-xl font-bold">Dashboard Overview</h2>
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Total Users', value: '—', icon: Users },
        { label: 'Blog Posts', value: '—', icon: BookOpen },
        { label: 'Programs', value: '—', icon: Sparkles },
        { label: 'Tips/Videos', value: '—', icon: Video },
      ].map(({ label, value, icon: Icon }) => (
        <div key={label} className="glass-card p-4 text-center">
          <Icon className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="text-lg font-bold font-display">{value}</p>
          <p className="text-[11px] text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

export default AdminDashboard;
