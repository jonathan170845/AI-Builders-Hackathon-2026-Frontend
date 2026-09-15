import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChartNoAxesCombined,
  CircleHelp,
  Lightbulb,
  Signpost,
  SlidersHorizontal,
} from 'lucide-react';

import type { FinancialInputs } from '@/types';
import { defaultFinancialInputs } from '@/data/mockData';

interface DecisionInputPageProps {
  onBack: () => void;
  onAnalyze: (
    decision: string,
    financials?: FinancialInputs,
  ) => void;
  submitting: boolean;
  error: string | null;
}

interface FinancialField {
  key: keyof FinancialInputs;
  label: string;
  suffix: string;
  help: string;
}

const financialFields: FinancialField[] = [
  {
    key: 'monthlyOrders',
    label: 'Monthly orders',
    suffix: 'orders',
    help: 'Expected orders per month at scale',
  },
  {
    key: 'revenuePerOrder',
    label: 'Revenue per order',
    suffix: 'units / order',
    help: 'Average gross revenue per order',
  },
  {
    key: 'variableCostPerOrder',
    label: 'Variable cost per order',
    suffix: 'units / order',
    help: 'Product or service cost per order',
  },
  {
    key: 'promoSubsidy',
    label: 'Promo subsidy',
    suffix: 'units / order',
    help: 'Discount or subsidy paid per order',
  },
  {
    key: 'deliveryCost',
    label: 'Delivery cost',
    suffix: 'units / order',
    help: 'Fulfillment and last-mile delivery cost',
  },
  {
    key: 'fixedCost',
    label: 'Fixed cost',
    suffix: 'units / month',
    help: 'Monthly operating costs excluding variable costs',
  },
  {
    key: 'driverCost',
    label: 'Driver cost',
    suffix: 'units / month',
    help: 'Monthly driver or workforce costs',
  },
  {
    key: 'cashBalance',
    label: 'Cash balance',
    suffix: 'units',
    help: 'Available cash for funding operations',
  },
];

const financialExplanations: Record<
  keyof FinancialInputs,
  string
> = {
  monthlyOrders:
    'The number of orders in one month for the scenario you want to test. For example, 100 orders a day over 30 days means 3,000 monthly orders.',

  revenuePerOrder:
    'The average revenue from one order before subtracting the costs entered below. For example, 10,000 in gross revenue from 200 orders means 50 per order. Enter promotional discounts separately under Promo subsidy.',

  variableCostPerOrder:
    'Costs incurred for each order, such as products, materials, or packaging. For example, 20 for the product plus 2 for packaging means 22 per order. Exclude costs entered under delivery, promotions, or driver cost.',

  promoSubsidy:
    'The average discount or subsidy your business pays per order. For example, a 10 discount on half of all orders means 5 per order on average. Enter 0 if there are no promotions.',

  deliveryCost:
    'The average fulfillment and delivery expense per order. For example, 800 to deliver 100 orders means 8 per order. Exclude any wages you already enter under Driver cost. Enter 0 if delivery does not apply.',

  fixedCost:
    'Monthly operating expenses that do not vary with each order, such as rent and software subscriptions. For example, 2,000 rent plus 300 in subscriptions means 2,300 per month. Exclude workforce expenses entered under Driver cost.',

  driverCost:
    'The total monthly driver or workforce expense treated separately by this model. For example, 5 drivers paid 600 each means 3,000 per month. Do not count the same expense again in Fixed cost or Delivery cost.',

  cashBalance:
    'Cash currently available to pay operating expenses. For example, 30,000 in the business bank account means a 30,000 cash balance. Exclude expected sales or funding that has not arrived yet.',
};

