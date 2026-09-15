import type {
  AnalysisResult,
  FinancialInputs,
  FinancialResults,
  HistoryEntry,
} from '@/types';

export const defaultFinancialInputs: FinancialInputs = {
  monthlyOrders: 0,
  revenuePerOrder: 0,
  variableCostPerOrder: 0,
  promoSubsidy: 0,
  deliveryCost: 0,
  fixedCost: 0,
  driverCost: 0,
  cashBalance: 0,
};

export function computeFinancialResults(input: FinancialInputs): FinancialResults {
  const netRevenuePerOrder = input.revenuePerOrder - input.promoSubsidy;
  const variableCostPerOrder = input.variableCostPerOrder + input.deliveryCost;
  const contributionMarginPerOrder = netRevenuePerOrder - variableCostPerOrder;
  const totalContributionMargin = contributionMarginPerOrder * input.monthlyOrders;
  const operatingProfit = totalContributionMargin - input.fixedCost - input.driverCost;
  const monthlyBurn = operatingProfit < 0 ? Math.abs(operatingProfit) : 0;
  const runwayMonths = monthlyBurn > 0 ? input.cashBalance / monthlyBurn : null;
  const breakEvenOrders =
    contributionMarginPerOrder > 0
      ? Math.ceil((input.fixedCost + input.driverCost) / contributionMarginPerOrder)
      : null;

  return {
    contributionMargin: totalContributionMargin,
    contributionMarginPct: netRevenuePerOrder > 0 ? (contributionMarginPerOrder / netRevenuePerOrder) * 100 : 0,
    operatingProfit,
    monthlyBurn,
    runwayMonths: runwayMonths === null ? null : Math.round(runwayMonths * 10) / 10,
    breakEvenOrders: breakEvenOrders === null ? null : breakEvenOrders,
  };
}

