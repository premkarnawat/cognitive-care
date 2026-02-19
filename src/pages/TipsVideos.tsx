import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { Video } from 'lucide-react';

const TipsVideos = () => (
  <div className="relative min-h-screen bg-background pb-24">
    <div className="pointer-events-none absolute inset-0 ambient-glow" />
    <div className="relative z-10 px-5 pt-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
            <Video className="h-5 w-5 text-primary-foreground" />
          </div>
          Tips & Videos
        </h1>
        <p className="text-muted-foreground text-sm mt-2 ml-11">Motivation & relaxation content</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 text-center"
      >
        <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No tips or videos yet. Check back soon!</p>
      </motion.div>
    </div>
    <BottomNav />
  </div>
);

export default TipsVideos;
