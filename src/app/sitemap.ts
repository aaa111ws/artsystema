import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content-types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Карта сайта. priority — подсказка о важности страницы внутри сайта:
 * главная и каталог приносят заявки, служебные страницы нужны для полноты.
 */
const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/catalog", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/works", priority: 0.8, changeFrequency: "monthly" },
  { path: "/delivery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contacts", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${basePath}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
