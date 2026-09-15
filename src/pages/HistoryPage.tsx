import { useEffect, useRef, useState } from 'react';

import {
  errorMessage,
  listAnalyses,
} from '@/api/analyses';

import type {
  AnalysisHistoryItem,
  AnalysisStatus,
} from '@/api/analyses';

const statusLabels: Record<AnalysisStatus, string> = {
  queued: 'Queued',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
};

interface HistoryPageProps {
  onViewAnalysis: (id: string) => void;
  onNewAnalysis: () => void;
}

export default function HistoryPage({
  onViewAnalysis,
  onNewAnalysis,
}: HistoryPageProps) {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refresh, setRefresh] = useState(0);

  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    const request = new AbortController();

    controller.current = request;

    setLoading(true);
    setError(null);

    listAnalyses(undefined, request.signal)
      .then((page) => {
        if (request.signal.aborted) {
          return;
        }

        setItems(page.items);
        setCursor(page.nextCursor);
      })
      .catch((reason) => {
        if (!request.signal.aborted) {
          setError(errorMessage(reason));
        }
      })
      .finally(() => {
        if (!request.signal.aborted) {
          setLoading(false);
          controller.current = null;
        }
      });

    return () => {
      request.abort();
      controller.current?.abort();
    };
  }, [refresh]);

  const loadMore = async () => {
    if (!cursor || controller.current) {
      return;
    }

    const request = new AbortController();

    controller.current = request;

    setLoading(true);
    setError(null);

    try {
      const page = await listAnalyses(
        cursor,
        request.signal,
      );

      if (request.signal.aborted) {
        return;
      }

      setItems((previous) => [
        ...previous,
        ...page.items.filter(
          (item) =>
            !previous.some(
              (oldItem) => oldItem.id === item.id,
            ),
        ),
      ]);

      setCursor(page.nextCursor);
    } catch (reason) {
      if (!request.signal.aborted) {
        setError(errorMessage(reason));
      }
    } finally {
      if (!request.signal.aborted) {
        setLoading(false);
        controller.current = null;
      }
    }
  };

  const handleRetry = () => {
    if (cursor && items.length > 0) {
      void loadMore();
      return;
    }

    setRefresh((value) => value + 1);
  };

  const getStatusClassName = (
    status: AnalysisStatus,
  ) => {
    if (status === 'failed') {
      return 'text-red-300';
    }

    if (status === 'completed') {
      return 'text-emerald-300';
    }

    return 'text-cyan-200';
  };

  const getActionLabel = (
    status: AnalysisStatus,
  ) => {
    if (status === 'completed') {
      return 'View report';
    }

    if (status === 'failed') {
      return 'View error';
    }

    return 'View progress';
  };

  return (
    <div className="min-h-screen pb-20 pt-28">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="section-label mb-4">
              Your workspace
            </div>

            <h1 className="font-display text-4xl text-white">
              Analysis history
            </h1>

            <p className="mt-4 text-slate-300">
              Reopen reports and track ongoing analyses.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={onNewAnalysis}
          >
            + New analysis
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="glass-card mb-5 p-5 text-amber-200"
          >
            <p>{error}</p>

            <button
              className="btn-secondary mt-3"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        )}

        <div className="glass-card divide-y divide-white/10">
          {!loading &&
            !error &&
            items.length === 0 && (
              <p className="p-8 text-slate-300">
                No analyses yet. Create your first
                analysis to get started.
              </p>
            )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-cyan-200">
                  Analysis report
                </p>

                <h2
                  className="mt-2 max-w-4xl break-words text-base font-medium leading-6 text-white"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {item.decision}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  {new Date(
                    item.createdAt,
                  ).toLocaleString()}
                  {' · '}
                  {item.assumptionCount} assumptions
                  {' · '}
                  {item.financialWarningCount}{' '}
                  financial warnings
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <span
                  className={getStatusClassName(
                    item.status,
                  )}
                >
                  {statusLabels[item.status]}
                </span>

                <button
                  className="btn-secondary"
                  onClick={() =>
                    onViewAnalysis(item.id)
                  }
                  aria-label={`Open analysis: ${item.decision}`}
                >
                  {getActionLabel(item.status)}
                </button>
              </div>
            </div>
          ))}

          {loading && (
            <p
              role="status"
              className="p-6 text-cyan-200"
            >
              Loading history...
            </p>
          )}
        </div>

        {cursor && (
          <button
            disabled={loading}
            className="btn-secondary mt-6 disabled:opacity-40"
            onClick={() => void loadMore()}
          >
            Load more
          </button>
        )}
      </main>
    </div>
  );
}