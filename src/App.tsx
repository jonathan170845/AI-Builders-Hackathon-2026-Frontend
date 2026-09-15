import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import LandingPage from '@/pages/LandingPage';
import DecisionInputPage from '@/pages/DecisionInputPage';
import ProcessingPage from '@/pages/ProcessingPage';
import ResultsPage from '@/pages/ResultsPage';
import HistoryPage from '@/pages/HistoryPage';
import { mockAnalysisResult } from '@/data/mockData';
import { createAnalysis, errorMessage } from '@/api/analyses';
import type { FinancialInputs, Page } from '@/types';

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submission = useRef<AbortController | null>(null);
  const navigatePath = useCallback((next: string) => {
    window.history.pushState(null, '', next);
    setPath(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  useEffect(() => {
    const pop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', pop);
    return () => { window.removeEventListener('popstate', pop); submission.current?.abort(); };
  }, []);
  useEffect(() => {
    if (path !== '/new') { submission.current?.abort(); submission.current = null; setSubmitting(false); }
  }, [path]);
  const navigate = (page: Page) => navigatePath(page === 'input' ? '/new' : page === 'history' ? '/history' : '/');
  const analysisId = path.startsWith('/analyses/') ? path.slice('/analyses/'.length) : null;
  const currentPage: Page = analysisId ? 'processing' : path === '/new' ? 'input' : path === '/history' ? 'history' : path === '/demo' ? 'results' : 'landing';
  const handleAnalyze = async (decision: string, financials?: FinancialInputs) => {
    if (submission.current) return;
    const controller = new AbortController();
    submission.current = controller;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const accepted = await createAnalysis({ decision: decision.trim(), ...(financials ? { financialInputs: financials } : {}) }, controller.signal);
      if (!controller.signal.aborted) navigatePath(`/analyses/${accepted.id}`);
    } catch (error) {
      if (!controller.signal.aborted) setSubmitError(errorMessage(error));
    } finally {
      if (submission.current === controller) { submission.current = null; setSubmitting(false); }
    }
  };
  return <div className="min-h-screen">
    <Navbar currentPage={currentPage} onNavigate={navigate} />
    {analysisId ? <ProcessingPage key={analysisId} analysisId={analysisId} onBack={() => navigatePath('/history')} onRetry={() => navigatePath('/new')} /> :
      path === '/new' ? <DecisionInputPage onBack={() => navigatePath('/')} onAnalyze={handleAnalyze} submitting={submitting} error={submitError} /> :
      path === '/history' ? <HistoryPage onViewAnalysis={(id) => navigatePath(`/analyses/${id}`)} onNewAnalysis={() => navigatePath('/new')} /> :
      path === '/demo' ? <ResultsPage result={mockAnalysisResult} demo backLabel="Back to home" onBack={() => navigatePath('/')} /> :
      path === '/' ? <LandingPage onNavigate={navigate} onViewDemo={() => navigatePath('/demo')} /> :
      <main className="pt-32 px-8"><h1 className="text-2xl text-white">Page not found</h1><button className="btn-primary mt-5" onClick={() => navigatePath('/')}>Back to home</button></main>}
  </div>;
}
export default App;