export default function DecisionInputPage({
  onBack,
  onAnalyze,
  submitting,
  error,
}: DecisionInputPageProps) {
  const [decision, setDecision] = useState(
    'Scale on-demand grocery delivery to 5 new cities with heavy promotional subsidies',
  );

  const [financials, setFinancials] =
    useState<FinancialInputs>(defaultFinancialInputs);

  const [includeFinancials, setIncludeFinancials] =
    useState(false);

  const [openAdjustment, setOpenAdjustment] =
    useState<keyof FinancialInputs | null>(null);

  const [adjustmentStep, setAdjustmentStep] =
    useState(1);

  const validFinancials = Object.entries(
    financials,
  ).every(([key, value]) => {
    const maximum =
      key === 'monthlyOrders' ? 1e12 : 1e15;

    const validDecimals =
      key === 'monthlyOrders'
        ? Number.isInteger(value)
        : (
            value
              .toString()
              .split('.')[1]?.length ?? 0
          ) <= 4;

    return (
      Number.isFinite(value) &&
      value >= 0 &&
      value <= maximum &&
      validDecimals
    );
  });

  const adjustFinancial = (
    key: keyof FinancialInputs,
    direction: number,
  ) => {
    const field = document.getElementById(
      `financial-${key}`,
    );

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (field && !reducedMotion) {
      field
        .getAnimations()
        .forEach((animation) =>
          animation.cancel(),
        );

      field.animate(
        [
          {
            boxShadow:
              '0 0 0 2px rgba(103,232,249,0.8)',
            backgroundColor: '#203d50',
          },
          {
            boxShadow:
              '0 0 0 0px rgba(103,232,249,0)',
          },
        ],
        {
          duration: 550,
          easing: 'ease-out',
        },
      );
    }

    setFinancials((current) => ({
      ...current,
      [key]: Math.max(
        0,
        Math.round(
          (current[key] +
            direction * adjustmentStep) *
            100,
        ) / 100,
      ),
    }));
  };

  const updateFinancial = (
    key: keyof FinancialInputs,
    value: string,
  ) => {
    const numericValue = Number(
      value.replace(/,/g, ''),
    );

    if (!Number.isFinite(numericValue)) {
      return;
    }

    setFinancials((current) => ({
      ...current,
      [key]: numericValue,
    }));
  };

  const handleAnalyze = () => {
    onAnalyze(
      decision,
      includeFinancials
        ? financials
        : undefined,
    );
  };

  const analyzeDisabled =
    submitting ||
    decision.trim().length < 10 ||
    (includeFinancials && !validFinancials);

  return (
    <div className="min-h-screen pb-20 pt-28">
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="back-button mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="mb-10">
          <div className="section-label mb-4">
            New stress test
          </div>

          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            What decision are you considering?
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            Be as specific as possible. Include the
            action, scope, timing, and the outcome you
            expect.
          </p>
        </div>

        <div className="space-y-5">
          <p className="text-sm leading-relaxed text-slate-300">
            Your decision and retrieved evidence are
            sent to an external AI provider to produce
            the analysis. Financial inputs are optional.
            If you include them, use the same monetary
            unit for every amount.
          </p>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-400/30 p-4 text-red-200"
            >
              {error}
            </p>
          )}

          {/* Decision statement */}
          <div className="glass-card p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                <Signpost
                  aria-hidden="true"
                  className="h-6 w-6"
                  strokeWidth={1.75}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2
                    id="decision-label"
                    className="font-display text-base font-semibold text-white"
                  >
                    Decision statement
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-200/10 px-3 py-1 text-xs font-medium text-amber-200 ring-1 ring-inset ring-amber-200/20">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-amber-300"
                    />
                    Required
                  </span>
                </div>

                <p className="text-sm text-slate-300">
                  Describe the decision you want to
                  stress-test
                </p>
              </div>
            </div>

            <textarea
              maxLength={5000}
              minLength={10}
              required
              aria-labelledby="decision-label"
              value={decision}
              onChange={(event) =>
                setDecision(event.target.value)
              }
              rows={5}
              className="input-field resize-none text-base leading-relaxed"
              placeholder="For example: We will expand our B2B SaaS product into the European market within the next 6 months..."
            />

            <div className="mt-3 flex items-start gap-2 text-sm text-slate-300">
              <CircleHelp className="mt-0.5 h-3.5 w-3.5 shrink-0" />

              <span>
                The clearer your decision, the more
                precise the assumptions and evidence
                will be.
              </span>
            </div>
          </div>

          {/* Financial choice */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                <ChartNoAxesCombined
                  aria-hidden="true"
                  className="h-6 w-6"
                  strokeWidth={1.75}
                />
              </div>

              <div>
                <h2 className="font-display text-base font-semibold text-white">
                  Do you want to include financial
                  inputs?
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-slate-300">
                  Add financial assumptions if you want
                  Veritas to run an additional financial
                  stress test.
                </p>
              </div>
            </div>

            <div
              className="mt-6 grid gap-3 sm:grid-cols-2"
              role="radiogroup"
              aria-label="Include financial inputs"
            >
              <button
                type="button"
                role="radio"
                aria-checked={includeFinancials}
                onClick={() =>
                  setIncludeFinancials(true)
                }
                className={`rounded-xl border p-4 text-left transition-all ${
                  includeFinancials
                    ? 'border-cyan-300/50 bg-cyan-300/10 ring-1 ring-cyan-300/20'
                    : 'border-slate-400/20 bg-white/[0.02] hover:border-slate-300/30 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      includeFinancials
                        ? 'border-cyan-300'
                        : 'border-slate-500'
                    }`}
                  >
                    {includeFinancials && (
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    )}
                  </span>

                  <span className="font-medium text-white">
                    Yes, include financial inputs
                  </span>
                </div>

                <p className="mt-2 pl-8 text-sm text-slate-400">
                  Run financial stress testing using
                  your operating assumptions.
                </p>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={!includeFinancials}
                onClick={() =>
                  setIncludeFinancials(false)
                }
                className={`rounded-xl border p-4 text-left transition-all ${
                  !includeFinancials
                    ? 'border-cyan-300/50 bg-cyan-300/10 ring-1 ring-cyan-300/20'
                    : 'border-slate-400/20 bg-white/[0.02] hover:border-slate-300/30 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      !includeFinancials
                        ? 'border-cyan-300'
                        : 'border-slate-500'
                    }`}
                  >
                    {!includeFinancials && (
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    )}
                  </span>

                  <span className="font-medium text-white">
                    No, skip financial inputs
                  </span>
                </div>

                <p className="mt-2 pl-8 text-sm text-slate-400">
                  Continue with assumption and evidence
                  analysis only.
                </p>
              </button>
            </div>
          </div>

          {/* Financial fields */}
          {includeFinancials && (
            <div className="glass-card p-6 sm:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                  <ChartNoAxesCombined
                    aria-hidden="true"
                    className="h-6 w-6"
                    strokeWidth={1.75}
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-display text-base font-semibold text-white">
                      Financial inputs
                    </h2>

                    <span className="inline-flex items-center rounded-full bg-slate-300/10 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-inset ring-slate-300/20">
                      Optional
                    </span>
                  </div>

                  <p className="text-sm text-slate-300">
                    Add numbers to run a financial
                    stress test
                  </p>
                </div>
              </div>

              {!validFinancials && (
                <p
                  role="alert"
                  className="mb-6 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-4 text-sm leading-relaxed text-amber-200"
                >
                  Use nonnegative values, whole monthly
                  orders up to 1 trillion, and financial
                  amounts up to 1 quadrillion with at
                  most four decimal places.
                </p>
              )}

              <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                {financialFields.map(
                  ({
                    key,
                    label,
                    suffix,
                    help,
                  }) => (
                    <div
                      key={key}
                      className="min-w-0"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <label
                            htmlFor={`financial-${key}`}
                            className="text-base font-medium text-slate-200"
                          >
                            {label}
                          </label>

                          {/* Hover / focus tooltip */}
                          <div className="group relative inline-flex">
                            <button
                              type="button"
                              aria-label={`Information about ${label}`}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-cyan-200 transition-colors hover:bg-cyan-400/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                            >
                              <CircleHelp
                                aria-hidden="true"
                                className="h-4 w-4"
                              />
                            </button>

                            <div
                              role="tooltip"
                              className="pointer-events-none absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-cyan-400/20 bg-[#102037] p-3 text-sm leading-relaxed text-slate-200 opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                            >
                              {
                                financialExplanations[
                                  key
                                ]
                              }
                            </div>
                          </div>
                        </div>

                        <span className="shrink-0 text-sm text-slate-300">
                          {suffix}
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          id={`financial-${key}`}
                          aria-describedby={`hint-${key}`}
                          type="text"
                          inputMode="decimal"
                          value={financials[key]}
                          onChange={(event) =>
                            updateFinancial(
                              key,
                              event.target.value,
                            )
                          }
                          className="input-field pr-12 text-lg"
                        />

                        <button
                          type="button"
                          aria-label={`Adjust ${label}`}
                          title={`Adjust ${label}`}
                          aria-expanded={
                            openAdjustment === key
                          }
                          aria-controls={`adjust-${key}`}
                          onClick={() =>
                            setOpenAdjustment(
                              (current) =>
                                current === key
                                  ? null
                                  : key,
                            )
                          }
                          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-cyan-200 hover:bg-cyan-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                        >
                          <SlidersHorizontal
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                        </button>
                      </div>

                      <div
                        id={`adjust-${key}`}
                        hidden={
                          openAdjustment !== key
                        }
                        className="mt-3 rounded-lg border border-slate-400/30 bg-[#102037] p-3"
                      >
                        <label
                          htmlFor={`step-${key}`}
                          className="block text-base font-medium text-slate-200"
                        >
                          Adjust by
                        </label>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <select
                            id={`step-${key}`}
                            value={adjustmentStep}
                            onChange={(event) =>
                              setAdjustmentStep(
                                Number(
                                  event.target
                                    .value,
                                ),
                              )
                            }
                            className="min-w-0 flex-1 rounded-lg border border-slate-400/30 bg-[#17243a] p-2 text-base text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                          >
                            {[
                              1,
                              10,
                              100,
                              1000,
                              10000,
                              100000,
                            ].map((step) => (
                              <option
                                key={step}
                                value={step}
                              >
                                {step.toLocaleString(
                                  'en-US',
                                )}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            aria-label={`Decrease ${label} by ${adjustmentStep}`}
                            disabled={
                              financials[key] <= 0
                            }
                            onClick={() =>
                              adjustFinancial(
                                key,
                                -1,
                              )
                            }
                            className="h-10 w-10 rounded-lg border border-slate-400/30 text-xl text-white transition-transform duration-150 hover:bg-white/10 disabled:opacity-40 motion-safe:active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                          >
                            −
                          </button>

                          <button
                            type="button"
                            aria-label={`Increase ${label} by ${adjustmentStep}`}
                            onClick={() =>
                              adjustFinancial(
                                key,
                                1,
                              )
                            }
                            className="h-10 w-10 rounded-lg border border-slate-400/30 text-xl text-white transition-transform duration-150 hover:bg-white/10 motion-safe:active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                          >
                            +
                          </button>
                        </div>

                        <p className="mt-2 text-sm text-slate-300">
                          Choose a step, then use − or
                          +. You can also type directly
                          in the field.
                        </p>
                      </div>

                      <p
                        id={`hint-${key}`}
                        className="mt-1.5 text-sm text-slate-300"
                      >
                        {help}
                      </p>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-7 flex items-start gap-3 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

                <p className="text-sm leading-relaxed text-slate-300">
                  Financial stress testing is most
                  useful when inputs reflect your
                  current operating reality, not your
                  target state.
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col-reverse items-center justify-between gap-4 pt-3 sm:flex-row">
            <p className="text-sm text-slate-300">
              Analysis typically takes 2–4 minutes
            </p>

            <button
              onClick={handleAnalyze}
              disabled={analyzeDisabled}
              className="btn-primary w-full px-8 py-3.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto"
            >
              {submitting
                ? 'Submitting...'
                : 'Analyze Decision'}

              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}