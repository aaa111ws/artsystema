import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Works } from "@/components/sections/works";
import { Clients } from "@/components/sections/clients";

export const metadata: Metadata = {
  title: "Наши работы",
  description:
    "Объекты, где установлены подвесные системы ART SYSTEMA: музеи, галереи, офисы, административные здания и частные интерьеры.",
};

export default function WorksPage() {
  return (
    <>
      <PageHero
        title="Наши работы"
        subtitle="Музеи, галереи, офисы и частные интерьеры. Нажмите на фото, чтобы посмотреть его целиком."
      />
      <Works />
      <Clients />
    </>
  );
}
