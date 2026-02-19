import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  type: "tip",
  media_url: "",
};

const TipsManagement = () => {
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const startCreate = () => {
    setForm(emptyForm);
    setCreating(true);
  };

  const saveTip = async () => {
    if (!form.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("tips_videos")
      .insert([
        {
          title: form.title,
          description: form.description,
          category: form.category,
          type: form.type.toLowerCase(),
          media_url: form.media_url || null,
        },
      ]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Tip/Video Saved" });
      setCreating(false);
    }

    setSaving(false);
  };

  if (creating) {
    return (
      <div className="space-y-4">

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreating(false)}
            className="h-9 w-9 rounded-xl glass-card flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold">New Tip/Video</h2>
        </div>

        <div className="glass-card p-5 space-y-4">

          <input
            placeholder="Title"
            className="input-glass w-full"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            className="input-glass w-full"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            placeholder="Category"
            className="input-glass w-full"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <select
            className="input-glass w-full"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="tip">Tip</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>

          <input
            placeholder="Video / Audio URL"
            className="input-glass w-full"
            value={form.media_url}
            onChange={(e) =>
              setForm({ ...form, media_url: e.target.value })
            }
          />

          <button
            onClick={saveTip}
            disabled={saving}
            className="pill-button-primary w-full flex justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </button>

        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={startCreate}
        className="pill-button-primary flex gap-2"
      >
        <Plus className="h-4 w-4" />
        New Tip / Video
      </button>
    </div>
  );
};

export default TipsManagement;
