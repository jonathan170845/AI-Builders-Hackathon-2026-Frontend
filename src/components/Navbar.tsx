import { Compass, History, Home, PlusCircle } from 'lucide-react';
import type { Page } from '@/types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const navItems: { page: Page; label: string; icon: typeof Home }[] = [
    { page: 'landing', label: 'Home', icon: Home },
    { page: 'input', label: 'New Analysis', icon: PlusCircle },
    { page: 'history', label: 'History', icon: History },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-400/20 bg-[#142238]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300 shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
              <Compass className="h-5 w-5 text-navy-950" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold text-white tracking-tight">
              Veritas
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ page, label, icon: Icon }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-white/[0.06] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

        </div>

        <div className="flex md:hidden items-center gap-1 pb-3 -mx-1 overflow-x-auto scrollbar-thin">
          {navItems.map(({ page, label, icon: Icon }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                currentPage === page
                  ? 'bg-white/[0.06] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
