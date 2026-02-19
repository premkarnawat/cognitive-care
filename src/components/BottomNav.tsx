import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ClipboardCheck, MessageCircle, BookOpen, User } from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/checkin', icon: ClipboardCheck, label: 'Check-in' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/blog', icon: BookOpen, label: 'Blog' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/20 px-2 pb-safe"
      style={{
        background: 'linear-gradient(to top, hsl(var(--background)) 60%, hsl(var(--background) / 0.9))',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around py-1.5">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all duration-200"
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-colors duration-200 ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`} />
                {active && (
                  <motion.div
                    layoutId="navGlow"
                    className="absolute -inset-2 rounded-xl bg-primary/10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
