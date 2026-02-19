import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { BookOpen, ArrowLeft, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Blog {
  id: string;
  title: string;
  content: string;
  cover_image?: string;
  tags?: string[];
  category?: string;
  published: boolean;
  created_at: string;
}

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Blog | null>(null);

  useEffect(() => {
    supabase.from('blogs').select('*').eq('published', true).order('created_at', { ascending: false }).then(({ data }) => {
      setBlogs(data || []);
      setLoading(false);
    });
  }, []);

  if (selected) {
    return (
      <div className="relative min-h-screen bg-background pb-24">
        <div className="pointer-events-none absolute inset-0 ambient-glow" />
        <div className="relative z-10 px-5 pt-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center gap-3">
            <button onClick={() => setSelected(null)} className="flex h-9 w-9 items-center justify-center rounded-xl glass-card">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <h1 className="font-display text-lg font-bold truncate">{selected.title}</h1>
          </motion.div>

          {selected.cover_image && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={selected.cover_image}
              alt={selected.title}
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />
          )}

          <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(selected.created_at).toLocaleDateString()}</span>
            {selected.category && <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 font-semibold">{selected.category}</span>}
          </div>

          {selected.tags && selected.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {selected.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  <Tag className="h-2.5 w-2.5" /> {tag}
                </span>
              ))}
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{selected.content}</ReactMarkdown>
          </motion.div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            Blog
          </h1>
          <p className="text-muted-foreground text-sm mt-2 ml-11">Latest articles & insights</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : blogs.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(blog)}
                className="glass-card overflow-hidden cursor-pointer hover:border-primary/30 transition-all"
              >
                {blog.cover_image && (
                  <img src={blog.cover_image} alt={blog.title} className="w-full h-36 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {blog.category && (
                      <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold">{blog.category}</span>
                    )}
                    <span className="text-[10px] text-muted-foreground">{new Date(blog.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-display font-semibold text-sm">{blog.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{blog.content.substring(0, 120)}...</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Blog;
