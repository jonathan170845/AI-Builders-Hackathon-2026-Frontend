interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export default function SectionCard({ title, icon, children, className = '', action }: SectionCardProps) {
  return (
    <section className={`glass-card overflow-hidden ${className}`}>
      <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06]">
              {icon}
            </div>
          )}
          <h2 className="font-display text-base font-semibold text-white">{title}</h2>
        </div>
        {action}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}
