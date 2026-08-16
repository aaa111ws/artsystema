import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Catalog } from "@/components/sections/catalog";

export const metadata: Metadata = {
  title: "Каталог продукции",
  description:
    "Рельсовые скрытые и открытые подвесные системы, тросы, лески и крючки. Цены и нагрузки.",
};

export default function CatalogPage() {
  return (
    <>
      <PageHero
        title="Каталог производимой продукции"
        subtitle="Рельсовые подвесные системы, тросовые системы и аксессуары. Цены указаны за единицу товара."
      />
      <Catalog />
    </>
  );
}
