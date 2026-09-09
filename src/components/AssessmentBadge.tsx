import type { AssessmentLevel } from '@/types';

interface BadgeProps {
  level: AssessmentLevel;
  size?: 'sm' | 'md';
}

const badgeConfig: Record<AssessmentLevel, { bg: string; text: string; border: string; dot: string }> = {
  'Insufficient Evidence': {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    dot: 'bg-red-400',
  },
  'Partially Supported': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
  },
  'Well Supported': {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  'Contradicted': {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    dot: 'bg-rose-400',
  },
};

export default function AssessmentBadge({ level, size = 'md' }: BadgeProps) {
  const config = badgeConfig[level];
  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse`} />
      {level}
    </span>
  );
}
