export async function fetchRealCartCount(): Promise<number> {
    console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/count`);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/count`, {
        method: "GET",
        credentials: "include", // if using cookies
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return Number(data?.count || 0);
}



type GuestCartPayload = {
    businessId: string;              // REQUIRED
    items: Array<{
        productId: string;
        variantId: string;
        size?: string;
        quantity: number;
    }>;
};



export async function mergeGuestCartToServer(
    payload: GuestCartPayload
): Promise<number> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/merge`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "merge failed");

    // let navbar refetch the real cart badge
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cart:server:update"));
    }

    return Number(data?.count ?? data?.cartTotal ?? 0);
}
