import { mockAnalysisResult } from '@/data/mockData';
import EvidenceCoverage from '@/components/EvidenceCoverage';
import Reveal from '@/components/Reveal';
import { ArrowRight, BriefcaseBusiness, Clock3, Cpu, History, LineChart, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react';
import Footer from '@/components/Footer';
import HomeFAQ from '@/components/HomeFAQ';
import RotatingDecisionWord from '@/components/RotatingDecisionWord';

interface LandingPageProps {
  onNavigate: (page: 'input' | 'history') => void;
  onViewDemo: () => void;
}

const capabilities = [
  {
    icon: Cpu,
    title: 'AI assumption analysis',
    text: 'Uncover the assumptions behind your business decision and identify which ones need stronger evidence.',
  },
  {
    icon: History,
    title: 'Learn from business failures',
    text: 'Explore similar companies and past failures to understand what could go wrong with your strategy.',
  },
  {
    icon: LineChart,
    title: 'Financial stress testing',
    text: 'Use your business inputs to assess margins, cash burn, runway, and what it takes to break even.',
  },
  {
    icon: ShieldCheck,
    title: 'Validate before you commit',
    text: 'Turn analysis into practical experiments to test critical assumptions before investing or scaling.',
  },
];

const productTags = [
  { icon: Sparkles, label: 'AI-Powered', color: 'border-violet-400/30 bg-violet-400/10 text-violet-200' },
  { icon: Clock3, label: 'On-Demand Analysis', color: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200' },
  { icon: BriefcaseBusiness, label: 'Built for Business Decisions', color: 'border-amber-400/30 bg-amber-400/10 text-amber-200' },
];

export default function LandingPage({ onNavigate, onViewDemo }: LandingPageProps) {
  const total = mockAnalysisResult.assumptions.length;
  const supported = mockAnalysisResult.assumptions.filter((item) => item.assessment === 'Well Supported').length;
  return (
    <div className="min-h-screen pt-16">
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-3xl" />
            <div className="absolute top-64 -right-48 h-[400px] w-[400px] rounded-full bg-violet-500/[0.05] blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-14 lg:pt-16 lg:pb-16">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
              <ul aria-label="About Veritas" className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {productTags.map(({ icon: Icon, label, color }) => (
                  <li key={label} className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm ${color}`}>
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
              <h1 className="font-display text-[clamp(1rem,5vw,3.75rem)] font-semibold tracking-tight leading-[1.15] text-white">
                <span className="sr-only">Explore your next investment, before reality does.</span>
                <span aria-hidden="true">
                  <span className="block whitespace-nowrap">Explore your next{' '}<RotatingDecisionWord /></span>
                  <span className="block">before reality does.</span>
                </span>
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-lg sm:text-xl leading-relaxed text-slate-200">
                Break down critical assumptions, uncover historical failure patterns, test financial resilience, and identify what to validate before scaling.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => onNavigate('input')} className="btn-primary text-base px-7 py-3.5">
                  Explore my decision <ArrowRight className="h-5 w-5" />
                </button>
                <button onClick={() => onNavigate('history')} className="btn-ghost text-base px-7 py-3.5">
                  Browse reports
                </button>
              </div>
            </div>

            <div className="relative mx-auto mt-12 max-w-5xl animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="overflow-hidden rounded-xl border border-slate-400/25 bg-[#132036] shadow-lg shadow-black/10">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 px-7 py-5 sm:px-9 border-b border-slate-400/20">
                    <h2 className="text-sm font-semibold text-slate-200">Inside a Veritas report</h2>
                    <div className="flex flex-wrap items-center gap-3"><span className="text-xs text-slate-300">Illustrative demo</span><button type="button" onClick={onViewDemo} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-300/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">View demo report <ArrowRight aria-hidden="true" className="h-4 w-4" /></button></div>
                  </div>
                  <div className="grid md:grid-cols-[1.3fr_1fr] gap-0">
                    <div className="p-7 sm:p-9 border-b md:border-b-0 md:border-r border-slate-400/20">
                      <div className="section-label mb-3">Decision under review</div>
                      <h3 className="text-xl sm:text-2xl font-semibold leading-snug text-white">Expand grocery delivery to five new cities</h3>
                      <p className="mt-4 text-sm leading-relaxed text-slate-300">Proposed approach: use heavy promotional subsidies to acquire customers in each new market.</p>
                      <div className="mt-8 flex items-center gap-2 text-sm text-slate-400"><div className="h-2 w-2 rounded-full bg-red-400" /> {total - supported} assumptions still need validation</div>
                    </div>
                    <div className="p-7 sm:p-9 bg-[#1b2b44]">
                      <div className="section-label mb-5">Evidence coverage</div>
                      <div className="flex items-center gap-4"><EvidenceCoverage supported={supported} total={total} /><div><div className="text-sm font-medium text-white">Direct evidence</div><div className="text-sm text-slate-400 mt-1">{supported} of {total} assumptions supported</div></div></div>
                      <div className="mt-7 h-px bg-white/[0.12]" />
                      <div className="mt-5 flex items-center justify-between"><span className="text-sm text-slate-400">Financial warning</span><span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs text-red-400"><TrendingDown className="h-3 w-3" /> Negative operating profit</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Reveal><section className="report-paper border-y border-white/10 bg-[#edf1ee] text-[#142238]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20 lg:px-8 lg:py-16">
            <div>
              <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800"><span className="h-px w-8 bg-teal-700" /> Beyond a gut feeling</div>
              <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">A clearer view.<br /><span className="text-teal-700">A better next step.</span></h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600">Big decisions rarely come with complete information. Veritas helps you see what holds up, what could fail, and what to test next.</p>
              <button onClick={() => onNavigate('input')} className="mt-7 inline-flex items-center gap-3 border-b border-teal-700 pb-2 text-sm font-semibold text-teal-800 transition-colors hover:text-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700">Take a closer look <ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="divide-y divide-slate-300">
              {capabilities.map(({ icon: Icon, title, text }, index) => (
                <div key={title} style={{ animationDelay: `${index * 90}ms` }} className="feature-reveal group grid grid-cols-[2rem_1fr] gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[2rem_1fr_3rem]">
                  <span className="pt-1 font-mono text-sm text-teal-700">0{index + 1}</span>
                  <div><h3 className="font-display text-xl font-semibold">{title}</h3><p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">{text}</p></div>
                  <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-teal-800/20 text-teal-700 transition-colors group-hover:bg-teal-700 group-hover:text-white sm:flex"><Icon className="h-5 w-5" /></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </Reveal><Reveal><section aria-labelledby="start-analysis-heading" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="glass-card flex flex-col gap-6 border-l-4 border-l-cyan-400 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <h2 id="start-analysis-heading" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">Put your next decision to the test.</h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">Describe your plan and uncover what needs validating before you commit.</p>
            </div>
            <button onClick={() => onNavigate('input')} className="btn-primary w-full sm:w-auto sm:self-start lg:self-center shrink-0">
              Start your analysis <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </section>
      </Reveal>
        <HomeFAQ />
      </main>
      <Footer />
    </div>
  );
}
