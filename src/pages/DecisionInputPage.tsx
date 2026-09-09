import { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, CircleHelp, DollarSign, FileText, Lightbulb, SlidersHorizontal } from 'lucide-react';
import type { FinancialInputs } from '@/types';
import { defaultFinancialInputs } from '@/data/mockData';

interface DecisionInputPageProps {
  onBack: () => void;
  onAnalyze: (decision: string, financials: FinancialInputs) => void;
}

const financialFields: { key: keyof FinancialInputs; label: string; suffix: string; help: string }[] = [
  { key: 'monthlyOrders', label: 'Monthly orders', suffix: 'orders', help: 'Expected orders per month at scale' },
  { key: 'revenuePerOrder', label: 'Revenue per order', suffix: '$ / order', help: 'Average gross revenue per order' },
  { key: 'variableCostPerOrder', label: 'Variable cost per order', suffix: '$ / order', help: 'Product or service cost per order' },
  { key: 'promoSubsidy', label: 'Promo subsidy', suffix: '$ / order', help: 'Discount or subsidy paid per order' },
  { key: 'deliveryCost', label: 'Delivery cost', suffix: '$ / order', help: 'Fulfillment and last-mile delivery cost' },
  { key: 'fixedCost', label: 'Fixed cost', suffix: '$ / month', help: 'Monthly operating costs excluding variable costs' },
  { key: 'driverCost', label: 'Driver cost', suffix: '$ / month', help: 'Monthly driver or workforce costs' },
  { key: 'cashBalance', label: 'Cash balance', suffix: '$', help: 'Available cash for funding operations' },
];

export default function DecisionInputPage({ onBack, onAnalyze }: DecisionInputPageProps) {
  const [decision, setDecision] = useState('Scale on-demand grocery delivery to 5 new cities with heavy promotional subsidies');
  const [financials, setFinancials] = useState<FinancialInputs>(defaultFinancialInputs);
  const [showFinancials, setShowFinancials] = useState(true);

  const updateFinancial = (key: keyof FinancialInputs, value: string) => {
    const numericValue = Number(value.replace(/,/g, '')) || 0;
    setFinancials((current) => ({ ...current, [key]: numericValue }));
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-8"><ArrowLeft className="h-4 w-4" /> Back to home</button>
        <div className="mb-10"><div className="section-label mb-4">New stress test</div><h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white">What decision are you considering?</h1><p className="mt-4 text-lg text-slate-400">Be as specific as possible. Include the action, scope, timing, and the outcome you expect.</p></div>
        <div className="space-y-5">
          <div className="glass-card p-6 sm:p-8"><div className="flex items-center gap-3 mb-5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400"><FileText className="h-4.5 w-4.5" /></div><div><h2 className="font-display text-base font-semibold text-white">Decision statement</h2><p className="text-sm text-slate-500">Describe the decision you want to stress-test</p></div></div><textarea value={decision} onChange={(event) => setDecision(event.target.value)} rows={5} className="input-field resize-none text-base leading-relaxed" placeholder="For example: We will expand our B2B SaaS product into the European market within the next 6 months..." /><div className="mt-3 flex items-start gap-2 text-xs text-slate-600"><CircleHelp className="h-3.5 w-3.5 shrink-0 mt-0.5" /> The clearer your decision, the more precise the assumptions and evidence will be.</div></div>
          <div className="glass-card overflow-hidden"><button onClick={() => setShowFinancials((current) => !current)} className="flex w-full items-center justify-between p-6 sm:px-8 hover:bg-white/[0.02] transition-colors"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300"><DollarSign className="h-4.5 w-4.5" /></div><div className="text-left"><h2 className="font-display text-base font-semibold text-white">Financial inputs <span className="ml-2 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-500">Optional</span></h2><p className="text-sm text-slate-500">Add numbers to run a financial stress test</p></div></div>{showFinancials ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}</button>{showFinancials && <div className="border-t border-white/[0.05] px-6 pb-7 pt-6 sm:px-8"><div className="grid sm:grid-cols-2 gap-x-5 gap-y-5">{financialFields.map(({ key, label, suffix, help }) => <label key={key} className="block"><span className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-slate-300">{label}</span><span className="text-[11px] text-slate-600">{suffix}</span></span><span className="relative block"><input type="text" value={financials[key].toLocaleString('en-US')} onChange={(event) => updateFinancial(key, event.target.value)} className="input-field pr-10" /><SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 pointer-events-none" /></span><span className="mt-1.5 block text-xs text-slate-600">{help}</span></label>)}</div><div className="mt-7 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4 flex items-start gap-3"><Lightbulb className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" /><p className="text-xs leading-relaxed text-slate-400">Financial stress testing is most useful when inputs reflect your current operating reality, not your target state.</p></div></div>}</div>
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-3"><p className="text-xs text-slate-600">Analysis typically takes 2–4 minutes</p><button onClick={() => onAnalyze(decision, financials)} disabled={!decision.trim()} className="btn-primary w-full sm:w-auto px-8 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">Analyze Decision <ArrowRight className="h-4 w-4" /></button></div>
        </div>
      </main>
    </div>
  );
}
