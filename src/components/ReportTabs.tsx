type Tab = 'overview' | 'context' | 'sources';
const tabs: Tab[] = ['overview', 'context', 'sources'];

export default function ReportTabs({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <div aria-label="Report sections" className="relative isolate grid w-full max-w-[310px] shrink-0 grid-cols-3 rounded-xl border border-slate-400/30 bg-[#102037] p-1.5">
      <span aria-hidden="true" className="absolute bottom-1.5 left-1.5 top-1.5 -z-10 rounded-lg bg-[#355473] shadow-sm transition-transform duration-200 motion-reduce:transition-none" style={{ width: 'calc((100% - 12px) / 3)', transform: `translateX(${tabs.indexOf(active) * 100}%)` }} />
      {tabs.map((tab) => <button key={tab} type="button" aria-pressed={tab === active} onClick={() => onChange(tab)} className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 ${active === tab ? 'text-white' : 'text-slate-300 hover:text-white'}`}>{tab}</button>)}
    </div>
  );
}
