import { useEffect, useId, useRef, useState } from 'react';

export default function EvidenceCoverage({ supported, total, compact = false }: { supported: number; total: number; compact?: boolean }) {
  const target = total > 0 ? Math.min(100, Math.max(0, supported / total * 100)) : 0;
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const gradientId = useId();
  const tone = target < 40
    ? { label: 'Low coverage', start: '#fda4af', end: '#fb7185' }
    : target < 80
      ? { label: 'Moderate coverage', start: '#fde68a', end: '#fbbf24' }
      : { label: 'High coverage', start: '#a7f3d0', end: '#34d399' };

  useEffect(() => {
    let frame = 0;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animate = () => {
      cancelAnimationFrame(frame);
      if (preference.matches || target === 0) { setValue(target); return; }
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = Math.min((now - start) / 900, 1);
        setValue(target * (1 - Math.pow(1 - elapsed, 3)));
        if (elapsed < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { animate(); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    const onPreference = () => { if (preference.matches) { cancelAnimationFrame(frame); setValue(target); } };
    preference.addEventListener('change', onPreference);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); preference.removeEventListener('change', onPreference); };
  }, [target]);

  return (
    <div ref={ref} role="img" title={`${tone.label}: ${supported} of ${total} assumptions supported. Low: below 40%; moderate: 40–79%; high: 80–100%.`} aria-label={`${Math.round(target)}% evidence coverage; ${tone.label}; ${supported} of ${total} assumptions supported`} className={`relative flex shrink-0 items-center justify-center ${compact ? 'h-14 w-14' : 'h-20 w-20'}`}>
      <svg aria-hidden="true" viewBox="0 0 80 80" className="absolute inset-0 h-full w-full -rotate-90">
        <defs><linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={tone.start} /><stop offset="100%" stopColor={tone.end} /></linearGradient></defs>
        <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(148,163,184,0.25)" strokeWidth="6" />
        {value > 0 && <circle cx="40" cy="40" r="35" fill="none" stroke={`url(#${gradientId})`} strokeWidth="6" pathLength="100" strokeDasharray={`${value} 100`} />}
      </svg>
      <span aria-hidden="true" style={{ color: tone.start }} className={`font-display font-semibold tabular-nums ${compact ? 'text-base' : 'text-xl'}`}>{Math.round(value)}%</span>
    </div>
  );
}
