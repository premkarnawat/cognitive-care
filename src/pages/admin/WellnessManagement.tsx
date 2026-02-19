import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface WellnessProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  video_url?: string;
  duration_minutes?: number;
  icon_name?: string;
  gradient?: string;
  created_at: string;
}

const WellnessManagement = () => {
  const [programs, setPrograms] = useState<WellnessProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<WellnessProgram | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', video_url: '', duration_minutes: '', icon_name: 'Brain', gradient: 'from-purple-500 to-indigo-500' });
  const [steps, setSteps] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchPrograms = async () => {
    setLoading(true);
    const { data } = await supabase.from('wellness_programs').select('*').order('created_at', { ascending: false });
    setPrograms(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPrograms(); }, []);

  const startCreate = () => {
    setForm({ title: '', description: '', category: '', video_url: '', duration_minutes: '', icon_name: 'Brain', gradient: 'from-purple-500 to-indigo-500' });
    setSteps(['']);
    setCreating(true);
    setEditing(null);
  };

  const startEdit = async (program: WellnessProgram) => {
    setForm({
      title: program.title,
      description: program.description,
      category: program.category,
      video_url: program.video_url || '',
      duration_minutes: program.duration_minutes?.toString() || '',
      icon_name: program.icon_name || 'Brain',
      gradient: program.gradient || 'from-purple-500 to-indigo-500',
    });
    // Fetch steps
    const { data: stepsData } = await supabase.from('wellness_steps').select('step_text').eq('program_id', program.id).order('step_order');
    setSteps(stepsData?.map(s => s.step_text) || ['']);
    setEditing(program);
    setCreating(false);
  };

  const saveProgram = async () => {
    if (!form.title.trim()) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      video_url: form.video_url || null,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      icon_name: form.icon_name,
      gradient: form.gradient,
    };

    try {
      let programId: string;
      if (editing) {
        await supabase.from('wellness_programs').update(payload).eq('id', editing.id);
        programId = editing.id;
        // Delete old steps
        await supabase.from('wellness_steps').delete().eq('program_id', editing.id);
      } else {
        const { data } = await supabase.from('wellness_programs').insert(payload).select('id').single();
        programId = data!.id;
      }

      // Insert steps
      const validSteps = steps.filter(s => s.trim());
      if (validSteps.length > 0) {
        await supabase.from('wellness_steps').insert(
          validSteps.map((s, i) => ({ program_id: programId, step_text: s, step_order: i + 1 }))
        );
      }

      toast({ title: editing ? 'Program Updated' : 'Program Created' });
      setEditing(null);
      setCreating(false);
      fetchPrograms();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  const deleteProgram = async (id: string) => {
    await supabase.from('wellness_steps').delete().eq('program_id', id);
    await supabase.from('wellness_programs').delete().eq('id', id);
    toast({ title: 'Program Deleted' });
    fetchPrograms();
  };

  if (creating || editing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setCreating(false); setEditing(null); }} className="h-9 w-9 rounded-xl glass-card flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h2 className="font-display text-xl font-bold">{editing ? 'Edit Program' : 'New Program'}</h2>
        </div>

        <div className="glass-card p-5 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-glass w-full" placeholder="Program title" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-glass w-full min-h-[80px]" placeholder="Describe the program" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-glass w-full" placeholder="Meditation" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration (min)</label>
              <input type="number" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} className="input-glass w-full" placeholder="10" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Video URL (embed)</label>
            <input value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} className="input-glass w-full" placeholder="https://youtube.com/embed/..." />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Steps</label>
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <span className="text-xs text-muted-foreground mt-3 w-5">{i + 1}.</span>
                <input value={step} onChange={e => { const s = [...steps]; s[i] = e.target.value; setSteps(s); }} className="input-glass flex-1" placeholder="Step description" />
                {steps.length > 1 && (
                  <button onClick={() => setSteps(steps.filter((_, j) => j !== i))} className="text-destructive text-xs mt-3">✕</button>
                )}
              </div>
            ))}
            <button onClick={() => setSteps([...steps, ''])} className="text-xs text-primary font-semibold mt-1">+ Add Step</button>
          </div>

          <button onClick={saveProgram} disabled={saving} className="pill-button-primary w-full flex items-center justify-center gap-2">
            {saving ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <><Save className="h-4 w-4" /> Save Program</>}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Wellness Programs</h2>
        <button onClick={startCreate} className="pill-button-primary px-4 py-2 text-xs flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" /> New Program
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : (
        <div className="space-y-2">
          {programs.map(p => (
            <div key={p.id} className="glass-card p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{p.title}</p>
                <p className="text-[11px] text-muted-foreground">{p.category} • {p.duration_minutes || '—'} min</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => startEdit(p)} className="h-8 w-8 rounded-lg glass-card flex items-center justify-center hover:border-primary/40 transition-all">
                  <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="h-8 w-8 rounded-lg glass-card flex items-center justify-center hover:border-destructive/40 transition-all">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-card">
                    <AlertDialogHeader><AlertDialogTitle>Delete Program?</AlertDialogTitle><AlertDialogDescription>Steps will also be deleted.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="glass-card">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteProgram(p.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {programs.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No programs yet.</p>}
        </div>
      )}
    </motion.div>
  );
};

export default WellnessManagement;
