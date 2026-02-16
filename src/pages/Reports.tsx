import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart3 } from 'lucide-react';

const demoDaily = [
  { day: 'Mon', stress: 4, fatigue: 3, sleep: 7 },
  { day: 'Tue', stress: 6, fatigue: 5, sleep: 6 },
  { day: 'Wed', stress: 5, fatigue: 4, sleep: 7.5 },
  { day: 'Thu', stress: 7, fatigue: 6, sleep: 5 },
  { day: 'Fri', stress: 3, fatigue: 3, sleep: 8 },
  { day: 'Sat', stress: 2, fatigue: 2, sleep: 9 },
  { day: 'Sun', stress: 4, fatigue: 3, sleep: 7 },
];

const demoWeekly = [
  { week: 'W1', burnoutRisk: 25, avgStress: 4 },
  { week: 'W2', burnoutRisk: 35, avgStress: 5 },
  { week: 'W3', burnoutRisk: 45, avgStress: 6 },
  { week: 'W4', burnoutRisk: 30, avgStress: 4 },
];

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="glass-card p-4 mb-4">
    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">{title}</h3>
    <div className="h-48">{children}</div>
  </div>
);

const Reports = () => (
  <div className="relative min-h-screen bg-background pb-24">
    <div className="pointer-events-none absolute inset-0 ambient-glow" />
    <div className="relative z-10 px-5 pt-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" /> Reports & Analytics</h1>
      </motion.div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="w-full bg-muted/50 backdrop-blur-sm">
          <TabsTrigger value="daily" className="flex-1">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4 space-y-4">
          <ChartCard title="Stress & Fatigue Trends">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demoDaily}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, color: 'hsl(var(--foreground))' }} />
                <Area type="monotone" dataKey="stress" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                <Area type="monotone" dataKey="fatigue" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Sleep Pattern">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demoDaily}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="sleep" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <ChartCard title="Weekly Burnout Risk">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demoWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="burnoutRisk" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <ChartCard title="Monthly Overview">
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              Monthly reports will populate as you log more data.
            </div>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
    <BottomNav />
  </div>
);

export default Reports;
