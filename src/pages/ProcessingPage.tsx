import { useEffect, useState } from 'react';
import { Check, Circle, Loader2 } from 'lucide-react';
import { ApiError, errorMessage, getAnalysis } from '@/api/analyses';
import type { AnalysisDetail, AnalysisStage } from '@/api/analyses';
import ResultsPage from '@/pages/ResultsPage';

const steps: [AnalysisStage, string][] = [
  ['queued', 'Waiting for an available worker'],
  ['extracting_assumptions', 'Extracting assumptions'],
  ['retrieving_evidence', 'Finding historical evidence and company context'],
  ['calculating_financials', 'Running financial stress test'],
  ['reviewing_evidence', 'Reviewing evidence'],
  ['building_report', 'Building report'],
];
export default function ProcessingPage({ analysisId, onBack, onRetry }: { analysisId: string; onBack: () => void; onRetry: () => void }) {
  const [detail, setDetail] = useState<AnalysisDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let delay = 1000;
    setError(null);
    const poll = async () => {
      try {
        const next = await getAnalysis(analysisId, controller.signal);
        if (controller.signal.aborted) return;
        setDetail(next);
        setError(null);
        if (next.status === 'completed' || next.status === 'failed') return;
      } catch (reason) {
        if (controller.signal.aborted) return;
        setError(errorMessage(reason));
        if (reason instanceof ApiError && reason.status >= 400 && reason.status < 500) return;
      }
      if (!controller.signal.aborted) {
        timer = setTimeout(poll, Math.min(5000, delay * (0.9 + Math.random() * 0.2)));
        delay = Math.min(5000, delay * 1.3);
      }
    };
    void poll();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [analysisId, attempt]);
  if (detail?.status === 'completed') return <ResultsPage result={detail.result} onBack={onBack} />;
  const failed = detail?.status === 'failed';
  const active = detail ? steps.findIndex(([stage]) => stage === detail.stage) : -1;
  return <div className="min-h-screen pt-28 pb-20 px-4"><main className="mx-auto max-w-2xl">
    <button className="back-button mb-8" onClick={onBack}>Back to history</button>
    <h1 className="font-display text-3xl text-white">{failed ? 'Analysis could not be completed' : 'Putting your decision under pressure.'}</h1>
    <p className="mt-4 text-slate-300">You can reopen this page using its URL. Progress comes from the backend.</p>
    {error && <div role="alert" className="glass-card p-5 mt-6 text-amber-200"><p>{error}</p><p className="mt-2">Your job may still be running.</p><button className="btn-secondary mt-4" onClick={() => setAttempt((value) => value + 1)}>Reconnect</button></div>}
    {failed ? <div role="alert" className="glass-card p-6 mt-6"><p className="text-red-200">{detail.error.message}</p><p className="mt-2 text-sm text-slate-400">{detail.error.code}</p><button className="btn-primary mt-5" onClick={onRetry}>Try a new analysis</button></div> : <div className="glass-card p-6 mt-7" aria-live="polite">
      <p className="mb-4 text-cyan-200">{detail ? (detail.status === 'queued' ? 'Queued' : 'Processing') : 'Loading analysis'}</p>
      {steps.map(([stage, label], index) => <div key={stage} className={`flex gap-3 items-center p-3 ${index === active ? 'text-cyan-200' : 'text-slate-300'}`}>
        {index < active ? <Check className="w-5 h-5 text-emerald-300" /> : index === active ? <Loader2 className="w-5 h-5 motion-safe:animate-spin" /> : <Circle className="w-5 h-5" />}<span>{label}</span>
      </div>)}
    </div>}
  </main></div>;
}
