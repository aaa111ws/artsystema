import { cn } from "@/lib/utils";

/** Знак: рельс с двумя подвесами — читается и в 24px. */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none">
          <path d="M3 5h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M8 5v6M16 5v9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="5" y="11" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <rect x="13.5" y="14" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block text-[1.05rem] font-extrabold tracking-tight",
            tone === "light" && "text-ink-foreground",
          )}
        >
          ART SYSTEMA
        </span>
        <span
          className={cn(
            "mt-0.5 block text-[0.65rem] font-medium uppercase tracking-[0.18em]",
            tone === "light" ? "text-ink-foreground/60" : "text-muted-foreground",
          )}
        >
          подвесные системы
        </span>
      </span>
    </span>
  );
}
