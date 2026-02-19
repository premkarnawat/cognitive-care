import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Tip {
  id: string;
  title: string;
  description: string;
  video_url?: string;
  category: string;
  type: string;
  created_at: string;
}

const TipsManagement = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Tip | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', video_url: '', category: '', type: 'tip' });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchTips = async () => {
    setLoading(true);
    const { data } = await supabase.from('tips_videos').select('*').order('created_at', { ascending: false });
    setTips(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTips(); }, []);

  const startCreate = () => { setForm({ title: '', description: '', video_url: '', category: '', type: 'tip' }); setCreating(true); setEditing(null); };
  const startEdit = (tip: Tip) => { setForm({ title: tip.title, description: tip.description, video_url: tip.video_url || '', category: tip.category, type: tip.type }); setEditing(tip); setCreating(false); };

  const saveTip = async () => {
    if (!form.title.trim()) { toast({ title: 'Error', description: 'Title is required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = { ...form, video_url: form.video_url || null };
    try {
      if (editing) {
        await supabase.from('tips_videos').update(payload).eq('id', editing.id);
      } else {
        await supabase.from('tips_videos').insert(payload);
      }
      toast({ title: editing ? 'Updated' : 'Created' });
      setEditing(null); setCreating(false); fetchTips();
    } catch (err: any) { toast({ title: 'Error', description: err.message, variant: 'destructive' }); }
    setSaving(false);
  };

  const deleteTip = async (id: string) => { await supabase.from('tips_videos').delete().eq('id', id); toast({ title: 'Deleted' }); fetchTips(); };

  if (creating || editing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setCreating(false); setEditing(null); }} className="h-9 w-9 rounded-xl glass-card flex items-center justify-center"><ArrowLeft className="h-5 w-5 text-muted-foreground" /></button>
          <h2 className="font-display text-xl font-bold">{editing ? 'Edit' : 'New'} Tip/Video</h2>
        </div>
        <div className="glass-card p-5 space-y-4">
          <div><label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-glass w-full" /></div>
          <div><label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-glass w-full min-h-[80px]" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-glass w-full" placeholder="Motivation" /></div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-glass w-full">
                <option value="tip">Tip</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>
          </div>
          <div><label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Video/Audio URL</label><input value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} className="input-glass w-full" placeholder="https://youtube.com/embed/..." /></div>
          <button onClick={saveTip} disabled={saving} className="pill-button-primary w-full flex items-center justify-center gap-2">
            {saving ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <><Save className="h-4 w-4" /> Save</>}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Tips & Videos</h2>
        <button onClick={startCreate} className="pill-button-primary px-4 py-2 text-xs flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> Add New</button>
      </div>
      {loading ? <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div> : (
        <div className="space-y-2">
          {tips.map(tip => (
            <div key={tip.id} className="glass-card p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{tip.title}</p>
                <p className="text-[11px] text-muted-foreground">{tip.type} • {tip.category}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => startEdit(tip)} className="h-8 w-8 rounded-lg glass-card flex items-center justify-center"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><button className="h-8 w-8 rounded-lg glass-card flex items-center justify-center"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button></AlertDialogTrigger>
                  <AlertDialogContent className="glass-card"><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="glass-card">Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteTip(tip.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {tips.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No tips or videos yet.</p>}
        </div>
      )}
    </motion.div>
  );
};

export default TipsManagement;
