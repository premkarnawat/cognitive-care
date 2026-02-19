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
  created_at: string;
}

const WellnessManagement = () => {
  const [programs, setPrograms] = useState<WellnessProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<WellnessProgram | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    video_url: '',
    duration_minutes: '',
  });
  const [steps, setSteps] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // ================= FETCH =================
  const fetchPrograms = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('wellness_programs')
      .select('*')
      .order('created_at', { ascending: false });

    setPrograms(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // ================= CREATE =================
  const startCreate = () => {
    setForm({
      title: '',
      description: '',
      category: '',
      video_url: '',
      duration_minutes: '',
    });
    setSteps(['']);
    setCreating(true);
    setEditing(null);
  };

  // ================= EDIT =================
  const startEdit = async (program: WellnessProgram) => {
    setForm({
      title: program.title,
      description: program.description,
      category: program.category,
      video_url: program.video_url || '',
      duration_minutes: program.duration_minutes?.toString() || '',
    });

    const { data: stepsData } = await supabase
      .from('wellness_steps')
      .select('step_text')
      .eq('program_id', program.id)
      .order('step_order');

    setSteps(stepsData?.map(s => s.step_text) || ['']);
    setEditing(program);
    setCreating(false);
  };

  // ================= SAVE =================
  const saveProgram = async () => {
    if (!form.title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      // Get logged user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        video_url: form.video_url || null,
        duration_minutes: form.duration_minutes
          ? Number(form.duration_minutes)
          : null,
        created_by: user.id, // ✅ IMPORTANT
      };

      let programId: string;

      if (editing) {
        const { error } = await supabase
          .from('wellness_programs')
          .update(payload)
          .eq('id', editing.id);

        if (error) throw error;

        programId = editing.id;

        await supabase
          .from('wellness_steps')
          .delete()
          .eq('program_id', editing.id);
      } else {
        const { data, error } = await supabase
          .from('wellness_programs')
          .insert(payload)
          .select()
          .single(); // ✅

        if (error) throw error;
        if (!data) throw new Error('Insert failed');

        programId = data.id;
      }

      // Insert steps
      const validSteps = steps.filter(s => s.trim());

      if (validSteps.length) {
        const stepRows = validSteps.map((s, i) => ({
          program_id: programId,
          step_text: s,
          step_order: i + 1,
        }));

        const { error } = await supabase
          .from('wellness_steps')
          .insert(stepRows);

        if (error) throw error;
      }

      toast({
        title: editing ? 'Program Updated' : 'Program Created',
      });

      setEditing(null);
      setCreating(false);
      fetchPrograms();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }

    setSaving(false);
  };

  // ================= DELETE =================
  const deleteProgram = async (id: string) => {
    await supabase.from('wellness_steps').delete().eq('program_id', id);
    await supabase.from('wellness_programs').delete().eq('id', id);
    toast({ title: 'Program Deleted' });
    fetchPrograms();
  };

  // ================= UI =================
  if (creating || editing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCreating(false);
              setEditing(null);
            }}
            className="h-9 w-9 rounded-xl glass-card flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h2 className="font-display text-xl font-bold">
            {editing ? 'Edit Program' : 'New Program'}
          </h2>
        </div>

        <div className="glass-card p-5 space-y-4">
          <input
            className="input-glass w-full"
            placeholder="Program title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="input-glass w-full"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <input
            className="input-glass w-full"
            placeholder="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />

          <input
            type="number"
            className="input-glass w-full"
            placeholder="Duration (minutes)"
            value={form.duration_minutes}
            onChange={e => setForm({ ...form, duration_minutes: e.target.value })}
          />

          <input
            className="input-glass w-full"
            placeholder="Video Embed URL"
            value={form.video_url}
            onChange={e => setForm({ ...form, video_url: e.target.value })}
          />

          {steps.map((step, i) => (
            <input
              key={i}
              className="input-glass w-full"
              placeholder={`Step ${i + 1}`}
              value={step}
              onChange={e => {
                const s = [...steps];
                s[i] = e.target.value;
                setSteps(s);
              }}
            />
          ))}

          <button
            onClick={() => setSteps([...steps, ''])}
            className="text-primary text-sm"
          >
            + Add Step
          </button>

          <button
            onClick={saveProgram}
            disabled={saving}
            className="pill-button-primary w-full flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Program
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Wellness Programs</h2>
        <button
          onClick={startCreate}
          className="pill-button-primary px-4 py-2 text-xs flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" /> New Program
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        programs.map(p => (
          <div key={p.id} className="glass-card p-4 flex items-center gap-3">
            <div className="flex-1">
              <p className="font-semibold">{p.title}</p>
              <p className="text-xs text-muted-foreground">
                {p.category} • {p.duration_minutes || '-'} min
              </p>
            </div>

            <button onClick={() => startEdit(p)}>
              <Edit className="h-4 w-4" />
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Program and steps will be deleted
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteProgram(p.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))
      )}
    </motion.div>
  );
};

export default WellnessManagement;
