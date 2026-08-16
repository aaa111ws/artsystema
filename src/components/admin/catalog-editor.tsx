"use client";

import { ChevronDown, ImageUp, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { asset } from "@/lib/utils";
import { productImage, type CatalogContent, type Product } from "@/lib/content-types";

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition " +
  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

/** Код товара нужен латиницей: он идёт в имя файла с фото. */
function makeId(name: string, taken: string[]) {
  const map: Record<string, string> = {
    а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",
    н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"c",ч:"ch",ш:"sh",щ:"sch",
    ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
  };
  const base =
    name.toLowerCase().split("").map((ch) => map[ch] ?? ch).join("")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "tovar";
  let id = base;
  let n = 2;
  while (taken.includes(id)) id = `${base}-${n++}`;
  return id;
}

export function CatalogEditor({
  catalog,
  onChange,
}: {
  catalog: CatalogContent;
  onChange: (next: CatalogContent) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [stamp, setStamp] = useState<Record<string, string>>({});

  const setProduct = (id: string, patch: Partial<Product>) =>
    onChange({
      ...catalog,
      products: catalog.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });

  const addProduct = () => {
    const id = makeId("Новый товар", catalog.products.map((p) => p.id));
    const product: Product = {
      id,
      name: "Новый товар",
      category: catalog.categories[0]?.id ?? "cable",
      variants: [{ label: "Стандартный", price: 0 }],
    };
    onChange({ ...catalog, products: [product, ...catalog.products] });
    setOpenId(id);
  };

  const removeProduct = (id: string, name: string) => {
    if (!confirm(`Удалить товар «${name}»? Это действие нельзя отменить.`)) return;
    onChange({ ...catalog, products: catalog.products.filter((p) => p.id !== id) });
  };

  async function uploadPhoto(product: Product, file: File) {
    setUploading(product.id);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("id", product.id);
      const res = await fetch(asset("/api/admin/upload"), { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось загрузить");
      // Путь с меткой времени — чтобы browser показал новое фото, а не старое из кэша.
      setStamp((s) => ({ ...s, [product.id]: data.path }));
      if (!data.path.startsWith(`/catalog/${product.id}.webp`)) {
        setProduct(product.id, { image: String(data.path).split("?")[0] });
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Не удалось загрузить");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-base font-bold tracking-tight">Разделы каталога</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Вкладки на странице каталога. Код раздела задаётся при создании и связывает его с товарами.
        </p>
        <div className="mt-4 space-y-3">
          {catalog.categories.map((c, i) => (
            <div key={c.id} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Название</span>
                <input
                  className={inputClass}
                  value={c.title}
                  onChange={(e) => {
                    const cats = [...catalog.categories];
                    cats[i] = { ...c, title: e.target.value };
                    onChange({ ...catalog, categories: cats });
                  }}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Коротко (вкладка)</span>
                <input
                  className={inputClass}
                  value={c.short}
                  onChange={(e) => {
                    const cats = [...catalog.categories];
                    cats[i] = { ...c, short: e.target.value };
                    onChange({ ...catalog, categories: cats });
                  }}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Описание</span>
                <input
                  className={inputClass}
                  value={c.description}
                  onChange={(e) => {
                    const cats = [...catalog.categories];
                    cats[i] = { ...c, description: e.target.value };
                    onChange({ ...catalog, categories: cats });
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold tracking-tight">Товары</h2>
            <p className="mt-1 text-sm text-muted-foreground">Всего позиций: {catalog.products.length}</p>
          </div>
          <button
            type="button"
            onClick={addProduct}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" /> Добавить товар
          </button>
        </div>

        {uploadError && (
          <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600">
            {uploadError}
          </p>
        )}

        <ul className="mt-4 space-y-2">
          {catalog.products.map((p) => {
            const open = openId === p.id;
            return (
              <li key={p.id} className="rounded-xl border border-border">
                <div className="flex items-center gap-3 p-3">
                  <img
                    src={stamp[p.id] ?? asset(productImage(p))}
                    alt=""
                    className="size-12 shrink-0 rounded-lg bg-white object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : p.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        от {Math.min(...p.variants.map((v) => v.price))} ₽ · {p.variants.length} исполн.
                      </span>
                    </span>
                    <ChevronDown className={"size-4 shrink-0 transition " + (open ? "rotate-180" : "")} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProduct(p.id, p.name)}
                    aria-label={`Удалить ${p.name}`}
                    className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {open && (
                  <div className="space-y-4 border-t border-border p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Название</span>
                        <input
                          className={inputClass}
                          value={p.name}
                          onChange={(e) => setProduct(p.id, { name: e.target.value })}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Раздел</span>
                        <select
                          className={inputClass}
                          value={p.category}
                          onChange={(e) => setProduct(p.id, { category: e.target.value })}
                        >
                          {catalog.categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Описание</span>
                      <textarea
                        rows={2}
                        className={inputClass + " resize-y"}
                        value={p.description ?? ""}
                        onChange={(e) =>
                          setProduct(p.id, { description: e.target.value || undefined })
                        }
                      />
                    </label>

                    <label className="block max-w-xs">
                      <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Нагрузка</span>
                      <input
                        className={inputClass}
                        placeholder="например: до 15 кг"
                        value={p.load ?? ""}
                        onChange={(e) => setProduct(p.id, { load: e.target.value || undefined })}
                      />
                    </label>

                    <div>
                      <span className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">
                        Исполнения и цены
                      </span>
                      <div className="space-y-2">
                        {p.variants.map((v, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              className={inputClass}
                              placeholder="например: 200 см"
                              value={v.label}
                              onChange={(e) => {
                                const variants = [...p.variants];
                                variants[i] = { ...v, label: e.target.value };
                                setProduct(p.id, { variants });
                              }}
                            />
                            <input
                              type="number"
                              min={0}
                              className={inputClass + " max-w-32"}
                              value={v.price}
                              onChange={(e) => {
                                const variants = [...p.variants];
                                variants[i] = { ...v, price: Number(e.target.value) };
                                setProduct(p.id, { variants });
                              }}
                            />
                            <span className="text-sm text-muted-foreground">₽</span>
                            <button
                              type="button"
                              disabled={p.variants.length < 2}
                              onClick={() =>
                                setProduct(p.id, { variants: p.variants.filter((_, j) => j !== i) })
                              }
                              aria-label="Удалить исполнение"
                              className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-30"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            setProduct(p.id, { variants: [...p.variants, { label: "", price: 0 }] })
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                        >
                          <Plus className="size-3.5" /> Добавить исполнение
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:border-primary/50 hover:text-primary">
                        {uploading === p.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <ImageUp className="size-4" />
                        )}
                        Загрузить фото
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadPhoto(p, file);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      <span className="text-xs text-muted-foreground">
                        jpg, png, webp или avif, до 8 МБ. Код товара: {p.id}
                      </span>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
