"use client";

import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(asset("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось войти");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-primary/10">
            <Lock className="size-5 text-primary" />
          </span>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Панель управления</h1>
            <p className="text-sm text-muted-foreground">Вход по паролю</p>
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Пароль</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
          />
        </label>

        {error && (
          <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-5 w-full" disabled={busy || !password}>
          {busy ? (
            <>
              <Loader2 className="size-5 animate-spin" /> Проверяем…
            </>
          ) : (
            "Войти"
          )}
        </Button>
      </form>
    </div>
  );
}
