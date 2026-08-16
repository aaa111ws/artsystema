"use client";

import { Plus, Trash2 } from "lucide-react";

/**
 * Универсальный редактор структуры контента: сам разбирает объекты,
 * массивы и строки, поэтому годится для любого текста сайта — от заголовка
 * до списка вопросов. Новые поля в JSON появляются здесь автоматически.
 */

/** Человеческие названия для ключей — иначе в форме были бы «formTitle» и «meta». */
const LABELS: Record<string, string> = {
  name: "Название",
  tagline: "Подзаголовок",
  phone: "Телефон",
  phoneHref: "Ссылка телефона",
  whatsapp: "Ссылка WhatsApp",
  email: "Почта",
  emailHref: "Ссылка почты",
  schedule: "Режим работы",
  city: "География",
  years: "Лет на рынке",
  topbar: "Строка над заголовком",
  title: "Заголовок",
  points: "Пункты",
  formTitle: "Заголовок формы",
  formText: "Текст формы",
  formButton: "Кнопка формы",
  lead: "Вводный текст",
  paragraphs: "Абзацы",
  value: "Значение",
  label: "Подпись",
  icon: "Иконка",
  text: "Текст",
  note: "Примечание",
  href: "Ссылка",
  src: "Файл",
  place: "Объект",
  meta: "Пояснение",
  q: "Вопрос",
  a: "Ответ",
  items: "Пункты",
  moscow: "Москва и область",
  russia: "Регионы России",
  payment: "Оплата",
  short: "Короткое название",
  description: "Описание",
  price: "Цена",
  load: "Нагрузка",
  variants: "Исполнения",
  category: "Категория",
  image: "Своё фото",
  id: "Код",
};

const labelFor = (key: string) => LABELS[key] ?? key;

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition " +
  "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

/** Длинные тексты удобнее править в textarea. */
const isLong = (key: string, value: string) =>
  value.length > 90 || ["lead", "text", "a", "description", "formText"].includes(key);

type Props = {
  value: unknown;
  onChange: (next: unknown) => void;
  fieldKey?: string;
  level?: number;
};

export function FieldEditor({ value, onChange, fieldKey = "", level = 0 }: Props) {
  if (typeof value === "string") {
    return isLong(fieldKey, value) ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(8, Math.ceil(value.length / 80) + 1)}
        className={inputClass + " resize-y"}
      />
    ) : (
      <input value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputClass + " max-w-40"}
      />
    );
  }

  if (Array.isArray(value)) {
    const addItem = () => {
      const sample = value[0];
      const blank =
        typeof sample === "string" || sample === undefined
          ? ""
          : typeof sample === "number"
            ? 0
            : Object.fromEntries(Object.keys(sample as object).map((k) => [k, typeof (sample as Record<string, unknown>)[k] === "number" ? 0 : Array.isArray((sample as Record<string, unknown>)[k]) ? [] : ""]));
      onChange([...value, blank]);
    };

    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <FieldEditor
                value={item}
                fieldKey={fieldKey}
                level={level + 1}
                onChange={(next) => {
                  const copy = [...value];
                  copy[i] = next;
                  onChange(copy);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              aria-label="Удалить пункт"
              className="mt-1 rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/50 hover:text-primary"
        >
          <Plus className="size-3.5" /> Добавить
        </button>
      </div>
    );
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return (
      <div
        className={
          level > 0
            ? "space-y-3 rounded-xl border border-border bg-muted/30 p-3"
            : "space-y-4"
        }
      >
        {Object.entries(obj).map(([key, val]) => (
          <label key={key} className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {labelFor(key)}
            </span>
            <FieldEditor
              value={val}
              fieldKey={key}
              level={level + 1}
              onChange={(next) => onChange({ ...obj, [key]: next })}
            />
          </label>
        ))}
      </div>
    );
  }

  return null;
}
