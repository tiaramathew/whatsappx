"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, MessageCircle } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-pulse">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Check if user is active
  if (!session.user.isActive) {
    router.push("/login?error=account_disabled");
    return null;
  }

  return <>{children}</>;
}
