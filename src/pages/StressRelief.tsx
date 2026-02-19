import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Wind, Video, Music, Lightbulb } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TipVideo {
  id: string;
  title: string;
  description: string;
  video_url?: string;
  category: string;
  type: string;
}

const StressRelief = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<TipVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('tips_videos').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  const tips = items.filter(i => i.type === 'tip');
  const videos = items.filter(i => i.type === 'video');
  const audio = items.filter(i => i.type === 'audio');

  const ContentCard = ({ item }: { item: TipVideo }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
      {item.video_url && (item.type === 'video' || item.type === 'audio') && (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={item.video_url}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-display font-semibold text-sm">{item.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate('/wellness')} className="flex h-9 w-9 items-center justify-center rounded-xl glass-card">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold flex items-center gap-2">
              <Wind className="h-6 w-6 text-primary" /> Stress Relief
            </h1>
            <p className="text-xs text-muted-foreground ml-8">Tips, videos & relaxation</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : items.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Wind className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No stress relief content yet. Check back soon!</p>
          </div>
        ) : (
          <Tabs defaultValue="tips" className="w-full">
            <TabsList className="w-full glass-card p-1 rounded-xl mb-4">
              <TabsTrigger value="tips" className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Lightbulb className="h-3.5 w-3.5 mr-1" /> Tips
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Video className="h-3.5 w-3.5 mr-1" /> Videos
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Music className="h-3.5 w-3.5 mr-1" /> Audio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tips" className="space-y-3">
              {tips.length > 0 ? tips.map(t => <ContentCard key={t.id} item={t} />) : <p className="text-center text-muted-foreground text-sm py-8">No tips yet.</p>}
            </TabsContent>
            <TabsContent value="videos" className="space-y-3">
              {videos.length > 0 ? videos.map(v => <ContentCard key={v.id} item={v} />) : <p className="text-center text-muted-foreground text-sm py-8">No videos yet.</p>}
            </TabsContent>
            <TabsContent value="audio" className="space-y-3">
              {audio.length > 0 ? audio.map(a => <ContentCard key={a.id} item={a} />) : <p className="text-center text-muted-foreground text-sm py-8">No audio yet.</p>}
            </TabsContent>
          </Tabs>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default StressRelief;
