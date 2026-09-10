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

  return (
    <div className="min-h-screen pt-28 pb-10 px-4">
      <main className="mx-auto w-full max-w-2xl text-center animate-fade-in-up motion-reduce:animate-none">
        <div className="mx-auto flex items-center justify-center gap-5 sm:gap-7">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center sm:h-36 sm:w-36">
            <div className="absolute inset-1 rounded-full border border-cyan-400/25 motion-safe:animate-pulse" />
            <svg viewBox="0 0 144 144" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="72" cy="72" r="64" fill="none" stroke="rgba(148,163,184,0.25)" strokeWidth="5" />
              <circle cx="72" cy="72" r="64" fill="none" stroke="#67e8f9" strokeWidth="5" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress} className="transition-all duration-700 motion-reduce:transition-none" />
            </svg>
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/20 bg-[#142238] shadow-lg sm:h-28 sm:w-28">
              <ShieldCheck aria-hidden="true" className="h-12 w-12 text-cyan-300 sm:h-14 sm:w-14" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-left">
            <div className="text-3xl font-semibold tabular-nums text-white sm:text-4xl">{Math.round(progress)}%</div>
            <p className="mt-1 text-sm font-medium text-cyan-200">Analysis progress</p>
            <p className="mt-2 text-sm text-slate-200">{activeStep} of {steps.length} steps complete</p>
          </div>
        </div>
        <div className="mt-6">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white">Putting your decision under pressure.</h1>
          <p className="mt-3 text-base leading-relaxed text-slate-200">We’re reviewing your assumptions, business context, and financial inputs. Keep this tab open to see the results.</p>
        </div>
        <div className="mt-7 glass-card p-5 sm:p-7 text-left">
          <div className="flex items-center justify-between gap-3 mb-5">
            <span className="text-base font-semibold text-white">Analysis pipeline</span>
            <span className="text-sm text-cyan-200">{activeStep >= steps.length ? 'Ready' : 'In progress'}</span>
          </div>
          <div role="progressbar" aria-label="Analysis progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-700 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-5 space-y-2">
            {steps.map((step, index) => (
              <div key={step} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${index === activeStep ? 'border border-cyan-400/25 bg-cyan-400/10 text-white' : 'border border-transparent text-slate-200'}`}>
                {index < activeStep ? <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-emerald-300" /> : index === activeStep ? <Loader2 aria-hidden="true" className="h-5 w-5 shrink-0 text-cyan-300 motion-safe:animate-spin" /> : <Circle aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400" />}
                <span className="text-sm sm:text-base">{step}</span>
                {index < activeStep && <span className="ml-auto text-xs sm:text-sm text-emerald-200">Complete</span>}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-slate-200">Your results will appear automatically when the analysis is complete.</p>
      </main>
    </div>
  );
}