"use client";

import { Modal } from "@/components/ui/modal";
import { LeadForm } from "@/components/ui/lead-form";
import { useLeadModal } from "@/lib/lead-modal";
import { Phone } from "lucide-react";
import { useSiteContent } from "@/lib/content";

export function LeadModal() {
  const { site: SITE } = useSiteContent();
  const { isOpen, close, source } = useLeadModal();

  return (
    <Modal open={isOpen} onClose={close} title="Оставить заявку">
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        Подберём систему под ваши работы бесплатно и назовём точную стоимость с монтажом.
        Замерщик выезжает в течение 24 часов.
      </p>
      <LeadForm source={source} onSuccess={() => undefined} />
      <a
        href={SITE.phoneHref}
        className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary"
      >
        <Phone className="size-4 text-primary" />
        Или позвоните: {SITE.phone}
      </a>
    </Modal>
  );
}
