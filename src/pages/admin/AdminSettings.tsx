import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminSettings() {
  const { user } = useAuth();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (!user) return;

    supabase
      .from("admin_theme_preferences")
      .select("theme")
      .eq("admin_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.theme) setTheme(data.theme);
      });
  }, [user]);

  const saveTheme = async () => {
    await supabase
      .from("admin_theme_preferences")
      .upsert({
        admin_id: user?.id,
        theme
      });

    alert("Theme saved");
  };

  return (
    <div className="glass-card p-6 max-w-md">
      <h2 className="font-bold text-lg mb-4">Admin Theme</h2>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="input-glass w-full"
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="orange">Orange</option>
      </select>

      <button onClick={saveTheme} className="pill-button-primary w-full mt-4">
        Save Theme
      </button>
    </div>
  );
}
