import type { GuestCart } from "@/types/cart";

export const readGuestCart = (): GuestCart => {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem("guest_cart");
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
};

export const writeGuestCart = (cart: GuestCart) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("guest_cart", JSON.stringify(cart));
  // same-tab live update
  window.dispatchEvent(new Event("cart:update"));
};

export const countGuestCart = (cart = readGuestCart()): number =>
  Array.isArray(cart.items)
    ? cart.items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)
    : 0;
