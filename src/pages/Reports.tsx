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

const tooltipStyle = {
  background: 'hsl(22 12% 7% / 0.95)',
  border: '1px solid hsl(30 18% 16% / 0.5)',
  borderRadius: 12,
  color: 'hsl(38 25% 93%)',
  backdropFilter: 'blur(12px)',
};

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="glass-card p-5 mb-4">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
    <div className="h-52">{children}</div>
  </div>
);

const Reports = () => (
  <div className="relative min-h-screen bg-background pb-24">
    <div className="pointer-events-none absolute inset-0 ambient-glow" />
    <div className="relative z-10 px-5 pt-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          Reports & Analytics
        </h1>
      </motion.div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="w-full glass-card p-1 rounded-xl">
          <TabsTrigger value="daily" className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1 rounded-lg text-xs font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4 space-y-4">
          <ChartCard title="Stress & Fatigue Trends">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demoDaily}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 18% 16% / 0.4)" />
                <XAxis dataKey="day" stroke="hsl(32 12% 50%)" fontSize={11} />
                <YAxis stroke="hsl(32 12% 50%)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="stress" stroke="hsl(32 95% 52%)" fill="hsl(32 95% 52% / 0.15)" strokeWidth={2} />
                <Area type="monotone" dataKey="fatigue" stroke="hsl(24 85% 48%)" fill="hsl(24 85% 48% / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Sleep Pattern">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demoDaily}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 18% 16% / 0.4)" />
                <XAxis dataKey="day" stroke="hsl(32 12% 50%)" fontSize={11} />
                <YAxis stroke="hsl(32 12% 50%)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="sleep" fill="hsl(32 95% 52%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <ChartCard title="Weekly Burnout Risk">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demoWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 18% 16% / 0.4)" />
                <XAxis dataKey="week" stroke="hsl(32 12% 50%)" fontSize={11} />
                <YAxis stroke="hsl(32 12% 50%)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="burnoutRisk" fill="hsl(24 85% 48%)" radius={[6, 6, 0, 0]} />
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
