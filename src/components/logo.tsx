import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-8 shrink-0 place-items-center bg-signal text-white">
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4">
          <path d="M1.8 17 9 3h2l7.2 14h-3.5l-1.2-3H6.5l-1.2 3H1.8Zm6-5.8h4.4L10 5.4 7.8 11.2Z" />
        </svg>
      </span>
      <span className="font-display text-2xl font-semibold uppercase leading-none tracking-[0.02em]">
        AutoNova
      </span>
    </span>
  );
}
