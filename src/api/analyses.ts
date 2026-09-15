import type { AnalysisAccepted, AnalysisCompleted, AnalysisFailed, AnalysisPending, AnalysisHistory, CreateAnalysisRequest } from './types.generated';
export type { AnalysisAccepted, AnalysisHistory, AnalysisHistoryItem, AnalysisStage, AnalysisStatus, CreateAnalysisRequest } from './types.generated';
export type AnalysisDetail = AnalysisPending | AnalysisCompleted | AnalysisFailed;

export class ApiError extends Error {
  constructor(public code: string, message: string, public status = 0) { super(message); }
}

const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  if (init.signal?.aborted) abort();
  init.signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => { timedOut = true; abort(); }, 20_000);
  try {
    const response = await fetch(`${baseUrl}${path}`, { ...init, signal: controller.signal });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new ApiError(body?.error?.code || 'HTTP_ERROR', body?.error?.message || 'The server could not complete this request.', response.status);
    if (body === null) throw new ApiError('INVALID_RESPONSE', 'The server returned an invalid response.');
    return body as T;
  } catch (error) {
    if (timedOut) throw new ApiError('TIMEOUT', 'The request timed out. Check history before submitting again.');
    if (controller.signal.aborted || error instanceof ApiError) throw error;
    throw new ApiError('NETWORK_ERROR', 'Cannot reach the backend. Check your connection and try again.');
  } finally {
    clearTimeout(timer);
    init.signal?.removeEventListener('abort', abort);
  }
}

export const createAnalysis = (payload: CreateAnalysisRequest, signal?: AbortSignal) => request<AnalysisAccepted>('/analyses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal });
export const getAnalysis = (id: string, signal?: AbortSignal) => request<AnalysisDetail>(`/analyses/${encodeURIComponent(id)}`, { signal });
export const listAnalyses = (cursor?: string, signal?: AbortSignal) => request<AnalysisHistory>(`/analyses${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`, { signal });

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'VALIDATION_ERROR') return 'Check your decision (10â€“5,000 characters) and financial values (nonnegative, orders whole, amounts up to four decimal places).';
    if (error.code === 'ANALYSIS_NOT_FOUND') return 'This analysis could not be found. Open history to choose another report.';
    if (error.code.endsWith('NOT_READY')) return 'The backend is not ready. Its database, model, or data still needs preparation.';
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