export const mockAnalysisResult: AnalysisResult = {
  id: 'analysis-001',
  decisionTitle: 'Scale on-demand grocery delivery to 5 new cities with heavy promotional subsidies',
  summary:
    'Illustrative demo: fictional pilots support customer retention under a partial subsidy reduction and demand in tested neighborhoods. Three other assumptions still need evidence. These pilot results do not establish profitability or validate a full five-city expansion. Review unit economics and competitive responses before scaling.',
  assumptions: [
    {
      id: 'A1',
      text: 'Customers in the pilot cohort maintain order frequency after a 50% reduction in promotional subsidies.',
      assessment: 'Well Supported',
      summary:
        'Illustrative evidence: a fictional four-week controlled pilot found stable order frequency after a 50% subsidy reduction. This supports the claim for the tested cohort, not full subsidy removal or every new city.',
      evidenceGaps: [
        'Full removal of subsidies has not been tested',
        'Retention beyond the four-week pilot remains unknown',
      ],
      validationExperiment:
        'Repeat the pilot in a new city and test a further subsidy reduction before assuming the result applies across all markets.',
    },
    {
      id: 'A2',
      text: 'The contribution margin per order will improve as operational efficiency increases with scale.',
      assessment: 'Insufficient Evidence',
      summary:
        'The current contribution margin is negative after subsidies and delivery costs. While density-driven efficiency improvements are theoretically possible, they require order densities that no comparable company has achieved in these markets.',
      evidenceGaps: [
        'No route-density data for target cities',
        'No evidence that current markets show improving margins with scale',
        'No benchmark data on delivery cost per order at various density levels',
      ],
      validationExperiment:
        'Measure delivery cost per order across neighborhoods with varying order density in an existing market to model the density-cost relationship.',
    },
    {
      id: 'A3',
      text: 'The tested launch neighborhoods can reach the planned daily order volume.',
      assessment: 'Well Supported',
      summary:
        'Illustrative evidence: fictional paid-order pilots reached the planned daily volume in the tested neighborhoods. This supports local demand, but does not establish citywide coverage or financial viability.',
      evidenceGaps: [
        'Demand outside the pilot neighborhoods is not yet validated',
        'Seasonal demand and long-term repeat orders are not yet measured',
      ],
      validationExperiment:
        'Expand the paid-order pilot to additional neighborhoods and track repeat orders before committing to a citywide launch.',
    },
    {
      id: 'A4',
      text: 'Competitors will not respond aggressively to our entry with their own subsidies or exclusivity deals.',
      assessment: 'Insufficient Evidence',
      summary:
        'The assumption ignores that incumbents in these markets have deep pockets and have historically engaged in subsidy wars (e.g., food delivery price wars in India). No competitive response modeling has been done.',
      evidenceGaps: [
        'No analysis of incumbent war chests and subsidy capacity',
        'No game-theoretic modeling of competitive responses',
        'No data on historical competitive responses in target markets',
      ],
      validationExperiment:
        'Model three competitive response scenarios (no response, matching subsidies, aggressive counter-subsidy) and stress-test the financial model under each scenario.',
    },
    {
      id: 'A5',
      text: 'The promotional subsidy cost per order will decrease over time as organic word-of-mouth reduces the need for paid acquisition.',
      assessment: 'Insufficient Evidence',
      summary:
        'There is no evidence that word-of-mouth will offset paid acquisition costs in a low-differentiation logistics service. Companies like DoorDash continued high promotional spend even at scale.',
      evidenceGaps: [
        'No word-of-mouth coefficient data',
        'No organic-vs-paid acquisition ratio tracking',
        'No data on customer lifetime value vs. acquisition cost',
      ],
      validationExperiment:
        'Track organic vs. paid acquisition channels in an existing market for 8 weeks and calculate the organic acquisition ratio trend.',
    },
  ],
  directEvidenceCoverage:
    'Illustrative demo: 2 of 5 assumptions are marked Well Supported using fictional pilot evidence, giving 40% coverage. The remaining 3 need further validation. These are sample records, not real research findings.',
  financialWarnings: ['Negative Operating Profit'],
  financialResults: {
    contributionMargin: 15000000,
    contributionMarginPct: 30,
    operatingProfit: -30000000,
    monthlyBurn: 30000000,
    runwayMonths: 16.7,
    breakEvenOrders: 3000000,
  },
  failureMechanisms: [
    {
      id: 'F1',
      title: 'Subsidy Dependency Death Spiral',
      description:
        'The business becomes structurally dependent on promotional subsidies to maintain order volume. When subsidies are reduced, order volume drops, reducing delivery density, which increases per-order costs, which forces further subsidy spending. This mechanism was the primary cause of failure for Homejoy (2015) and Sprig (2017).',
      source: 'CB Insights Post-Mortem Analysis',
      year: 2018,
    },
    {
      id: 'F2',
      title: 'Negative Contribution Margin at Scale',
      description:
        'The per-order economics are negative before fixed costs, meaning every additional order destroys value. Scaling increases losses linearly. This mechanism was observed in Deliveroo\'s early expansion into low-density markets and Kozmo.com\'s nationwide expansion (2001).',
      source: 'Harvard Business School Case Study',
      year: 2019,
    },
    {
      id: 'F3',
      title: 'Competitive Subsidy War Erosion',
      description:
        'Incumbents respond to new entrants by matching or exceeding subsidies, eliminating any customer acquisition advantage while both sides burn capital. This mechanism was central to the Indian food delivery wars (2014-2019) where multiple well-funded entrants competed on subsidies until only one survived.',
      source: 'McKinsey Industry Report',
      year: 2020,
    },
  ],
  companyAnalogues: [
    {
      id: 'C1',
      name: 'Homejoy',
      context:
        'On-demand home cleaning platform that expanded aggressively using promotional subsidies. Failed in 2015 after 2 years of operation. The core failure was inability to retain customers after subsidies ended, with retention dropping below 20% post-subsidy.',
      outcome: 'Failed',
      yearRange: '2013-2015',
      relevance: 'Same subsidy-driven growth model in a low-margin service business',
    },
    {
      id: 'C2',
      name: 'Sprig',
      context:
        'On-demand meal delivery that operated with negative contribution margins, subsidizing each order. Shut down in 2017 after burning $50M. Per-order costs never decreased with scale as assumed.',
      outcome: 'Failed',
      yearRange: '2013-2017',
      relevance: 'Same negative unit economics in food delivery with subsidy dependency',
    },
    {
      id: 'C3',
      name: 'Kozmo.com',
      context:
        'Early 2000s on-demand delivery that offered free delivery and expanded to multiple cities without validating demand density. Failed in 2001 after raising $280M. The free delivery model was structurally unsustainable.',
      outcome: 'Failed',
      yearRange: '1998-2001',
      relevance: 'Multi-city expansion without density validation in delivery logistics',
    },
    {
      id: 'C4',
      name: 'Deliveroo',
      context:
        'Food delivery company that entered several secondary UK markets and had to withdraw from cities where order density was insufficient to cover rider costs. Pivoted to a marketplace model in viable markets only.',
      outcome: 'Pivoted',
      yearRange: '2013-2019',
      relevance: 'Withdrew from low-density markets — validates the demand density assumption risk',
    },
  ],
  validationExperiments: [
    {
      id: 'V1',
      title: 'Post-Subsidy Retention Cohort Study',
      description:
        'Reduce subsidies by 50% for a treatment cohort of 5,000 users over 4 weeks while maintaining a control group. Measure order frequency, churn rate, and lifetime value. This directly tests Assumption A1.',
      linkedAssumptionId: 'A1',
      timeToRun: '4-6 weeks',
      costLevel: 'Low',
    },
    {
      id: 'V2',
      title: 'Delivery Cost-Density Mapping',
      description:
        'Instrument delivery cost per order across 10 neighborhoods with varying order density in an existing market. Build a cost-density curve to validate whether margins improve with scale. Tests Assumption A2.',
      linkedAssumptionId: 'A2',
      timeToRun: '3-4 weeks',
      costLevel: 'Low',
    },
    {
      id: 'V3',
      title: 'Pre-Launch Demand Test',
      description:
        'Deploy targeted landing pages with waitlist sign-ups in each of the 5 target cities. Measure organic sign-up rate, cost per sign-up, and stated order intent. Tests Assumption A3.',
      linkedAssumptionId: 'A3',
      timeToRun: '2 weeks',
      costLevel: 'Low',
    },
    {
      id: 'V4',
      title: 'Competitive Response Scenario Modeling',
      description:
        'Build financial models under three competitive response scenarios: no response, subsidy matching, and aggressive counter-subsidy. Stress-test runway and break-even under each. Tests Assumption A4.',
      linkedAssumptionId: 'A4',
      timeToRun: '1-2 weeks',
      costLevel: 'Low',
    },
    {
      id: 'V5',
      title: 'Organic Acquisition Channel Tracking',
      description:
        'Instrument acquisition channels in an existing market for 8 weeks. Track organic vs. paid ratio, word-of-mouth coefficient, and CAC-to-LTV ratio. Tests Assumption A5.',
      linkedAssumptionId: 'A5',
      timeToRun: '6-8 weeks',
      costLevel: 'Low',
    },
  ],
  idxBenchmarks: [
    {
      metric: 'Contribution Margin %',
      value: '30%',
      benchmark: '> 40% for sustainable delivery',
      status: 'Below Benchmark',
    },
    {
      metric: 'CAC / LTV Ratio',
      value: 'Not measured',
      benchmark: '< 1:3 (LTV 3x CAC)',
      status: 'Below Benchmark',
    },
    {
      metric: 'Organic Order Ratio',
      value: 'Not measured',
      benchmark: '> 40% at scale',
      status: 'Below Benchmark',
    },
    {
      metric: 'Delivery Cost / Order',
      value: '$8.00',
      benchmark: '$4-6 in dense urban markets',
      status: 'Below Benchmark',
    },
    {
      metric: 'Order Density (orders/km²/day)',
      value: 'Not measured',
      benchmark: '> 500 for viable unit economics',
      status: 'Below Benchmark',
    },
  ],
  sources: [
    {
      id: 'S1',
      title: 'Why Homejoy Failed: A Post-Mortem',
      type: 'Case Study',
      year: 2018,
      url: 'https://example.com/homejoy-postmortem',
    },
    {
      id: 'S2',
      title: 'The Economics of On-Demand Food Delivery',
      type: 'Academic',
      year: 2019,
      url: 'https://example.com/food-delivery-economics',
    },
    {
      id: 'S3',
      title: 'Indian Food Delivery Market: Subsidy Wars and Consolidation',
      type: 'Industry Report',
      year: 2020,
      url: 'https://example.com/india-food-delivery',
    },
    {
      id: 'S4',
      title: 'Kozmo.com: The Rise and Fall of Free Delivery',
      type: 'Case Study',
      year: 2002,
      url: 'https://example.com/kozmo-case-study',
    },
    {
      id: 'S5',
      title: 'DoorDash S-1 Filing: Unit Economics Analysis',
      type: 'Financial Filing',
      year: 2020,
      url: 'https://example.com/doordash-s1',
    },
    {
      id: 'S6',
      title: 'Deliveroo Market Exit Analysis: UK Secondary Cities',
      type: 'Industry Report',
      year: 2019,
      url: 'https://example.com/deliveroo-exit',
    },
    {
      id: 'S7',
      title: 'Sprig Shutdown: Lessons in Negative Unit Economics',
      type: 'News',
      year: 2017,
      url: 'https://example.com/sprig-shutdown',
    },
  ],
  date: '2026-09-09',
  status: 'Completed',
  assumptionCount: 5,
  financialWarningCount: 1,
};

