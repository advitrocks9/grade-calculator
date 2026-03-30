export function Footer() {
  return (
    <footer className="py-8">
      <div className="h-px bg-gradient-to-r from-transparent via-border-primary to-transparent" />
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <p className="text-xs text-text-muted leading-relaxed">
          This is an unofficial tool. Grade calculations may not reflect final
          university results. Always check official Imperial College records for
          confirmed marks.
        </p>
      </div>
    </footer>
  );
}
