"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Задержка каскада внутри группы карточек, в секундах. */
  delay?: number;
  className?: string;
  as?: "div" | "li";
};

/**
 * Появление при скролле. Разметка приходит с сервера уже видимой —
 * прятать элемент имеет право только клиент, и только если он ниже экрана.
 * Так контент не исчезает при выключенном или ещё не загруженном JS.
 */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  // useLayoutEffect, а не useEffect: прячем до отрисовки кадра, иначе мигнёт.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Уже на экране — анимировать нечего, оставляем как есть.
    if (el.getBoundingClientRect().top < window.innerHeight - 60) return;

    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "shown";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
