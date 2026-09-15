import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import ProcessingPage from '../src/pages/ProcessingPage';
import HistoryPage from '../src/pages/HistoryPage';
import ResultsPage from '../src/pages/ResultsPage';
import App from '../src/App';
import { mockAnalysisResult } from '../src/data/mockData';

const base = { id: '11111111-1111-4111-8111-111111111111', createdAt: '2026-09-11T00:00:00Z', updatedAt: '2026-09-11T00:00:00Z' };
const result = { ...mockAnalysisResult, id: base.id, decisionTitle: 'Actual API report', financialResults: null, financialWarnings: [], idxBenchmarks: [] };
function responses(...bodies: unknown[]) {
  const fetch = vi.fn();
  for (const body of bodies) fetch.mockResolvedValueOnce(new Response(JSON.stringify(body)));
  vi.stubGlobal('fetch', fetch);
  return fetch;
}
it('polls queued â†’ processing â†’ completed and displays the backend report', async () => {
  vi.useFakeTimers();
  const fetch = responses({ ...base, status: 'queued', stage: 'queued' }, { ...base, status: 'processing', stage: 'reviewing_evidence' }, { ...base, status: 'completed', stage: null, result });
  const view = render(<ProcessingPage analysisId={base.id} onBack={vi.fn()} onRetry={vi.fn()} />);
  await act(async () => { await vi.advanceTimersByTimeAsync(0); });
  expect(screen.getByText('Queued')).toBeInTheDocument();
  await act(async () => { await vi.advanceTimersByTimeAsync(1150); });
  expect(screen.getByText('Processing')).toBeInTheDocument();
  await act(async () => { await vi.advanceTimersByTimeAsync(1500); });
  expect(screen.getByText('Actual API report')).toBeInTheDocument();
  expect(screen.getAllByText('Financial inputs were not provided.').length).toBeGreaterThan(0);
  await act(async () => { await vi.advanceTimersByTimeAsync(10000); });
  expect(fetch).toHaveBeenCalledTimes(3);
  view.unmount();
});
it('shows a terminal error and offers a new analysis', async () => {
  responses({ ...base, status: 'failed', stage: 'retrieving_evidence', error: { code: 'RETRIEVAL_FAILED', message: 'Evidence retrieval failed' } });
  const retry = vi.fn();
  render(<ProcessingPage analysisId={base.id} onBack={vi.fn()} onRetry={retry} />);
  expect(await screen.findByText('Evidence retrieval failed')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Try a new analysis'));
  expect(retry).toHaveBeenCalledOnce();
});
it('reconnects after a polling network failure without creating another job', async () => {
  const fetch = vi.fn().mockRejectedValueOnce(new TypeError('offline')).mockResolvedValueOnce(new Response(JSON.stringify({ ...base, status: 'completed', stage: null, result })));
  vi.stubGlobal('fetch', fetch);
  render(<ProcessingPage analysisId={base.id} onBack={vi.fn()} onRetry={vi.fn()} />);
  await screen.findByText('Your job may still be running.');
  fireEvent.click(screen.getByText('Reconnect'));
  expect(await screen.findByText('Actual API report')).toBeInTheDocument();
  expect(fetch.mock.calls.every(([, init]) => !init.method)).toBe(true);
});
it('history opens the selected ID and supports loading another page', async () => {
  responses({ items: [{ ...base, decision: 'First decision', status: 'completed', assumptionCount: 3, financialWarningCount: 0 }], nextCursor: 'next' }, { items: [{ ...base, id: 'second', decision: 'Second decision', status: 'failed', assumptionCount: 0, financialWarningCount: 0 }], nextCursor: null });
  const open = vi.fn();
  render(<HistoryPage onViewAnalysis={open} onNewAnalysis={vi.fn()} />);
  fireEvent.click(await screen.findByText('View report'));
  expect(open).toHaveBeenCalledWith(base.id);
  fireEvent.click(screen.getByText('Load more'));
  fireEvent.click(await screen.findByText('View error'));
  expect(open).toHaveBeenLastCalledWith('second');
  await waitFor(() => expect(screen.queryByText('Load more')).not.toBeInTheDocument());
});
it('shows backend warnings, nullable metrics and unavailable source links safely', () => {
  render(<ResultsPage result={{ ...result, financialResults: { contributionMargin: 10, contributionMarginPct: 20, operatingProfit: 10, monthlyBurn: 0, runwayMonths: null, breakEvenOrders: null }, sources: [{ id: 's', title: 'Historical source', type: 'Case Study', year: null, url: 'javascript:alert(1)' }] }} onBack={vi.fn()} />);
  expect(screen.queryByText('Negative Operating Profit')).not.toBeInTheDocument();
  expect(screen.getAllByText('N/A').length).toBe(2);
  fireEvent.click(screen.getByText('sources'));
  expect(screen.getByText('URL unavailable')).toBeInTheDocument();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});

it('a direct analysis URL restores its report on application mount', async () => {
  window.history.replaceState(null, '', `/analyses/${base.id}`);
  vi.stubGlobal('scrollTo', vi.fn());
  const fetch = responses({ ...base, status: 'completed', stage: null, result });
  render(<App />);
  expect(await screen.findByText('Actual API report')).toBeInTheDocument();
  expect(fetch.mock.calls[0][0]).toBe(`/api/v1/analyses/${base.id}`);
  window.history.replaceState(null, '', '/');
});
it('leaving the processing page aborts a pending request', async () => {
  let signal: AbortSignal | undefined;
  vi.stubGlobal('fetch', vi.fn((_url, init) => {
    signal = init.signal;
    return new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
  }));
  const view = render(<ProcessingPage analysisId={base.id} onBack={vi.fn()} onRetry={vi.fn()} />);
  expect(signal?.aborted).toBe(false);
  view.unmount();
  expect(signal?.aborted).toBe(true);
});
