"use client";

type SkeletonBarProps = {
  className?: string;
};

export function SkeletonBar({ className = "h-3 w-full" }: SkeletonBarProps) {
  return (
    <div className={`rounded-md bg-gradient-to-r from-bg-tertiary via-bg-hover to-bg-tertiary bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] ${className}`} />
  );
}

export function SkeletonGroup() {
  return (
    <div className="rounded-xl border border-border-primary bg-bg-secondary p-4 space-y-3">
      <SkeletonBar className="h-4 w-32" />
      <SkeletonBar className="h-2 w-full" />
      <SkeletonBar className="h-2 w-3/4" />
      <SkeletonBar className="h-2 w-5/6" />
      <SkeletonBar className="h-2 w-2/3" />
    </div>
  );
}
