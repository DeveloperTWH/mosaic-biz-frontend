"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getAuthenticatedUser, isAdmin } from "@/utils/authUtils";

type AuthState =
  | { status: "checking" }
  | { status: "allowed" }
  | { status: "unauthenticated" }
  | { status: "forbidden"; homeHref: string }
  | { status: "error"; message: string };

function getHomeHrefForRole(role: string): string {
  switch (role) {
    case "business_owner":
      return "/partners";
    case "customer":
      return "/customer/order";
    default:
      return "/";
  }
}

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>({ status: "checking" });

  useEffect(() => {
    let cancelled = false;

    const verifyAdmin = async () => {
      try {
        const user = await getAuthenticatedUser();

        if (cancelled) {
          return;
        }

        if (!user) {
          setAuthState({ status: "unauthenticated" });
          router.replace(
            `/signin?redirect=${encodeURIComponent(pathname || "/admin")}`
          );
          return;
        }

        if (!isAdmin(user)) {
          setAuthState({
            status: "forbidden",
            homeHref: getHomeHrefForRole(user.role),
          });
          return;
        }

        setAuthState({ status: "allowed" });
      } catch {
        if (!cancelled) {
          setAuthState({
            status: "error",
            message:
              "Unable to verify admin access. Check your connection and try again.",
          });
        }
      }
    };

    verifyAdmin();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (authState.status === "checking" || authState.status === "unauthenticated") {
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

  if (authState.status === "forbidden") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-semibold text-gray-900">Admin access required</h1>
          <p className="mt-3 text-sm text-gray-600">
            Your account is signed in but does not have permission to view the admin
            console.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={authState.homeHref}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Go to your account
            </Link>
            <Link
              href="/signin"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Admin sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (authState.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-semibold text-gray-900">Could not verify access</h1>
          <p className="mt-3 text-sm text-gray-600">{authState.message}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Try again
            </button>
            <Link
              href={`/signin?redirect=${encodeURIComponent(pathname || "/admin")}`}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Admin sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
