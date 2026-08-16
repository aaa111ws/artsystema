import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content-types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Приём заявок индексировать нечего — это не страница.
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}${basePath}/sitemap.xml`,
    host: SITE_URL,
  };
}
