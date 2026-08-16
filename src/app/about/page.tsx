import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { About } from "@/components/sections/about";
import { Clients } from "@/components/sections/clients";
import { Faq } from "@/components/sections/faq";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "Компания ART SYSTEMA занимается продажей и установкой подвесных систем для картин и фотографий уже более 12 лет.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Немного о компании"
        subtitle="Компания ART SYSTEMA занимается продажей и установкой подвесных систем для картин и фотографий уже более 12 лет."
      />
      <About />
      <Clients />
      <Faq />
    </>
  );
}
