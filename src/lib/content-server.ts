import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { CatalogContent, Content, SiteContent } from "@/lib/content-types";

/**
 * Чтение и запись контента. Данные лежат в JSON рядом с проектом,
 * поэтому правки из админки видны без пересборки сайта.
 */

/**
 * Где лежат данные. На сервере папку стоит вынести за пределы проекта
 * (CONTENT_DIR=/var/www/artsystema-data), иначе правки из админки
 * затрутся при следующей выкладке новой сборки.
 */
const DIR = process.env.CONTENT_DIR
  ? path.resolve(process.env.CONTENT_DIR)
  : path.join(process.cwd(), "content");
const SITE_FILE = path.join(DIR, "site.json");
const CATALOG_FILE = path.join(DIR, "catalog.json");

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, "utf8")) as T;
}

export async function getSiteContent(): Promise<SiteContent> {
  return readJson<SiteContent>(SITE_FILE);
}

export async function getCatalogContent(): Promise<CatalogContent> {
  return readJson<CatalogContent>(CATALOG_FILE);
}

export async function getContent(): Promise<Content> {
  const [site, catalog] = await Promise.all([getSiteContent(), getCatalogContent()]);
  return { site, catalog };
}

/** Запись идёт через временный файл, чтобы не оставить обрубок при сбое. */
async function writeJson(file: string, data: unknown) {
  await mkdir(DIR, { recursive: true });
  const tmp = `${file}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  const { rename } = await import("node:fs/promises");
  await rename(tmp, file);
}

export async function saveSiteContent(data: SiteContent) {
  await writeJson(SITE_FILE, data);
}

export async function saveCatalogContent(data: CatalogContent) {
  await writeJson(CATALOG_FILE, data);
}
