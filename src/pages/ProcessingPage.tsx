import { useEffect, useState } from 'react';
import { Check, Circle, Loader2, ShieldCheck } from 'lucide-react';

interface ProcessingPageProps { onComplete: () => void; }

const steps = ['Extracting assumptions', 'Finding historical failure analogues', 'Finding similar companies', 'Running financial stress test', 'Reviewing evidence', 'Building validation plan'];

export default function ProcessingPage({ onComplete }: ProcessingPageProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveStep((current) => Math.min(current + 1, steps.length)), 950);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeStep >= steps.length) {
      const timer = window.setTimeout(onComplete, 650);
      return () => window.clearTimeout(timer);
    }
  }, [activeStep, onComplete]);

  const progress = Math.min((activeStep / steps.length) * 100, 100);

  return <div className="min-h-screen pt-16 flex items-center justify-center px-4"><main className="w-full max-w-xl py-20 text-center animate-fade-in-up"><div className="relative mx-auto flex h-24 w-24 items-center justify-center"><div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping" style={{ animationDuration: '2.5s' }} /><div className="absolute inset-2 rounded-full border border-cyan-400/30" /><div className="absolute inset-4 rounded-full bg-cyan-400/10 flex items-center justify-center"><ShieldCheck className="h-8 w-8 text-cyan-400" /></div></div><div className="mt-10"><div className="section-label mb-4">Analysis in progress</div><h1 className="font-display text-3xl sm:text-4xl font-semibold text-white">Putting your decision under pressure.</h1><p className="mt-4 text-slate-400">We’re examining your decision from every angle. You can leave this tab open.</p></div><div className="mt-12 glass-card p-6 sm:p-8 text-left"><div className="flex items-center justify-between mb-6"><span className="text-sm font-medium text-white">Analysis pipeline</span><span className="font-mono text-xs text-cyan-400">{Math.round(progress)}%</span></div><div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-400 transition-all duration-700" style={{ width: `${progress}%` }} /></div><div className="mt-7 space-y-4">{steps.map((step, index) => <div key={step} className={`flex items-center gap-3 transition-all duration-300 ${index > activeStep ? 'text-slate-600' : index === activeStep && activeStep < steps.length ? 'text-white' : 'text-slate-400'}`}>{index < activeStep ? <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400"><Check className="h-3 w-3" strokeWidth={3} /></div> : index === activeStep && activeStep < steps.length ? <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" /> : <Circle className="h-5 w-5 text-slate-700" />}<span className="text-sm">{step}</span>{index < activeStep && <span className="ml-auto text-xs text-emerald-400/70">Complete</span>}</div>)}</div></div><p className="mt-7 text-xs text-slate-600">Your analysis will be saved automatically to Analysis History.</p></main></div>;
}
