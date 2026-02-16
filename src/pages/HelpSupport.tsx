import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { HelpCircle, Mail, ExternalLink } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const faqs = [
  { q: 'How does MindGuard detect burnout?', a: 'MindGuard uses AI to analyze your daily check-in data including stress levels, sleep patterns, and work hours to predict burnout risk.' },
  { q: 'Is my data secure?', a: 'Yes! All data is encrypted and stored securely. We never share your personal information with third parties.' },
  { q: 'How often should I check in?', a: 'We recommend daily check-ins for the most accurate predictions. Even a quick 2-minute check-in helps build better insights.' },
  { q: 'Can I use this at work?', a: 'Absolutely! MindGuard is designed for both students and employees. Select your role during onboarding for personalized insights.' },
  { q: 'What do the risk levels mean?', a: 'Low (green) means you\'re in a healthy range. Moderate (yellow) suggests some attention needed. High (red) indicates you should take immediate steps to reduce stress.' },
];

const HelpSupport = () => {
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  return (
    <div className="relative min-h-screen bg-background pb-24">
      <div className="pointer-events-none absolute inset-0 ambient-glow" />
      <div className="relative z-10 px-5 pt-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <h1 className="font-display text-2xl font-bold flex items-center gap-2"><HelpCircle className="h-6 w-6 text-primary" /> Help & Support</h1>
        </motion.div>

        <div className="glass-card p-4 mb-6">
          <h2 className="font-semibold mb-3">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="glass-card p-4 mb-6">
          <h2 className="font-semibold mb-3">Send Feedback</h2>
          <textarea className="input-glass w-full min-h-[100px] resize-none mb-3" value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Tell us what you think..." />
          <button onClick={() => { toast({ title: 'Thank you!', description: 'Your feedback has been submitted.' }); setFeedback(''); }} className="pill-button-primary w-full" disabled={!feedback.trim()}>
            Send Feedback
          </button>
        </div>

        <div className="glass-card p-4 space-y-3">
          <h2 className="font-semibold">Resources</h2>
          {[
            { label: 'Mental Health Helpline', url: 'https://www.who.int/health-topics/mental-health' },
            { label: 'Stress Management Tips', url: 'https://www.mind.org.uk/information-support/' },
          ].map(({ label, url }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <ExternalLink className="h-4 w-4" /> {label}
            </a>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default HelpSupport;
