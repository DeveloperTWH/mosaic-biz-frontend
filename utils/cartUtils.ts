import { isUserLoggedIn } from './authUtils';

interface CartItem {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
  cartItemId?: string;
}

export interface CartItemDetailed extends CartItem {
  imageUrl?: string;
  color?: string;
  label?: string;
  stock?: number;
  allowBackorder?: boolean;
  title?: string;
  sku?: string;
  businessId?: string;

  // prices
  price?: number;                       // base price from API
  salePrice?: number | null;            // sale price (may be null)
  discountEndDate?: string | null;      // ISO string or null
  selectedSizePrice?: number;           // effective price the server computed

  // derived
  isSaleActive?: boolean;               // convenience flag
}


export type AddToCartResult = {
  success: boolean;
  reset?: boolean;               // cart was reset due to different business
  totalItems?: number;           // total units (if server returns it)
  message?: string;
};

export const addToCart = async (
  productId: string,
  variantId: string,
  size: string,
  quantity: number = 1,
  businessId?: string
): Promise<AddToCartResult> => {
  const loggedIn = await isUserLoggedIn();

  if (loggedIn) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        variantId,
        quantity,
        variant: { size }, // <-- IMPORTANT: backend expects { variant: { size } }
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // normalize common backend messages (422 for stock, 400 for invalid, etc.)
      const message =
        data?.message ||
        (res.status === 422 ? 'Not enough stock for the selected size.' :
          res.status === 400 ? 'Invalid selection or unavailable product/variant.' :
            'Failed to add to cart.');
      throw new Error(message);
    }

    return {
      success: true,
      reset: !!data.reset,
      totalItems: data?.cart?.totalItems,
      message: data?.message,
    };
  }

  // ----- Guest cart (localStorage) -----
  type GuestCartStore = { businessId: string | null; items: CartItem[] };

  const raw = localStorage.getItem('guest_cart');
  let store: GuestCartStore;

  // Backward-compat: migrate old array -> new shape
  if (!raw) {
    store = { businessId: businessId ?? null, items: [] };
  } else {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // old shape
        store = { businessId: businessId ?? null, items: parsed as CartItem[] };
      } else {
        store = parsed as GuestCartStore;
        // if businessId missing, seed it
        if (!store.businessId) store.businessId = businessId ?? null;
        if (!Array.isArray(store.items)) store.items = [];
      }
    } catch {
      store = { businessId: businessId ?? null, items: [] };
    }
  }

  let reset = false;
  // Enforce single-business rule
  if (store.businessId && businessId && store.businessId !== businessId) {
    store = { businessId, items: [] };
    reset = true;
  } else if (!store.businessId && businessId) {
    store.businessId = businessId;
  }

  // Upsert line
  const existing = store.items.find(
    it => it.productId === productId && it.variantId === variantId && it.size === size
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    console.log(`Adding new item to guest cart: ${productId}, ${variantId}, ${size}`, businessId);

    if (!businessId) throw new Error('Guest cart requires businessId');
    store.items.push({ productId, variantId, size, quantity });
  }

  localStorage.setItem('guest_cart', JSON.stringify(store));

  const totalItems = store.items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  return { success: true, totalItems, reset };
};


/**
 * Server -> Client mapper:
 * Your getCart controller returns items shaped like:
 * { productId, variantId, businessId, quantity, size, color, label, ... }
 * We normalize to CartItem (and keep cartItemId if present).
 */
function mapApiItemToCartItem(apiItem: any): CartItem {
  return {
    productId: apiItem.productId,
    variantId: apiItem.variantId,
    size: apiItem.size ?? apiItem.variant?.size, // be forgiving
    quantity: apiItem.quantity ?? 1,
    cartItemId: apiItem._id || apiItem.cartItemId, // if you later include it
  };
}

