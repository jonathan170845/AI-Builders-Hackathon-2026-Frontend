import { Brain } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'landing') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.06] mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500">
              <Brain className="h-4.5 w-4.5 text-navy-950" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base font-bold text-white">Veritas</span>
          </div>
          <p className="text-sm text-slate-500">
            AI Decision Stress-Testing Platform — Built for rigorous pre-commitment analysis.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <button onClick={() => onNavigate('landing')} className="hover:text-slate-300 transition-colors">
              Home
            </button>
            <span className="text-slate-700">|</span>
            <span>© 2026 Veritas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
