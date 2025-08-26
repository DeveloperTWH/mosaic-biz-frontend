"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { mergeGuestCartToServer } from "@/utils/cartApi";

type GuestCartStore = { businessId: string | null; items: any[] };

export default function CartSyncPrompt() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [guest, setGuest] = useState<GuestCartStore | null>(null);
  const [count, setCount] = useState(0);

  // helper: read guest cart
  const readGuest = (): GuestCartStore | null => {
    try {
      const raw = localStorage.getItem("guest_cart");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return { businessId: null, items: parsed };
      const items = Array.isArray(parsed?.items) ? parsed.items : [];
      return { businessId: parsed?.businessId ?? null, items };
    } catch {
      return null;
    }
  };

  // open prompt if logged in & guest cart has items; only once per tab
  const maybeOpen = () => {
    if (sessionStorage.getItem("cart_sync_checked") === "1") return;

    const isLoggedIn = localStorage.getItem("user_session") === "true";
    if (!isLoggedIn) return;

    const g = readGuest();
    const total = g?.items?.reduce((s: number, i: any) => s + (Number(i?.quantity) || 0), 0) || 0;

    if (g && total > 0) {
      setGuest(g);
      setCount(total);
      setOpen(true);
    } else {
      sessionStorage.setItem("cart_sync_checked", "1");
    }
  };

  useEffect(() => {
    // on mount
    maybeOpen();

    // respond to login events
    const onLogin = () => maybeOpen();
    window.addEventListener("auth:login", onLogin);
    return () => window.removeEventListener("auth:login", onLogin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSync = async () => {
    if (!guest) return;
    if (!guest.businessId) {
      toast.error("Guest cart missing businessId. Cannot sync.");
      sessionStorage.setItem("cart_sync_checked", "1");
      setOpen(false);
      return;
    }
    setBusy(true);
    try {
      await mergeGuestCartToServer({ businessId: guest.businessId, items: guest.items });
      localStorage.removeItem("guest_cart");
      sessionStorage.setItem("cart_sync_checked", "1");
      window.dispatchEvent(new Event("cart:server:update"));
      toast.success("Cart synced to your account.");
    } catch (e: any) {
      toast.error(e?.message || "Failed to sync cart.");
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  const handleDiscard = () => {
    setBusy(true);
    try {
      localStorage.removeItem("guest_cart");
      sessionStorage.setItem("cart_sync_checked", "1");
      window.dispatchEvent(new Event("cart:update"));
      window.dispatchEvent(new Event("cart:server:update"));
      toast.info("Guest cart cleared.");
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-sm p-4 bg-white shadow-lg rounded-xl">
        <h3 className="text-base font-semibold">Sync your cart?</h3>
        <p className="mt-1 text-sm text-gray-600">
          We found <b>{count}</b> item{count > 1 ? "s" : ""} in your guest cart. Add
          {count > 1 ? " them" : " it"} to your account cart?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            disabled={busy}
            onClick={handleDiscard}
            className="px-3 py-1.5 rounded border text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Discard
          </button>
          <button
            disabled={busy}
            onClick={handleSync}
            className="px-3 py-1.5 rounded bg-sky-600 text-white text-sm hover:bg-sky-700 disabled:opacity-50"
          >
            {busy ? "Syncing…" : "Sync & Keep"}
          </button>
        </div>
      </div>
    </div>
  );
}