export const getCart = async (): Promise<CartItem[]> => {
  const loggedIn = await isUserLoggedIn();

  if (!loggedIn) {
    // guest branch in getCart()
    const raw = localStorage.getItem('guest_cart');
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);

      // If old shape (array), migrate to the new shape and return items
      if (Array.isArray(parsed)) {
        localStorage.setItem('guest_cart', JSON.stringify({ businessId: null, items: parsed }));
        return parsed;
      }

      // New shape: { businessId, items }
      if (parsed && Array.isArray(parsed.items)) {
        return parsed.items;
      }

      return [];
    } catch {
      return [];
    }

  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`, {
    credentials: 'include',
  });

  if (res.status === 404) {
    // Your controller may return 404 when no cart exists
    return [];
  }
  if (!res.ok) {
    throw new Error('Failed to fetch cart');
  }

  const data = await res.json();
  const apiItems = data?.cart?.items ?? [];
  return apiItems.map(mapApiItemToCartItem);
};

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

// --- helpers for id-based endpoints ---
export const updateCartItemQuantityById = async (cartItemId: string, newQuantity: number) => {
  const res = await fetch(`${BASE}/api/cart/update/${encodeURIComponent(cartItemId)}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: newQuantity }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || 'Failed to update cart quantity');
  }
};

