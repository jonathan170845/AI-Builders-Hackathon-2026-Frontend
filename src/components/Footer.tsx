import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-400/20 bg-[#142238]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300">
              <Compass className="h-4.5 w-4.5 text-navy-950" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base font-bold text-white">Veritas</span>
          </div>
          <p className="text-sm text-slate-400">
            Understand the risks. Make better business decisions.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span>© 2026 Veritas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
