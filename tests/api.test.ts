import { describe, expect, it, vi } from 'vitest';
import { createAnalysis, getAnalysis, listAnalyses, ApiError } from '../src/api/analyses';

describe('analysis API client', () => {
  it('sends the actual decision, supports absent financial inputs and cursor encoding', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'job', status: 'queued' })));
    vi.stubGlobal('fetch', fetch);
    await createAnalysis({ decision: 'Expand to a new city' });
    expect(fetch.mock.calls[0][0]).toBe('/api/v1/analyses');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ decision: 'Expand to a new city' });
    fetch.mockResolvedValueOnce(new Response(JSON.stringify({ items: [], nextCursor: null })));
    await listAnalyses('a+b=');
    expect(fetch.mock.calls[1][0]).toContain('cursor=a%2Bb%3D');
  });
  it('preserves typed errors and distinguishes network failures', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { code: 'ANALYSIS_NOT_FOUND', message: 'Not found' } }), { status: 404 }));
    vi.stubGlobal('fetch', fetch);
    await expect(getAnalysis('missing')).rejects.toMatchObject({ code: 'ANALYSIS_NOT_FOUND', status: 404 });
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(getAnalysis('job')).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  });
  it('aborts an active fetch when its owner unmounts', async () => {
    vi.stubGlobal('fetch', vi.fn((_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    })));
    const controller = new AbortController();
    const pending = getAnalysis('job', controller.signal);
    controller.abort();
    await expect(pending).rejects.not.toBeInstanceOf(ApiError);
  });
});
