"use client";

interface HeaderProps {
  authSlot?: React.ReactNode;
  exportImportSlot?: React.ReactNode;
}

export function Header({ authSlot, exportImportSlot }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-bg-primary/90 backdrop-blur-md shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.03)]">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-text-primary">
            jmc grade calculator
          </h1>
          <span className="rounded-md border border-border-subtle bg-bg-tertiary px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
            2025/26
          </span>
        </div>
        <div className="flex items-center gap-3">
          {exportImportSlot}
          {authSlot}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
      <div className="h-px bg-gradient-to-r from-transparent via-border-secondary to-transparent" />
    </header>
  );
}
