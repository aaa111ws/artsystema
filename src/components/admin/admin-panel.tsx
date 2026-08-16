"use client";

import { Check, ExternalLink, Loader2, LogOut, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CatalogEditor } from "@/components/admin/catalog-editor";
import { FieldEditor } from "@/components/admin/field-editor";
import { asset, cn } from "@/lib/utils";
import type { CatalogContent, Content, SiteContent } from "@/lib/content-types";

/** Разделы панели. Ключи совпадают с полями site.json — форма строится сама. */
const SITE_TABS: { key: keyof SiteContent; label: string; hint: string }[] = [
  { key: "site", label: "Контакты", hint: "Телефон, почта, режим работы — подставляются по всему сайту." },
  { key: "nav", label: "Меню", hint: "Пункты верхнего меню и мобильного меню." },
  { key: "hero", label: "Первый экран", hint: "Заголовок, преимущества и подписи формы заявки." },
  { key: "about", label: "О компании", hint: "Текст на странице «О компании»." },
  { key: "advantages", label: "Преимущества", hint: "Карточки с иконками." },
  { key: "services", label: "Услуги", hint: "Список услуг на странице «Наши услуги»." },
  { key: "delivery", label: "Доставка", hint: "Условия доставки и оплаты." },
  { key: "works", label: "Работы", hint: "Галерея выполненных объектов." },
  { key: "faq", label: "Вопросы", hint: "Блок вопросов и ответов." },
  { key: "stats", label: "Цифры", hint: "Показатели на первом экране." },
  { key: "clients", label: "Клиенты", hint: "Логотипы в блоке «Нам доверяют»." },
];

type Tab = "catalog" | keyof SiteContent;

export function AdminPanel({ initial }: { initial: Content }) {
  const router = useRouter();
  const [site, setSite] = useState<SiteContent>(initial.site);
  const [catalog, setCatalog] = useState<CatalogContent>(initial.catalog);
  const [tab, setTab] = useState<Tab>("catalog");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const touch = () => {
    setDirty(true);
    setStatus("idle");
  };

  async function save() {
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch(asset("/api/admin/content"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site, catalog }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось сохранить");
      setStatus("saved");
      setDirty(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить");
      setStatus("idle");
    }
  }

  async function logout() {
    await fetch(asset("/api/admin/login"), { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  const activeSiteTab = SITE_TABS.find((t) => t.key === tab);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <h1 className="mr-auto text-base font-bold tracking-tight">
            Панель управления сайтом
          </h1>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-semibold transition hover:border-primary/50 hover:text-primary"
          >
            <ExternalLink className="size-4" /> Открыть сайт
          </Link>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:border-red-500/50 hover:text-red-500"
          >
            <LogOut className="size-4" /> Выйти
          </button>

          <button
            type="button"
            onClick={save}
            disabled={status === "saving" || !dirty}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
          >
            {status === "saving" ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Сохраняем…
              </>
            ) : status === "saved" ? (
              <>
                <Check className="size-4" /> Сохранено
              </>
            ) : (
              <>
                <Save className="size-4" /> Сохранить
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="border-t border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        {dirty && !error && (
          <p className="border-t border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-sm font-medium text-amber-700 dark:text-amber-400">
            Есть несохранённые изменения — нажмите «Сохранить», чтобы они попали на сайт.
          </p>
        )}
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <nav className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("catalog")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              tab === "catalog"
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground",
            )}
          >
            Каталог и цены
          </button>
          {SITE_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "catalog" ? (
          <CatalogEditor
            catalog={catalog}
            onChange={(next) => {
              setCatalog(next);
              touch();
            }}
          />
        ) : (
          activeSiteTab && (
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-bold tracking-tight">{activeSiteTab.label}</h2>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">{activeSiteTab.hint}</p>
              <FieldEditor
                value={site[activeSiteTab.key]}
                onChange={(next) => {
                  setSite({ ...site, [activeSiteTab.key]: next } as SiteContent);
                  touch();
                }}
              />
            </section>
          )
        )}
      </div>
    </div>
  );
}
