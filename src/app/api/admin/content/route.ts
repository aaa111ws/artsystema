import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, isTokenValid } from "@/lib/auth";
import { getContent, saveCatalogContent, saveSiteContent } from "@/lib/content-server";
import type { CatalogContent, SiteContent } from "@/lib/content-types";

/** Чтение и сохранение контента. Доступно только с действующей сессией. */

async function authorized() {
  const jar = await cookies();
  return isTokenValid(jar.get(SESSION_COOKIE)?.value);
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ ok: false, error: "Нужен вход" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, content: await getContent() });
}

export async function PUT(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ ok: false, error: "Нужен вход" }, { status: 401 });
  }

  let body: { site?: SiteContent; catalog?: CatalogContent };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  if (body.site) {
    if (!body.site.site?.name) {
      return NextResponse.json({ ok: false, error: "Название сайта не может быть пустым" }, { status: 422 });
    }
    await saveSiteContent(body.site);
  }

  if (body.catalog) {
    const ids = body.catalog.products.map((p) => p.id);
    const dup = ids.find((id, i) => ids.indexOf(id) !== i);
    if (dup) {
      return NextResponse.json(
        { ok: false, error: `Два товара с одинаковым кодом: ${dup}` },
        { status: 422 },
      );
    }
    if (ids.some((id) => !id.trim())) {
      return NextResponse.json({ ok: false, error: "У товара пустой код" }, { status: 422 });
    }
    await saveCatalogContent(body.catalog);
  }

  // Страницы кэшируются, поэтому после правок их нужно пересобрать.
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
