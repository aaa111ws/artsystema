import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { SESSION_COOKIE, isTokenValid } from "@/lib/auth";

/**
 * Загрузка фото товара. Файл кладётся в public/catalog под именем товара,
 * поэтому карточка подхватывает его сама, без правок в каталоге.
 */

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/webp", "webp"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/avif", "avif"],
]);

export async function POST(request: Request) {
  const jar = await cookies();
  if (!isTokenValid(jar.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "Нужен вход" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const id = String(form.get("id") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Файл не передан" }, { status: 400 });
  }
  // Код товара идёт в имя файла — пускаем только безопасные символы.
  if (!/^[a-z0-9-]+$/i.test(id)) {
    return NextResponse.json({ ok: false, error: "Недопустимый код товара" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Файл больше 8 МБ" }, { status: 413 });
  }

  const ext = ALLOWED.get(file.type);
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: "Нужен jpg, png, webp или avif" },
      { status: 415 },
    );
  }

  // На сервере каталог с фото тоже стоит вынести наружу (UPLOAD_DIR),
  // иначе загруженные снимки исчезнут при выкладке новой сборки.
  const dir = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), "public", "catalog");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${id}.${ext}`), Buffer.from(await file.arrayBuffer()));

  revalidatePath("/", "layout");

  // Возвращаем путь с меткой времени, чтобы браузер не показал старое фото из кэша.
  return NextResponse.json({ ok: true, path: `/catalog/${id}.${ext}?v=${Date.now()}` });
}
