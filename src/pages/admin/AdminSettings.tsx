import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Sun, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const themeColors = [
  { id: "orange", label: "Orange", bg: "bg-orange-500" },
  { id: "blue", label: "Blue", bg: "bg-blue-500" },
  { id: "pink", label: "Pink", bg: "bg-pink-500" },
  { id: "purple", label: "Purple", bg: "bg-purple-500" },
];

export default function AdminSettings() {
  const { user } = useAuth();

  const [color, setColor] = useState("orange");
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD ADMIN THEME
  // =====================================================
  useEffect(() => {
    if (!user) return;

    supabase
      .from("admin_theme_preferences")
      .select("*")
      .eq("admin_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.color) setColor(data.color);
        if (data?.mode) setMode(data.mode);
      });
  }, [user]);

  // =====================================================
  // APPLY THEME TO ADMIN UI
  // =====================================================
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.setProperty(
      "--primary",
      color === "orange"
        ? "24 95% 53%"
        : color === "blue"
        ? "221 83% 53%"
        : color === "pink"
        ? "330 81% 60%"
        : "270 95% 75%"
    );
  }, [color, mode]);

  // =====================================================
  // SAVE THEME
  // =====================================================
  const saveTheme = async () => {
    if (!user) return;

    setLoading(true);

    await supabase.from("admin_theme_preferences").upsert({
      admin_id: user.id,
      color,
      mode,
    });

    alert("Admin theme saved");
    setLoading(false);
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="glass-card p-6 max-w-md space-y-6">

      <h2 className="font-display font-bold text-lg">
        Admin Theme Settings
      </h2>

      {/* COLOR PICKER */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Theme Color
        </p>

        <div className="grid grid-cols-4 gap-3">
          {themeColors.map(({ id, label, bg }) => (
            <button
              key={id}
              onClick={() => setColor(id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all
                ${color === id ? "glass-card border-primary/60" : "hover:bg-muted/30"}
              `}
            >
              <div
                className={`h-10 w-10 rounded-full ${bg}
                ${color === id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
              />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MODE TOGGLE */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {mode === "dark" ? (
            <Moon className="h-5 w-5 text-primary" />
          ) : (
            <Sun className="h-5 w-5 text-primary" />
          )}
          <span className="text-sm font-medium">
            {mode === "dark" ? "Dark Mode" : "Light Mode"}
          </span>
        </div>

        <Switch
          checked={mode === "light"}
          onCheckedChange={(v) => setMode(v ? "light" : "dark")}
        />
      </div>

      {/* SAVE */}
      <button
        onClick={saveTheme}
        disabled={loading}
        className="pill-button-primary w-full flex items-center justify-center gap-2"
      >
        <Save className="h-4 w-4" />
        {loading ? "Saving..." : "Save Theme"}
      </button>

    </div>
  );
}
