"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAdminAuth } from "@/components/admin/admin-auth-provider";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { session, ready } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !session) router.replace("/admin/login");
  }, [ready, session, router]);

  if (!ready || !session) {
    return (
      <div
        className="flex min-h-svh items-center justify-center bg-background"
        role="status"
        aria-label="Verificando sesión"
      >
        <Loader2 className="size-6 animate-spin text-signal-ink" aria-hidden="true" />
      </div>
    );
  }

  return <>{children}</>;
}