export const mockHistory: HistoryEntry[] = [
  {
    id: 'analysis-001',
    decision: 'Scale on-demand grocery delivery to 5 new cities with heavy promotional subsidies',
    date: '2026-09-09',
    assumptionCount: 5,
    financialWarnings: 1,
    status: 'Completed',
  },
  {
    id: 'analysis-002',
    decision: 'Pivot from B2C subscription to B2B enterprise licensing model',
    date: '2026-08-28',
    assumptionCount: 4,
    financialWarnings: 0,
    status: 'Completed',
  },
  {
    id: 'analysis-003',
    decision: 'Launch a freemium tier with usage limits to drive top-of-funnel growth',
    date: '2026-08-15',
    assumptionCount: 6,
    financialWarnings: 2,
    status: 'Completed',
  },
  {
    id: 'analysis-004',
    decision: 'Acquire a smaller competitor to consolidate market position',
    date: '2026-07-30',
    assumptionCount: 7,
    financialWarnings: 3,
    status: 'Completed',
  },
  {
    id: 'analysis-005',
    decision: 'Expand into European markets with localized product offering',
    date: '2026-07-12',
    assumptionCount: 5,
    financialWarnings: 1,
    status: 'Completed',
  },
  {
    id: 'analysis-006',
    decision: 'Transition from perpetual license to annual SaaS subscription pricing',
    date: '2026-06-25',
    assumptionCount: 3,
    financialWarnings: 0,
    status: 'Completed',
  },
  {
    id: 'analysis-007',
    decision: 'Build an in-house logistics network instead of using third-party providers',
    date: '2026-06-03',
    assumptionCount: 8,
    financialWarnings: 2,
    status: 'Processing',
  },
  {
    id: 'analysis-008',
    decision: 'Launch a marketplace model to diversify revenue beyond first-party sales',
    date: '2026-05-20',
    assumptionCount: 4,
    financialWarnings: 0,
    status: 'Failed',
  },
];

export function formatCurrency(value: number): string {
  if (value === Infinity) return 'N/A';
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  if (value === Infinity) return 'N/A';
  return value.toLocaleString('en-US');
}
