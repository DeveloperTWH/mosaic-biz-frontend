"use client";

import { useCallback, useEffect, useState } from "react";
import { readGuestCart, countGuestCart } from "@/utils/guestCart";
import { fetchRealCartCount } from "@/utils/cartApi";

type Result = { count: number; source: "guest" | "real"; loading: boolean };

export function useCartCount(isLoggedIn: boolean | null): Result {
  const [count, setCount] = useState(0);
  const [source, setSource] = useState<"guest" | "real">("guest");
  const [loading, setLoading] = useState(true);

  const refreshGuest = useCallback(() => {
    setCount(countGuestCart());
    setSource("guest");
  }, []);

  const refreshReal = useCallback(async () => {
    setLoading(true);
    try {
      const c = await fetchRealCartCount();
      setCount(c);
      setSource("real");
    } catch {
      setCount(0);
      setSource("real");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial + on isLoggedIn change
  useEffect(() => {
    if (isLoggedIn) {
      refreshReal();
    } else {
      setLoading(false);
      refreshGuest();
    }
  }, [isLoggedIn, refreshGuest, refreshReal]);

  // Live updates:
  // - Guest: watch localStorage + custom "cart:update"
  // - Real: listen to a custom "cart:server:update" that you dispatch after server mutations
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!isLoggedIn && e.key === "guest_cart") refreshGuest();
    };
    const onGuestUpdate = () => { if (!isLoggedIn) refreshGuest(); };
    const onServerUpdate = () => { if (isLoggedIn) refreshReal(); };

    window.addEventListener("storage", onStorage);
    window.addEventListener("cart:update", onGuestUpdate);
    window.addEventListener("cart:server:update", onServerUpdate);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart:update", onGuestUpdate);
      window.removeEventListener("cart:server:update", onServerUpdate);
    };
  }, [isLoggedIn, refreshGuest, refreshReal]);

  return { count, source, loading };
}
