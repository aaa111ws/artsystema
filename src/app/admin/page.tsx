import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, isTokenValid } from "@/lib/auth";
import { getContent } from "@/lib/content-server";
import { AdminPanel } from "@/components/admin/admin-panel";

/** Данные всегда свежие: админка правит их прямо во время работы. */
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const jar = await cookies();
  if (!isTokenValid(jar.get(SESSION_COOKIE)?.value)) redirect("/admin/login");

  const content = await getContent();
  return <AdminPanel initial={content} />;
}
