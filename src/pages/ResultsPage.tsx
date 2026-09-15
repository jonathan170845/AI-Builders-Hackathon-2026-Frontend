import ReportTabs from '@/components/ReportTabs';
import ReportOverview from '@/components/ReportOverview';
import AssessmentBadge from '@/components/AssessmentBadge';
import SectionCard from '@/components/SectionCard';

import { formatReportLabel } from '@/utils/reportLabel';
import {
  formatAmount as formatCurrency,
  formatNumber,
  safeSourceUrl,
  warningLabel,
} from '@/utils/format';

import { useState } from 'react';

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Info,
  Landmark,
  Layers3,
  Link2,
  ShieldCheck,
  TrendingDown,
  WalletCards,
} from 'lucide-react';

import type { AnalysisResult, Assumption } from '@/types';


interface ResultsPageProps {
  result: AnalysisResult;
  onBack: () => void;
  backLabel?: string;
  demo?: boolean;
}


function AssumptionCard({
  assumption,
}: {
  assumption: Assumption;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015] transition-colors hover:border-white/[0.1]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`assumption-${assumption.id}`}
        onClick={() => setOpen((current) => !current)}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start gap-4">
          <span className="mt-1 shrink-0 font-mono text-xs text-cyan-400">
            {assumption.id}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="pr-3 text-sm font-medium leading-relaxed text-white sm:text-base">
                {assumption.text}
              </h3>

              <AssessmentBadge
                level={assumption.assessment}
                size="sm"
              />
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {assumption.summary}
            </p>
          </div>

          <span className="mt-1 flex shrink-0 flex-col items-end gap-2 text-cyan-200">
            <span className="hidden text-xs font-medium sm:inline">
              {open ? 'Hide details' : 'View details'}
            </span>

            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </div>
      </button>

      <div
        id={`assumption-${assumption.id}`}
        aria-hidden={!open}
        className={`assumption-disclosure ${
          open ? 'is-open' : ''
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="ml-9 grid gap-5 border-t border-white/[0.05] px-5 pb-5 pt-4 md:grid-cols-2">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-200">
                Evidence gaps
              </div>

              <p className="mb-3 text-xs text-cyan-200">
                Evidence references:{' '}
                {assumption.evidenceRefs?.join(', ') ||
                  'No references supplied'}
              </p>

              <ul className="space-y-2">
                {assumption.evidenceGaps.map((gap) => (
                  <li
                    key={gap}
                    className="flex items-start gap-2 text-sm leading-relaxed text-slate-300"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                    {gap}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <FlaskConical className="h-3.5 w-3.5" />
                Recommended experiment
              </div>

              <p className="text-sm leading-relaxed text-slate-300">
                {assumption.validationExperiment}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ResultsPage({
  result,
  onBack,
  backLabel = 'Back to history',
  demo = false,
}: ResultsPageProps) {
  const [activeTab, setActiveTab] =
    useState<'overview' | 'context' | 'sources'>('overview');

  const [showFullDecision, setShowFullDecision] =
    useState(false);

  const { financialResults: finance } = result;

  const hasLongDecision =
    result.decisionTitle.length > 180;

  return (
    <div className="min-h-screen pb-20 pt-24">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="back-button mb-7"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>

        {/* ==================================================
            REPORT HEADER
        ================================================== */}
        <div className="mb-10">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <Check className="h-3 w-3" />

                {demo
                  ? 'Illustrative demo · fictional report'
                  : 'Analysis complete'}
              </span>

              <span className="rounded-md border border-slate-400/25 bg-[#142238] px-3 py-1 text-sm font-semibold text-slate-100">
                {formatReportLabel(result.id)}
              </span>
            </div>

            <ReportTabs
              active={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {/* Decision title */}
          <div className="max-w-5xl">
            <h1
              className="break-words font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
              style={
                showFullDecision
                  ? undefined
                  : {
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }
              }
            >
              {result.decisionTitle}
            </h1>

            {hasLongDecision && (
              <button
                type="button"
                onClick={() =>
                  setShowFullDecision(
                    (current) => !current,
                  )
                }
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
              >
                {showFullDecision ? (
                  <>
                    Show less
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    View full decision
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            )}

            <p className="mt-5 text-base leading-relaxed text-slate-300">
              {result.summary}
            </p>
          </div>
        </div>

        {/* ==================================================
            OVERVIEW TAB
        ================================================== */}
        {activeTab === 'overview' && (
          <div
            key="overview"
            className="report-panel-enter space-y-6"
          >
            <ReportOverview result={result} />

            {/* Report summary cards */}
            <section
              aria-label="Report at a glance"
              className="glass-card grid divide-y divide-slate-400/20 lg:grid-cols-3 lg:divide-x lg:divide-y-0"
            >
              {/* Critical assumptions */}
              <div className="flex items-center gap-5 px-6 py-5">
                <span className="shrink-0 font-display text-4xl font-semibold tabular-nums text-white">
                  {result.assumptions.length}
                </span>

                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-white">
                    Critical assumptions
                  </h2>

                  <p className="mt-1 text-sm text-slate-300">
                    {
                      result.assumptions.filter(
                        (item) =>
                          item.assessment !==
                          'Well Supported',
                      ).length
                    }{' '}
                    need further validation
                  </p>
                </div>
              </div>

              {/* Evidence coverage */}
              <div className="flex items-center gap-4 px-6 py-5">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-white">
                    Direct evidence coverage
                  </h2>

                  <p className="mt-1 text-sm text-slate-300">
                    {result.directEvidenceCoverage}
                  </p>
                </div>
              </div>

              {/* Financial warnings */}
              <div className="flex items-center gap-5 px-6 py-5">
                <span className="shrink-0 font-display text-4xl font-semibold tabular-nums text-amber-300">
                  {result.financialWarnings.length}
                </span>

                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-white">
                    Financial warnings
                  </h2>

                  <p className="mt-1 text-sm text-amber-200">
                    {result.financialWarnings[0]
                      ? warningLabel(
                          result.financialWarnings[0],
                        )
                      : finance
                        ? 'No warnings flagged'
                        : 'Financial inputs were not provided'}
                  </p>
                </div>
              </div>
            </section>

            {/* ==================================================
                CRITICAL ASSUMPTIONS
            ================================================== */}
            <SectionCard
              title="Critical assumptions"
              icon={
                <Layers3 className="h-4 w-4 text-cyan-400" />
              }
              action={
                <span className="text-sm text-slate-300">
                  Select an assumption to view details
                </span>
              }
            >
              <div className="space-y-3">
                {result.assumptions.map((assumption) => (
                  <AssumptionCard
                    key={assumption.id}
                    assumption={assumption}
                  />
                ))}
              </div>
            </SectionCard>

            {/* ==================================================
                FINANCIAL STRESS TEST
            ================================================== */}
            <SectionCard
              title="Financial stress test"
              icon={
                <WalletCards className="h-4 w-4 text-amber-400" />
              }
              action={
                <span className="text-sm text-amber-200">
                  {result.financialWarnings.length} warnings
                </span>
              }
            >
              {!finance ? (
                <p className="text-slate-300">
                  Financial inputs were not provided.
                </p>
              ) : (
                <>
                  {result.financialWarnings.map(
                    (warning) => (
                      <p
                        key={warning}
                        className="mb-3 rounded-lg border border-amber-300/20 p-4 text-amber-200"
                      >
                        {warningLabel(warning)}
                      </p>
                    ),
                  )}

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    {[
                      {
                        label: 'Monthly contribution',
                        value: formatCurrency(
                          finance.contributionMargin,
                        ),
                        sub: `${formatNumber(
                          finance.contributionMarginPct,
                        )}% contribution margin`,
                      },
                      {
                        label: 'Operating profit',
                        value: formatCurrency(
                          finance.operatingProfit,
                        ),
                        sub: 'per month',
                      },
                      {
                        label: 'Monthly burn',
                        value: formatCurrency(
                          finance.monthlyBurn,
                        ),
                        sub: 'cash outflow',
                      },
                      {
                        label: 'Runway',
                        value:
                          finance.runwayMonths === null
                            ? 'N/A'
                            : `${formatNumber(
                                finance.runwayMonths,
                              )} mo`,
                        sub: 'at current burn',
                      },
                      {
                        label: 'Break-even orders',
                        value: formatNumber(
                          finance.breakEvenOrders,
                        ),
                        sub: 'per month',
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg bg-white/[0.02] p-4"
                      >
                        <div className="text-sm text-slate-300">
                          {item.label}
                        </div>

                        <div className="mt-3 font-display text-xl font-semibold text-white">
                          {item.value}
                        </div>

                        <div className="mt-1 text-sm text-slate-300">
                          {item.sub}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </SectionCard>

            {/* ==================================================
                HISTORICAL + IDX
            ================================================== */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard
                title="Historical failure mechanisms"
                icon={
                  <TrendingDown className="h-4 w-4 text-red-400" />
                }
              >
                <div className="space-y-5">
                  {result.failureMechanisms.map(
                    (failure) => (
                      <div
                        key={failure.id}
                        className="relative border-l border-red-400/20 pl-5"
                      >
                        <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-red-400" />

                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-medium text-white">
                            {failure.title}
                          </h3>

                          <span className="shrink-0 font-mono text-sm text-slate-300">
                            {failure.year ??
                              'Year unavailable'}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-slate-300">
                          {failure.description}
                        </p>

                        <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-300">
                          <BookOpen className="h-3 w-3" />
                          {failure.source}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </SectionCard>

              <SectionCard
                title="IDX benchmark"
                icon={<BarChart3Icon />}
                action={
                  <span className="inline-flex items-center gap-1 text-sm text-slate-300">
                    <Info className="h-3 w-3" />
                    Industry reference
                  </span>
                }
              >
                <div className="space-y-1">
                  {result.idxBenchmarks.length === 0 && (
                    <p className="text-slate-300">
                      No compatible benchmark available.
                    </p>
                  )}

                  {result.idxBenchmarks.map(
                    (benchmark) => (
                      <div
                        key={benchmark.metric}
                        className="flex items-center justify-between gap-4 border-b border-white/[0.04] py-3 last:border-0"
                      >
                        <div className="min-w-0">
                          <div className="text-sm text-slate-300">
                            {benchmark.metric}
                          </div>

                          <div className="mt-1 text-sm text-slate-300">
                            Benchmark:{' '}
                            {benchmark.benchmark}
                          </div>

                          {benchmark.disclaimer && (
                            <p className="mt-2 text-xs text-amber-200">
                              {benchmark.disclaimer}{' '}
                              Sample:{' '}
                              {benchmark.sampleSize}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-sm font-medium text-slate-200">
                            {benchmark.value}
                          </div>

                          <div className="mt-1 text-xs text-red-300">
                            {benchmark.status}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </SectionCard>
            </div>

            {/* ==================================================
                VALIDATION EXPERIMENTS
            ================================================== */}
            <SectionCard
              title="Validation experiments"
              icon={
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
              }
              action={
                <span className="text-sm text-slate-300">
                  Recommendations, not evidence
                </span>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                {result.validationExperiments.map(
                  (experiment, index) => (
                    <div
                      key={experiment.id}
                      className="rounded-xl border border-white/[0.06] p-5 transition-colors hover:border-cyan-400/20"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-400/10 font-mono text-xs text-cyan-400">
                            {index + 1}
                          </span>

                          <h3 className="text-sm font-medium text-white">
                            {experiment.title}
                          </h3>
                        </div>

                        <span className="shrink-0 text-sm text-slate-300">
                          {experiment.timeToRun}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-slate-300">
                        {experiment.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <span className="rounded-full bg-white/[0.05] px-2 py-1 font-mono text-sm text-slate-300">
                          Assumption{' '}
                          {experiment.linkedAssumptionId}
                        </span>

                        <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">
                          {experiment.costLevel} cost
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ==================================================
            CONTEXT TAB
        ================================================== */}
        {activeTab === 'context' && (
          <div
            key="context"
            className="report-panel-enter space-y-6"
          >
            <SectionCard
              title="Company analogue context"
              icon={
                <Building2 className="h-4 w-4 text-violet-400" />
              }
              action={
                <span className="text-xs text-amber-400">
                  Context only — not proof
                </span>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                {result.companyAnalogues.map(
                  (company) => (
                    <div
                      key={company.id}
                      className="rounded-xl border border-white/[0.06] p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg font-semibold text-white">
                            {company.name}
                          </h3>

                          <span className="mt-1 inline-block font-mono text-sm text-slate-300">
                            {company.yearRange ??
                              'Year unavailable'}
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            company.outcome === 'Failed'
                              ? 'bg-red-400/10 text-red-400'
                              : company.outcome ===
                                  'Pivoted'
                                ? 'bg-amber-400/10 text-amber-400'
                                : company.outcome ===
                                    'Succeeded'
                                  ? 'bg-emerald-400/10 text-emerald-400'
                                  : 'bg-slate-400/10 text-slate-300'
                          }`}
                        >
                          {company.outcome ??
                            'Outcome unknown'}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-slate-300">
                        {company.context}
                      </p>

                      <div className="mt-4 border-t border-white/[0.05] pt-3 text-sm text-slate-300">
                        <span className="text-slate-300">
                          Relevance:
                        </span>{' '}
                        {company.relevance}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </SectionCard>

            <div className="flex items-start gap-3 rounded-xl border border-violet-400/15 bg-violet-400/[0.04] p-5">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />

              <div>
                <div className="text-sm font-medium text-violet-200">
                  How to read company analogues
                </div>

                <p className="mt-1 text-sm leading-relaxed text-slate-300">
                  These examples provide context for
                  mechanisms that have appeared in similar
                  business models. They are not predictions,
                  proof of causality, or a substitute for
                  validating your own assumptions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            SOURCES TAB
        ================================================== */}
        {activeTab === 'sources' && (
          <SectionCard
            className="report-panel-enter"
            title="Source metadata"
            icon={
              <BookOpen className="h-4 w-4 text-cyan-400" />
            }
            action={
              <span className="text-sm text-slate-300">
                {result.sources.length} sources referenced
              </span>
            }
          >
            <div className="space-y-2">
              {result.sources.map((source) => {
                const sourceUrl =
                  safeSourceUrl(source.url);

                return (
                  <div
                    key={source.id}
                    className="flex items-center gap-4 rounded-lg border border-white/[0.05] p-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-slate-300">
                      <Landmark className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-200">
                        {source.title}
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-300">
                        <span>{source.type}</span>
                        <span>·</span>
                        <span>
                          {source.year ??
                            'Year unavailable'}
                        </span>
                      </div>
                    </div>

                    {sourceUrl ? (
                      <a
                        aria-label={`Open source: ${source.title}`}
                        href={sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-cyan-400"
                      >
                        <Link2 className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">
                        URL unavailable
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-lg bg-white/[0.02] p-4 text-sm leading-relaxed text-slate-300">
              Source metadata is provided for traceability.
              Veritas does not treat search results, company
              analogues, or model-generated recommendations
              as direct evidence for your decision.
            </div>
          </SectionCard>
        )}
      </main>
    </div>
  );
}


function BarChart3Icon() {
  return (
    <ArrowUpRight className="h-4 w-4 text-emerald-400" />
  );
}