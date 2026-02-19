import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Search, Eye, Ban, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  age?: number;
  city?: string;
  country?: string;
  gender?: string;
  phone?: string;
  is_suspended?: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const toggleSuspend = async (user: UserProfile) => {
    const newStatus = !user.is_suspended;
    await supabase.from('profiles').update({ is_suspended: newStatus }).eq('id', user.id);
    toast({ title: newStatus ? 'User Suspended' : 'User Activated' });
    fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    await supabase.from('profiles').delete().eq('id', userId);
    toast({ title: 'User Deleted' });
    fetchUsers();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="font-display text-xl font-bold">User Management</h2>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="input-glass w-full pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(user => (
            <div key={user.id} className="glass-card p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
                {(user.full_name || '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.full_name || 'Unknown'}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user.email || user.id.slice(0, 8)}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setSelectedUser(user)} className="h-8 w-8 rounded-lg glass-card flex items-center justify-center hover:border-primary/40 transition-all">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => toggleSuspend(user)} className="h-8 w-8 rounded-lg glass-card flex items-center justify-center hover:border-primary/40 transition-all">
                  {user.is_suspended ? <CheckCircle className="h-3.5 w-3.5 text-green-400" /> : <Ban className="h-3.5 w-3.5 text-yellow-400" />}
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="h-8 w-8 rounded-lg glass-card flex items-center justify-center hover:border-destructive/40 transition-all">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-card">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User?</AlertDialogTitle>
                      <AlertDialogDescription>This will cascade delete all related records.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="glass-card">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteUser(user.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No users found.</p>}
        </div>
      )}

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="font-display">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-3 text-sm">
              {[
                ['Name', selectedUser.full_name],
                ['Email', selectedUser.email],
                ['Age', selectedUser.age],
                ['Gender', selectedUser.gender],
                ['Phone', selectedUser.phone],
                ['City', selectedUser.city],
                ['Country', selectedUser.country],
                ['Status', selectedUser.is_suspended ? 'Suspended' : 'Active'],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{String(value || '—')}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default UserManagement;
