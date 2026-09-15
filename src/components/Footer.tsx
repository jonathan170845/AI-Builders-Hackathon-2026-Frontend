import veritasLogo from '@/assets/veritas-logo.png';

export default function Footer() {
  return (
    <footer className="border-t border-slate-400/20 bg-[#142238]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white p-1">
              <img
                src={veritasLogo}
                alt="Veritas logo"
                className="h-full w-full object-contain"
              />
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
