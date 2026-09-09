import { ArrowRight, Database, FileSearch, LineChart, ShieldCheck, Sparkles, Target, TrendingDown } from 'lucide-react';
import Footer from '@/components/Footer';

interface LandingPageProps {
  onNavigate: (page: 'input' | 'history') => void;
}

const capabilities = [
  { icon: FileSearch, title: 'Deconstruct assumptions', text: 'Turn a complex decision into the specific beliefs that need to be true.' },
  { icon: Database, title: 'Find historical analogues', text: 'Surface failure mechanisms and comparable company contexts from evidence.' },
  { icon: LineChart, title: 'Stress-test the numbers', text: 'Model contribution margins, burn, runway, and break-even before you scale.' },
  { icon: Target, title: 'Build a validation plan', text: 'Get practical experiments that convert uncertainty into evidence.' },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen pt-16">
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-3xl" />
            <div className="absolute top-64 -right-48 h-[400px] w-[400px] rounded-full bg-violet-500/[0.05] blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-28 lg:pt-36 lg:pb-40">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-sm text-cyan-300 mb-8">
                <Sparkles className="h-4 w-4" />
                <span>Decision intelligence for leaders</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.08] text-white">
                Stress-test your decisions{' '}
                <span className="gradient-text">before you commit.</span>
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-lg sm:text-xl leading-relaxed text-slate-400">
                Break down critical assumptions, uncover historical failure patterns, test financial resilience, and identify what to validate before scaling.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => onNavigate('input')} className="btn-primary text-base px-7 py-3.5">
                  Run a Stress Test <ArrowRight className="h-5 w-5" />
                </button>
                <button onClick={() => onNavigate('history')} className="btn-ghost text-base px-7 py-3.5">
                  View past analyses
                </button>
              </div>
            </div>

            <div className="relative mx-auto mt-20 max-w-5xl animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-transparent to-violet-500/10 blur-2xl" />
              <div className="relative glass-card p-2 shadow-2xl shadow-black/30">
                <div className="rounded-xl bg-navy-900/80 border border-white/[0.04] overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.05]">
                    <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400/70" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" /></div>
                    <span className="ml-3 text-xs text-slate-600 font-mono">analysis / decision-001</span>
                  </div>
                  <div className="grid md:grid-cols-[1.3fr_1fr] gap-0">
                    <div className="p-7 sm:p-9 border-b md:border-b-0 md:border-r border-white/[0.05]">
                      <div className="section-label mb-3">Decision under review</div>
                      <h3 className="font-display text-xl sm:text-2xl font-medium leading-snug text-white">Scale on-demand grocery delivery to 5 new cities with heavy promotional subsidies</h3>
                      <div className="mt-8 flex items-center gap-2 text-sm text-slate-500"><div className="h-2 w-2 rounded-full bg-red-400" /> 5 critical assumptions require validation</div>
                    </div>
                    <div className="p-7 sm:p-9 bg-white/[0.015]">
                      <div className="section-label mb-5">Evidence coverage</div>
                      <div className="flex items-center gap-4"><div className="relative flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-red-400/20 border-t-red-400"><span className="font-display text-xl font-semibold text-white">0%</span></div><div><div className="text-sm font-medium text-white">Direct evidence</div><div className="text-sm text-slate-500 mt-1">0 of 5 assumptions supported</div></div></div>
                      <div className="mt-7 h-px bg-white/[0.06]" />
                      <div className="mt-5 flex items-center justify-between"><span className="text-sm text-slate-500">Financial warning</span><span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs text-red-400"><TrendingDown className="h-3 w-3" /> Negative operating profit</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.05] bg-white/[0.015]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
            <div className="max-w-2xl mb-12"><div className="section-label mb-4">From intuition to evidence</div><h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">Make the invisible risks visible.</h2><p className="mt-4 text-slate-400 leading-relaxed">Veritas gives your most consequential decisions the scrutiny they deserve — before time, money, and momentum make them harder to reverse.</p></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{capabilities.map(({ icon: Icon, title, text }, index) => <div key={title} className="glass-card-hover p-6 group" style={{ animationDelay: `${index * 100}ms` }}><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/[0.08] border border-cyan-400/10 text-cyan-400 group-hover:bg-cyan-400/15 transition-colors"><Icon className="h-5 w-5" /></div><h3 className="mt-5 font-display text-base font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p></div>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="glass-card relative overflow-hidden p-8 sm:p-12 lg:p-16 text-center"><div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-48 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" /><ShieldCheck className="mx-auto h-8 w-8 text-cyan-400" /><h2 className="mt-5 font-display text-3xl sm:text-4xl font-semibold text-white">The cost of being wrong is compounding.</h2><p className="mx-auto mt-4 max-w-xl text-slate-400">A 15-minute stress test can expose the assumption that would otherwise cost you 15 months.</p><button onClick={() => onNavigate('input')} className="btn-primary mt-8">Start your analysis <ArrowRight className="h-4 w-4" /></button></div>
        </section>
      </main>
      <Footer onNavigate={() => onNavigate('input')} />
    </div>
  );
}
