import { ArrowDownRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import type { AnalysisResult } from '@/types';
import { formatAmount } from '@/utils/format';

export default function ReportOverview({ result }: { result: AnalysisResult }) {
  const gaps = result.assumptions.filter((item) => item.assessment !== 'Well Supported');
  const loss = (result.financialResults?.operatingProfit ?? 0) < 0;
  return (
    <section aria-labelledby="report-takeaway" className="mb-7 overflow-hidden rounded-2xl border border-slate-300 bg-[#edf1ee] text-[#142238]">
      <div className="grid lg:grid-cols-[1.5fr_1fr]">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-teal-800"><ShieldCheck className="h-4 w-4" /> The decision brief</div>
          <h2 id="report-takeaway" className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{gaps.length ? 'Start with what still needs proof.' : 'Review the evidence before your next step.'}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{gaps.length} of {result.assumptions.length} assumptions need further validation.{loss ? ' The current financial inputs also show an operating loss.' : ' Review the financial model alongside the supporting evidence.'}</p>
          {result.validationExperiments[0] && <div className="mt-5 border-l-2 border-teal-700 pl-4"><p className="text-xs font-semibold uppercase tracking-wider text-teal-800">A place to start</p><p className="mt-1 text-sm font-medium">{result.validationExperiments[0].title}</p><p className="mt-1 text-xs text-slate-600">Suggested experiment Â· {result.validationExperiments[0].timeToRun}</p></div>}
        </div>
        <div className="flex flex-col justify-center border-t border-slate-300 bg-[#dfe7e4] p-6 sm:p-8 lg:border-l lg:border-t-0">
          <span className="text-sm font-medium text-slate-600">Monthly operating result</span>
          <div className={`mt-3 flex items-center gap-3 font-display text-4xl font-semibold ${loss ? 'text-rose-800' : 'text-teal-800'}`}>{formatAmount(result.financialResults?.operatingProfit ?? null)}{loss ? <ArrowDownRight className="h-7 w-7" /> : <ArrowUpRight className="h-7 w-7" />}</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{result.financialResults ? 'Based on the financial inputs for this scenario. Explore the breakdown below.' : 'Financial inputs were not provided.'}</p>
        </div>
      </div>
    </section>
  );
}
