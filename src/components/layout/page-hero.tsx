import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Шапка внутренней страницы: хлебные крошки + заголовок. */
export function PageHero({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <section className="border-b border-border bg-muted/40">
      <div className="container-x pb-10 pt-28 lg:pb-14 lg:pt-36">
        <nav aria-label="Хлебные крошки" className="flex items-center gap-1.5 text-sm">
          <Link href="/" className="text-muted-foreground transition hover:text-primary">
            Главная
          </Link>
          <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span className="font-semibold">{eyebrow ?? title}</span>
        </nav>

        <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
