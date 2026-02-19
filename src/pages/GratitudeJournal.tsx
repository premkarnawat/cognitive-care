import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Heart, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GratitudeEntry {
  id: string;
  content: string;
  created_at: string;
}

const GratitudeJournal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchEntries = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('gratitude_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [user]);

  const addEntry = async () => {
    if (!newEntry.trim() || !user) return;
    setSaving(true);
    await supabase.from('gratitude_entries').insert({ user_id: user.id, content: newEntry });
    setNewEntry('');
    toast({ title: '✨ Entry Added' });
    fetchEntries();
    setSaving(false);
  };

  const updateEntry = async () => {
    if (!editText.trim() || !editingId) return;
    await supabase.from('gratitude_entries').update({ content: editText }).eq('id', editingId);
    setEditingId(null);
    toast({ title: 'Entry Updated' });
    fetchEntries();
  };

  const deleteEntry = async (id: string) => {
    await supabase.from('gratitude_entries').delete().eq('id', id);
    toast({ title: 'Entry Deleted' });
    fetchEntries();
  };

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate('/wellness')} className="flex h-9 w-9 items-center justify-center rounded-xl glass-card">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" /> Gratitude Journal
            </h1>
            <p className="text-xs text-muted-foreground ml-8">What are you grateful for today?</p>
          </div>
        </motion.div>

        {/* New entry */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 mb-4">
          <textarea
            value={newEntry}
            onChange={e => setNewEntry(e.target.value)}
            placeholder="Write 3 things you're grateful for today..."
            className="input-glass w-full min-h-[100px] mb-3"
          />
          <button onClick={addEntry} disabled={saving || !newEntry.trim()} className="pill-button-primary w-full flex items-center justify-center gap-2">
            {saving ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <><Plus className="h-4 w-4" /> Add Entry</>}
          </button>
        </motion.div>

        {/* Entries */}
        {loading ? (
          <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4"
                >
                  {editingId === entry.id ? (
                    <div className="space-y-2">
                      <textarea value={editText} onChange={e => setEditText(e.target.value)} className="input-glass w-full min-h-[80px]" />
                      <div className="flex gap-2">
                        <button onClick={updateEntry} className="pill-button-primary px-4 py-2 text-xs flex items-center gap-1"><Save className="h-3 w-3" /> Save</button>
                        <button onClick={() => setEditingId(null)} className="pill-button-outline px-4 py-2 text-xs flex items-center gap-1"><X className="h-3 w-3" /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</span>
                        <div className="flex gap-1.5">
                          <button onClick={() => { setEditingId(entry.id); setEditText(entry.content); }} className="h-7 w-7 rounded-lg glass-card flex items-center justify-center">
                            <Edit className="h-3 w-3 text-muted-foreground" />
                          </button>
                          <button onClick={() => deleteEntry(entry.id)} className="h-7 w-7 rounded-lg glass-card flex items-center justify-center">
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {entries.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">No entries yet. Start writing!</p>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default GratitudeJournal;