export const removeCartItemById = async (cartItemId: string) => {
  const res = await fetch(`${BASE}/api/cart/remove/${encodeURIComponent(cartItemId)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || 'Failed to remove cart item');
  }
};

// --- main API ---
export const updateCartQuantity = async (
  productId: string,
  variantId: string,
  size: string,
  newQuantity: number
): Promise<void> => {
  const loggedIn = await isUserLoggedIn();

  if (!loggedIn) {
    type GuestCartStore = { businessId: string | null; items: CartItem[] };

    const raw = localStorage.getItem('guest_cart');
    let store: GuestCartStore;

    // Backward-compatible parse: support old array or new { businessId, items } shape
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) {
        store = { businessId: null, items: parsed as CartItem[] };
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
        store = { businessId: parsed.businessId ?? null, items: parsed.items as CartItem[] };
      } else {
        store = { businessId: null, items: [] };
      }
    } catch {
      store = { businessId: null, items: [] };
    }

    if (newQuantity <= 0) {
      store.items = store.items.filter(
        it => !(it.productId === productId && it.variantId === variantId && it.size === size)
      );
    } else {
      store.items = store.items.map(it =>
        it.productId === productId && it.variantId === variantId && it.size === size
          ? { ...it, quantity: newQuantity }
          : it
      );
    }

    localStorage.setItem('guest_cart', JSON.stringify(store));
    return;
  }


  // Logged-in: use composite-key endpoint (no IDs)
  const res = await fetch(`${BASE}/api/cart/update-quantity`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      variantId,
      // either of the two shapes are accepted by the server code:
      // size,
      variant: { size },
      quantity: newQuantity,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || 'Failed to update cart quantity');
  }
};


export const removeFromCart = async (
  productId: string,
  variantId: string,
  size: string
): Promise<void> => {
  const loggedIn = await isUserLoggedIn();

  if (!loggedIn) {
    const guestCart: CartItem[] = JSON.parse(localStorage.getItem('guest_cart') || '[]');
    const updated = guestCart.filter(it => !(it.productId === productId && it.variantId === variantId && it.size === size));
    localStorage.setItem('guest_cart', JSON.stringify(updated));
    return;
  }

  const res = await fetch(`${BASE}/api/cart/remove`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      variantId,
      // size,
      variant: { size },
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || 'Failed to remove item from cart');
  }
};


/* -------------------------------------------
   Helpers for ID-based endpoints (matches your controllers):
   PUT /api/cart/update/:cartItemId  { quantity }
   DELETE /api/cart/remove/:cartItemId
   Use these once your UI has access to cartItemId.
-------------------------------------------- */
// export const updateCartItemQuantityById = async (
//   cartItemId: string,
//   newQuantity: number
// ): Promise<void> => {
//   const loggedIn = await isUserLoggedIn();
//   if (!loggedIn) throw new Error('Guest cart does not use cartItemId');

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/update/${encodeURIComponent(cartItemId)}`,
//     {
//       method: 'PUT',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ quantity: newQuantity }),
//     }
//   );

//   if (!res.ok) {
//     const data = await res.json().catch(() => ({}));
//     throw new Error(data?.message || 'Failed to update cart item');
//   }
// };

// export const removeCartItemById = async (cartItemId: string): Promise<void> => {
//   const loggedIn = await isUserLoggedIn();
//   if (!loggedIn) throw new Error('Guest cart does not use cartItemId');

//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/remove/${encodeURIComponent(cartItemId)}`,
//     {
//       method: 'DELETE',
//       credentials: 'include',
//     }
//   );

//   if (!res.ok) {
//     const data = await res.json().catch(() => ({}));
//     throw new Error(data?.message || 'Failed to remove cart item');
//   }
// };



// --- helper (same as before) ---
const toNumber = (v: any): number =>
  v == null
    ? 0
    : typeof v === "number"
      ? v
      : typeof v === "object" && "$numberDecimal" in v
        ? Number(v.$numberDecimal) || 0
        : Number(v) || 0;

const toId = (v: any) => (typeof v === "string" ? v : v?._id);







const GUEST_CART_KEY = "guest_cart";

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
      <rect width='100%' height='100%' fill='#f3f4f6'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-size='14'>No image</text>
    </svg>`
  );

// ---------- localStorage ----------
function readGuestCart(): { businessId?: string; items: any[] } | null {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return null;
  }
}

// ---------- API fetchers (batch) ----------
type ProductMini = {
  _id: string;
  title?: string;
  coverImage?: string | null;
  price?: number;
  salePrice?: number | null;
  discountEndDate?: string | null;
};

type SizeMini = {
  size: string;
  stock?: number;
  price?: number;                     // already flattened by backend toJSON
  salePrice?: number | null;
  discountEndDate?: string | null;
  sku?: string;
};

// Replace your VariantMini with this:
type VariantMini = {
  _id: string;
  productId?: string;
  label?: string;
  color?: string;
  allowBackorder?: boolean;
  images?: string[];                  // <-- exists on response
  sizes?: SizeMini[];                 // <-- exists on response (filtered to the requested size)
};

// --- API fetchers (batch) ---
async function getProductsMini(ids: string[]): Promise<Record<string, ProductMini>> {
  if (!ids.length) return {};
  const res = await fetch(`${BASE}/api/cart/products/mini?ids=${encodeURIComponent(ids.join(","))}`);
  if (!res.ok) return {};
  const list: ProductMini[] = await res.json();
  return Object.fromEntries(list.map((p) => [p._id, p]));
}

async function getVariantsMini(
  ids: string[],
  filters?: { variantId: string; size: string }[]
): Promise<Record<string, VariantMini>> {
  if (!ids.length) return {};
  const res = await fetch(`${BASE}/api/cart/variants/mini`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, filters }),
  });
  if (!res.ok) return {};
  const list: VariantMini[] = await res.json();
  return Object.fromEntries(list.map((v) => [v._id, v]));
}

// --- buildGuestCartDetailed (key change: no fallback to sizes[0]) ---
async function buildGuestCartDetailed(): Promise<CartItemDetailed[]> {
  const stored = readGuestCart();
  const items = stored?.items ?? [];
  if (!items.length) return [];

  const productIds = items.map((i) => i.productId).filter(Boolean) as string[];
  const variantIds = items.map((i) => i.variantId).filter(Boolean) as string[];

  const sizeFilters = items
    .filter((i) => i.variantId && i.size)
    .map((i) => ({ variantId: i.variantId, size: String(i.size).toUpperCase() }));

  const [productMap, variantMap] = await Promise.all([
    getProductsMini(productIds),
    getVariantsMini(variantIds, sizeFilters),
  ]);

  const now = Date.now();
  const toNum = (x: any) => (x == null ? undefined : Number(x));

  return items.map((it): CartItemDetailed => {
    const p = productMap[it.productId];
    const v = it.variantId ? variantMap[it.variantId] : undefined;

    const sizeKey = it.size ? String(it.size).toUpperCase() : undefined;
    const sizeObj = v?.sizes?.find((s) => s.size === sizeKey); // <- no fallback

    const price = toNum(sizeObj?.price) ?? 0;
    const salePrice = toNum(sizeObj?.salePrice) ?? null;
    const discountEndISO = sizeObj?.discountEndDate ?? null;

    const isSaleActive =
      salePrice != null && discountEndISO != null && new Date(discountEndISO).getTime() > now;

    return {
      productId: it.productId,
      variantId: it.variantId,
      size: it.size,
      quantity: it.quantity ?? 1,

      businessId: stored?.businessId,
      title: p?.title ?? "Untitled",
      imageUrl: (v?.images?.[0] as string) || p?.coverImage || PLACEHOLDER_IMG,
      label: v?.label ?? undefined,
      color: v?.color ?? undefined,
      sku: sizeObj?.sku ?? undefined,
      stock: toNum(sizeObj?.stock),
      allowBackorder: v?.allowBackorder ?? false,

      price,
      salePrice,
      discountEndDate: discountEndISO,
      selectedSizePrice: price,

      isSaleActive,
    };
  });
}









// --- detailed getter (preserves all price fields) ---
export const getCartDetailed = async (): Promise<CartItemDetailed[]> => {
  const loggedIn = await isUserLoggedIn();

  if (loggedIn) {
    const res = await fetch(`${BASE}/api/cart`, { credentials: "include" });
    if (res.status === 404) return [];
    if (!res.ok) throw new Error("Failed to fetch cart");

    const data = await res.json();
    const apiItems = data?.cart?.items ?? [];

    return apiItems.map((it: any): CartItemDetailed => {
      const price = toNumber(it.price);
      const salePrice = it.salePrice == null ? null : toNumber(it.salePrice);
      const discountEndISO =
        it.discountEndDate ? new Date(it.discountEndDate).toISOString() : null;

      const isSaleActive =
        salePrice != null &&
        discountEndISO != null &&
        new Date(discountEndISO).getTime() > Date.now();

      return {
        productId: toId(it.productId),
        variantId: toId(it.variantId),
        size: it.size ?? it.variant?.size,
        quantity: it.quantity ?? 1,
        cartItemId: it._id || it.cartItemId,

        imageUrl: it.imageUrl ?? it.productId?.coverImage,
        color: it.color ?? it.variantId?.color,
        label: it.label ?? it.variantId?.label,
        stock: it.stock,
        sku: it.sku,
        allowBackorder: it.allowBackorder ?? it.variantId?.allowBackorder ?? false,
        title: it.title ?? it.productId?.title,
        businessId: toId(it.businessId),

        // prices
        price,
        salePrice,
        discountEndDate: discountEndISO,
        selectedSizePrice: toNumber(it.selectedSizePrice),

        // derived
        isSaleActive,
      };
    });
  }

  // Guest: return whatever is stored; (optional) enrich at add time
  try {
    // const raw = localStorage.getItem("guest_cart");
    // if (!raw) return [];
    // const parsed = JSON.parse(raw);
    // const items = Array.isArray(parsed) ? parsed : parsed?.items ?? [];
    // return items as CartItemDetailed[];
    return buildGuestCartDetailed();
  } catch {
    return [];
  }
};










type ShippingAddress = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};


function toLineItem(it: CartItemDetailed) {
  // choose effective price for the size/line
  const base = Number(it.price ?? it.selectedSizePrice ?? 0);
  const sale = it.salePrice != null ? Number(it.salePrice) : null;
  const onSale =
    sale != null &&
    it.discountEndDate != null &&
    new Date(it.discountEndDate).getTime() > Date.now();

  return {
    productId: String(it.productId),
    variantId: String(it.variantId),
    size: String(it.size),
    quantity: Number(it.quantity ?? 1),
    price: onSale ? Number(sale) : Number(base),
  };
}

/**
 * Orchestrates Place Order:
 * - Requires login (redirects to /login?redirect=/checkout/payment)
 * - Builds items from cart
 * - Calls initiateOrder
 * - Redirects to /checkout/payment with orderId (you can also use clientSecret if you render Stripe there)
 */
export async function handlePlaceOrderFlow(address: ShippingAddress, userNote?: string) {
  const loggedIn = await isUserLoggedIn();
  const paymentPage = "/checkout/payment";

  if (!loggedIn) {
    window.location.href = `/login?redirect=${encodeURIComponent(paymentPage)}`;
    return;
  }

  // Build items from the current cart
  const cart: CartItemDetailed[] = await getCartDetailed();
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  // (Optional) Quick client-side sanity: ensure each line has variant & size
  for (const it of cart) {
    if (!it.productId || !it.variantId || !it.size) {
      alert("One or more items are missing variant/size. Please re-add them.");
      return;
    }
  }

  const items = cart.map(toLineItem);

  // Call initiateOrder
  const res = await fetch(`${BASE}/api/orders/initiate`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      shippingAddress: address,
      userNote: userNote ?? "",
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.message || "Failed to initiate order";
    alert(msg);
    return;
  }

  const data = await res.json();
  const { orderId, groupOrderId, clientSecret } = data;

  // Redirect to payment page; pass what you need there
  const url = new URL(paymentPage, window.location.origin);
  url.searchParams.set("orderId", String(orderId));
  if (groupOrderId) url.searchParams.set("groupOrderId", String(groupOrderId));
  if (clientSecret) url.searchParams.set("clientSecret", String(clientSecret));
  window.location.href = url.toString();
}