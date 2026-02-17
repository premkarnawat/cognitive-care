import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Brain, Heart, Activity, Zap, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Multi-layered ambient glows */}
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="pointer-events-none absolute inset-0 ambient-glow-bottom" />
      <div className="pointer-events-none absolute inset-0 ambient-glow-center" />

      {/* Animated orbs */}
      <motion.div
        animate={{ y: [-15, 15, -15], x: [-5, 5, -5], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-16 left-8 h-40 w-40 rounded-full bg-primary/8 blur-3xl"
      />
      <motion.div
        animate={{ y: [10, -20, 10], x: [5, -5, 5], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="pointer-events-none absolute bottom-24 right-8 h-48 w-48 rounded-full bg-accent/8 blur-3xl"
      />
      <motion.div
        animate={{ y: [5, -10, 5], scale: [1, 1.15, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="pointer-events-none absolute top-1/3 right-1/4 h-32 w-32 rounded-full bg-primary/5 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex max-w-lg flex-col items-center text-center"
      >
        {/* Logo with pulse ring */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7, type: 'spring', stiffness: 200 }}
          className="relative mb-10"
        >
          <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" style={{ animationDuration: '3s' }} />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
              boxShadow: '0 8px 40px -8px hsl(var(--primary) / 0.5)'
            }}
          >
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary"
        >
          AI-Powered Wellness
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-5 font-display text-4xl font-bold leading-[1.15] md:text-5xl lg:text-6xl"
        >
          Understand Your Stress.{' '}
          <span className="gradient-text">Prevent Burnout.</span>{' '}
          Improve Life.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-12 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          AI-powered cognitive load detection to help you stay balanced, focused, and healthy every day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <button onClick={() => navigate('/register')} className="pill-button-primary group flex items-center gap-2 text-base">
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button onClick={() => navigate('/login')} className="pill-button-outline text-base">
            Sign In
          </button>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {[
            { icon: Brain, text: 'AI Detection' },
            { icon: Activity, text: 'Real-time Tracking' },
            { icon: Heart, text: 'Wellness Programs' },
            { icon: Zap, text: 'Instant Insights' },
          ].map(({ icon: Icon, text }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + i * 0.1 }}
              className="glass-card flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground shimmer"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {text}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
