import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiPost } from '@/lib/api';
import { supabase } from '@/lib/supabase';

const HealthProfile = () => {

  const [form, setForm] = useState({
    height: '', weight: '', bloodGroup: '', bp: '', pulse: '', notes: ''
  });

  const navigate = useNavigate();
  const update = (k: string, v: string) =>
    setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    await apiPost('/save_health_profile', {
      user_id: userId,
      height: Number(form.height),
      weight: Number(form.weight),
      blood_group: form.bloodGroup,
      bp: form.bp,
      pulse: Number(form.pulse),
      health_conditions: form.notes
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit}
        className="glass-card p-6 space-y-4 w-full max-w-md"
      >

        <input placeholder="Height"
          value={form.height}
          onChange={e => update('height', e.target.value)}
          className="input-glass w-full"
        />

        <input placeholder="Weight"
          value={form.weight}
          onChange={e => update('weight', e.target.value)}
          className="input-glass w-full"
        />

        <input placeholder="Blood Group"
          value={form.bloodGroup}
          onChange={e => update('bloodGroup', e.target.value)}
          className="input-glass w-full"
        />

        <input placeholder="BP"
          value={form.bp}
          onChange={e => update('bp', e.target.value)}
          className="input-glass w-full"
        />

        <input placeholder="Pulse"
          value={form.pulse}
          onChange={e => update('pulse', e.target.value)}
          className="input-glass w-full"
        />

        <textarea placeholder="Notes"
          value={form.notes}
          onChange={e => update('notes', e.target.value)}
          className="input-glass w-full"
        />

        <button className="pill-button-primary w-full">
          Save Health Profile
        </button>

      </motion.form>
    </div>
  );
};

export default HealthProfile;
