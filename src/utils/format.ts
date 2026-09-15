export function formatNumber(value: number | null): string {
  return value === null || !Number.isFinite(value) ? 'N/A' : value.toLocaleString('en-US', { maximumFractionDigits: 4 });
}
export const formatAmount = (value: number | null) => value === null || !Number.isFinite(value) ? 'N/A' : value.toLocaleString('en-US', { maximumFractionDigits: 2 });
const warnings: Record<string, string> = {
  NEGATIVE_CONTRIBUTION_MARGIN: 'Contribution margin is negative.',
  NEGATIVE_OPERATING_PROFIT: 'Monthly operating profit is negative.',
  NON_POSITIVE_NET_REVENUE: 'Revenue after promotions is zero or negative.',
  LOW_RUNWAY: 'Cash runway is below the configured threshold.',
  BREAK_EVEN_UNREACHABLE: 'Break-even cannot be reached with the current contribution margin.',
};
export const warningLabel = (code: string) => warnings[code] || code;
export const safeSourceUrl = (url: string | null) => url && /^https?:\/\//i.test(url) ? url : undefined;
