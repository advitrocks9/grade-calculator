"use client";

type HeaderProps = {
  syncSlot?: React.ReactNode;
  recoverySlot?: React.ReactNode;
};

export function Header({ syncSlot, recoverySlot }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border-primary bg-bg-primary/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-text-primary">
            JMC Grade Hub
          </h1>
          <span className="rounded-md bg-bg-tertiary px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
            2025/26
          </span>
        </div>
        <div className="flex items-center gap-3">
          {syncSlot}
          {recoverySlot}
        </div>
      </div>
    </header>
  );
}
