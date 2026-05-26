"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const verifyAdmin = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/auth/check`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();

        if (cancelled) {
          return;
        }

        if (data?.user?.role !== "admin") {
          router.replace(`/signin?redirect=${encodeURIComponent(pathname || "/admin")}`);
          return;
        }

        setCheckingAuth(false);
      } catch (error) {
        if (!cancelled) {
          router.replace(`/signin?redirect=${encodeURIComponent(pathname || "/admin")}`);
        }
      }
    };

    verifyAdmin();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600" />
          <p className="mt-4 text-sm font-medium text-gray-600">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
