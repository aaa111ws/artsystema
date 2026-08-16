"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, Mail, Menu, Phone, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCart } from "@/lib/cart";
import { useLeadModal } from "@/lib/lead-modal";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/content";

export function Header() {
  const { nav: NAV, site: SITE } = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count, open: openCart } = useCart();
  const { open: openLead } = useLeadModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Меню закрываем при уходе на десктопную ширину, чтобы не залипало открытым.
  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia("(min-width: 1280px)"); // xl — ширина, на которой появляется десктопное меню
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    document.body.style.overflow = "hidden";
    return () => {
      mq.removeEventListener("change", onChange);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Топбар с контактами: на мобильных прячем, чтобы шапка не съедала экран. */}
      <div
        className={cn(
          "hidden bg-ink text-ink-foreground transition-[height,opacity] duration-300 lg:block",
          scrolled ? "h-0 overflow-hidden opacity-0" : "h-10 opacity-100",
        )}
      >
        <div className="container-x flex h-10 items-center justify-between text-[0.8rem]">
          <span className="flex items-center gap-2 text-ink-foreground/70">
            <Clock className="size-3.5 text-primary" />
            {SITE.schedule} · {SITE.city}
          </span>
          <div className="flex items-center gap-5">
            <a href={SITE.emailHref} className="flex items-center gap-2 transition hover:text-primary">
              <Mail className="size-3.5 text-primary" />
              {SITE.email}
            </a>
            <a href={SITE.phoneHref} className="flex items-center gap-2 font-semibold transition hover:text-primary">
              <Phone className="size-3.5 text-primary" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-border bg-background/85 shadow-sm backdrop-blur-xl"
            : "border-transparent bg-background/60 backdrop-blur-md",
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Link href="/" aria-label="ART SYSTEMA — на главную">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={SITE.phoneHref}
              className="hidden text-sm font-bold tracking-tight transition hover:text-primary lg:block xl:hidden"
            >
              {SITE.phone}
            </a>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Корзина, позиций: ${count}`}
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
            >
              <ShoppingBag className="size-[1.15rem]" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[0.7rem] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </button>

            {/* Переключатель темы — всегда рядом с корзиной, на всех ширинах. */}
            <ThemeToggle />

            {/* Обёртка, а не className: cn() просто склеивает классы, и `hidden`
                проигрывает базовому `inline-flex` внутри компонента. */}
            <span className="hidden md:inline-flex">
              <Button onClick={() => openLead("Шапка сайта")}>Оставить заявку</Button>
            </span>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Открыть меню"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground xl:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,88vw)] flex-col bg-card shadow-2xl xl:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Закрыть меню"
                  className="rounded-full p-2 text-muted-foreground transition hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-base font-semibold transition",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="space-y-3 border-t border-border px-5 py-5">
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-2 text-lg font-bold tracking-tight"
                >
                  <Phone className="size-4 text-primary" />
                  {SITE.phone}
                </a>
                <a
                  href={SITE.emailHref}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Mail className="size-4 text-primary" />
                  {SITE.email}
                </a>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    setMenuOpen(false);
                    openLead("Мобильное меню");
                  }}
                >
                  Оставить заявку
                </Button>
                {/* Переключатель темы здесь не дублируем — он есть в шапке рядом с корзиной. */}
                <p className="pt-1 text-sm text-muted-foreground">{SITE.schedule}</p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
