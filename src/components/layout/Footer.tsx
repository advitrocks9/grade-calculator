export function Footer() {
  return (
    <footer className="py-10">
      <div className="mb-2 h-px bg-gradient-to-r from-transparent via-border-primary to-transparent" />
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <p className="text-xs text-text-muted leading-relaxed">
          This is an unofficial tool. Grade calculations may not reflect final
          university results. Always check official Imperial College records for
          confirmed marks.
        </p>
        <p className="mt-3 text-[10px] text-text-muted/50">
          Built for JMC Y1
        </p>
      </div>
    </footer>
  );
}
