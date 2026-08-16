/** Склейка классов без внешних зависимостей: falsy-значения отбрасываются. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Телефон в формат ссылки tel: (цифры и ведущий плюс). */
export function telHref(phone: string) {
  return "tel:+" + phone.replace(/\D/g, "").replace(/^8/, "7");
}

/** Путь к файлу в /public с учётом basePath (сайт может стоять в подпапке). */
export function asset(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
