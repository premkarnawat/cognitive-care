import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft, Save, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Blog {
  id: string;
  title: string;
  content: string;
  cover_image?: string;
  tags?: string[];
  category?: string;
  published: boolean;
  created_at: string;
  author_id: string;
}

const emptyBlog = { title: '', content: '', cover_image: '', tags: '', category: '', published: false };

const BlogManagement = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyBlog);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchBlogs = async () => {
    setLoading(true);
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    setBlogs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const startCreate = () => {
    setForm(emptyBlog);
    setCreating(true);
    setEditing(null);
    setPreview(false);
  };

  const startEdit = (blog: Blog) => {
    setForm({
      title: blog.title,
      content: blog.content,
      cover_image: blog.cover_image || '',
      tags: (blog.tags || []).join(', '),
      category: blog.category || '',
      published: blog.published,
    });
    setEditing(blog);
    setCreating(false);
    setPreview(false);
  };

  const saveBlog = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: 'Error', description: 'Title and content are required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      content: form.content,
      cover_image: form.cover_image || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      category: form.category || null,
      published: form.published,
      author_id: user?.id,
    };

    try {
      if (editing) {
        await supabase.from('blogs').update(payload).eq('id', editing.id);
        toast({ title: 'Blog Updated' });
      } else {
        await supabase.from('blogs').insert(payload);
        toast({ title: 'Blog Created' });
      }
      setEditing(null);
      setCreating(false);
      fetchBlogs();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  const deleteBlog = async (id: string) => {
    await supabase.from('blogs').delete().eq('id', id);
    toast({ title: 'Blog Deleted' });
    fetchBlogs();
  };

  const togglePublish = async (blog: Blog) => {
    await supabase.from('blogs').update({ published: !blog.published }).eq('id', blog.id);
    fetchBlogs();
  };

  if (creating || editing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setCreating(false); setEditing(null); }} className="h-9 w-9 rounded-xl glass-card flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h2 className="font-display text-xl font-bold">{editing ? 'Edit Blog' : 'New Blog'}</h2>
          <button onClick={() => setPreview(!preview)} className="ml-auto glass-card px-3 py-1.5 text-xs font-semibold text-primary">
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {preview ? (
          <div className="glass-card p-5 prose prose-invert max-w-none">
            {form.cover_image && <img src={form.cover_image} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />}
            <h1>{form.title}</h1>
            <ReactMarkdown>{form.content}</ReactMarkdown>
          </div>
        ) : (
          <div className="glass-card p-5 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-glass w-full" placeholder="Blog title" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cover Image URL</label>
              <div className="flex gap-2">
                <Image className="h-5 w-5 text-muted-foreground mt-3" />
                <input value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })} className="input-glass flex-1" placeholder="https://..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-glass w-full" placeholder="Health" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags (comma sep)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="input-glass w-full" placeholder="stress, tips" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content (Markdown)</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="input-glass w-full min-h-[200px] font-mono text-sm" placeholder="Write your blog in markdown..." />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="accent-primary" />
                Publish immediately
              </label>
            </div>
            <button onClick={saveBlog} disabled={saving} className="pill-button-primary w-full flex items-center justify-center gap-2">
              {saving ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <><Save className="h-4 w-4" /> {editing ? 'Update Blog' : 'Create Blog'}</>}
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Blog Management</h2>
        <button onClick={startCreate} className="pill-button-primary px-4 py-2 text-xs flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" /> New Blog
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
      ) : (
        <div className="space-y-2">
          {blogs.map(blog => (
            <div key={blog.id} className="glass-card p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{blog.title}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${blog.published ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{blog.category || 'No category'} • {new Date(blog.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => togglePublish(blog)} className="h-8 w-8 rounded-lg glass-card flex items-center justify-center hover:border-primary/40 transition-all">
                  {blog.published ? <EyeOff className="h-3.5 w-3.5 text-yellow-400" /> : <Eye className="h-3.5 w-3.5 text-green-400" />}
                </button>
                <button onClick={() => startEdit(blog)} className="h-8 w-8 rounded-lg glass-card flex items-center justify-center hover:border-primary/40 transition-all">
                  <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="h-8 w-8 rounded-lg glass-card flex items-center justify-center hover:border-destructive/40 transition-all">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-card">
                    <AlertDialogHeader><AlertDialogTitle>Delete Blog?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="glass-card">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteBlog(blog.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {blogs.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No blog posts yet.</p>}
        </div>
      )}
    </motion.div>
  );
};

export default BlogManagement;
