export type AssessmentLevel = 'Insufficient Evidence' | 'Partially Supported' | 'Well Supported' | 'Contradicted';

export type Page = 'landing' | 'input' | 'processing' | 'results' | 'history';

export interface FinancialInputs {
  monthlyOrders: number;
  revenuePerOrder: number;
  variableCostPerOrder: number;
  promoSubsidy: number;
  deliveryCost: number;
  fixedCost: number;
  driverCost: number;
  cashBalance: number;
}

export interface FinancialResults {
  contributionMargin: number;
  contributionMarginPct: number;
  operatingProfit: number;
  monthlyBurn: number;
  runwayMonths: number;
  breakEvenOrders: number;
}

export interface Assumption {
  id: string;
  text: string;
  assessment: AssessmentLevel;
  summary: string;
  evidenceGaps: string[];
  validationExperiment: string;
}

export interface FailureMechanism {
  id: string;
  title: string;
  description: string;
  source: string;
  year: number;
}

export interface CompanyAnalogue {
  id: string;
  name: string;
  context: string;
  outcome: 'Failed' | 'Pivoted' | 'Succeeded';
  yearRange: string;
  relevance: string;
}

export interface ValidationExperiment {
  id: string;
  title: string;
  description: string;
  linkedAssumptionId: string;
  timeToRun: string;
  costLevel: 'Low' | 'Medium' | 'High';
}

export interface SourceItem {
  id: string;
  title: string;
  type: 'Academic' | 'Industry Report' | 'News' | 'Case Study' | 'Financial Filing';
  year: number;
  url: string;
}

export interface IDXBenchmark {
  metric: string;
  value: string;
  benchmark: string;
  status: 'Below Benchmark' | 'At Benchmark' | 'Above Benchmark';
}

export interface AnalysisResult {
  id: string;
  decisionTitle: string;
  summary: string;
  assumptions: Assumption[];
  directEvidenceCoverage: string;
  financialWarnings: string[];
  financialResults: FinancialResults;
  failureMechanisms: FailureMechanism[];
  companyAnalogues: CompanyAnalogue[];
  validationExperiments: ValidationExperiment[];
  idxBenchmarks: IDXBenchmark[];
  sources: SourceItem[];
  date: string;
  status: 'Completed' | 'Processing' | 'Failed';
  assumptionCount: number;
  financialWarningCount: number;
}

export interface HistoryEntry {
  id: string;
  decision: string;
  date: string;
  assumptionCount: number;
  financialWarnings: number;
  status: 'Completed' | 'Processing' | 'Failed';
}
