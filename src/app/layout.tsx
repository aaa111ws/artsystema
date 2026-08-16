import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { CartDrawer } from "@/components/ui/cart-drawer";
import { LeadModal } from "@/components/ui/lead-modal";
import { headers } from "next/headers";
import { getContent } from "@/lib/content-server";

export const metadata: Metadata = {
  title: {
    default: "ART SYSTEMA — подвесные системы для картин и фотографий",
    template: "%s — ART SYSTEMA",
  },
  description:
    "Установка подвесных систем для картин и фотографий по Москве и области. Европейское производство, доставка во все регионы России, гарантия 12 месяцев.",
  keywords: [
    "подвесная система для картин",
    "рельсовая система STAS",
    "система развески картин",
    "крепление для картин без сверления",
    "подвесные системы Москва",
  ],
  openGraph: {
    title: "ART SYSTEMA — подвесные системы для картин и фотографий",
    description:
      "Бесплатный подбор, выезд замерщика за 24 часа, монтаж любой сложности, гарантия 12 месяцев.",
    type: "website",
    locale: "ru_RU",
    siteName: "ART SYSTEMA",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1017" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const { site } = content.site;
  // В админке каркас сайта не нужен — она живёт на своей вёрстке.
  const isAdmin = (await headers()).get("x-pathname")?.startsWith("/admin") ?? false;

  /** Разметка для поиска: карточка организации с контактами. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: content.site.about.lead,
    telephone: site.phoneHref.replace("tel:", ""),
    email: site.email,
    areaServed: "RU",
    address: { "@type": "PostalAddress", addressCountry: "RU", addressLocality: "Москва" },
    openingHours: "Mo-Su 09:00-19:00",
    priceRange: "₽₽",
  };

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Manrope грузится в браузере, а не на этапе сборки: билд не зависит от сети. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers content={content}>
          {isAdmin ? (
            children
          ) : (
            <>
              {/* Каркас общий для всех страниц: шапка, футер, корзина, модалка заявки. */}
              <Header />
              <main>{children}</main>
              <Footer />
              <FloatingActions />
              <CartDrawer />
              <LeadModal />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
