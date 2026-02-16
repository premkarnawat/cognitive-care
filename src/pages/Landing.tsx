import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Brain, Heart } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="pointer-events-none absolute inset-0 ambient-glow-bottom" />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute top-20 left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-32 right-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex max-w-lg flex-col items-center text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30"
        >
          <Shield className="h-10 w-10 text-primary-foreground" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-4 font-display text-4xl font-bold leading-tight md:text-5xl"
        >
          Understand Your Stress.{' '}
          <span className="gradient-text">Prevent Burnout.</span>{' '}
          Improve Life.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-10 text-lg text-muted-foreground"
        >
          AI-powered cognitive load detection to help you stay balanced, focused, and healthy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <button onClick={() => navigate('/register')} className="pill-button-primary text-lg">
            Get Started
          </button>
          <button onClick={() => navigate('/login')} className="pill-button-outline text-lg">
            Sign In
          </button>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: Brain, text: 'AI Detection' },
            { icon: Heart, text: 'Wellness Tracking' },
            { icon: Shield, text: 'Burnout Prevention' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="glass-card flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
              <Icon className="h-4 w-4 text-primary" />
              {text}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
