import { isUserLoggedIn } from './authUtils';

interface CartItem {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
  cartItemId?: string;
  price?: number;
  salePrice?: number | null;
  discountEndDate?: string | null;
  selectedSizePrice?: number;
  shippingType?: 'standard' | 'express' | 'overnight' | 'local';
  shippingMethod?: 'standard' | 'express' | 'overnight' | 'local';
  shippingCost?: number;
  shippingCharge?: number;
  shipping?: {
    standard?: number;
    express?: number;
    overnight?: number;
    local?: number;
  } | null;
  imageUrl?: string;
  color?: string;
  label?: string;
  stock?: number;
  allowBackorder?: boolean;
  title?: string;
  sku?: string;
  taxCategory?: {
    code: string;
    label: string;
  } | null;
  taxRate?: number;
  taxIncluded?: boolean;
  priceExclTax?: number;
  priceInclTax?: number;
  salePriceExclTax?: number | null;
  salePriceInclTax?: number | null;
  selectedSizePriceExclTax?: number;
  selectedSizePriceInclTax?: number;
  lineTaxAmount?: number;
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

type ShippingType = 'standard' | 'express' | 'overnight' | 'local';
type DeliverySpeed = 'standard' | 'express' | 'overnight' | 'local';

export interface CartPricingSummary {
  business?: {
    _id?: string;
    businessName?: string;
    slug?: string;
  };
  availableDeliverySpeeds?: DeliverySpeed[];
  selectedDeliverySpeed?: DeliverySpeed;
  subtotalExclTax?: number;
  subtotalAmount?: number;
  subtotalInclTax?: number;
  taxAmount?: number;
  taxIncluded?: boolean;
  totalQuantity?: number;
  shipping?: {
    deliverySpeed?: DeliverySpeed;
    amount?: number;
    method?: "flat_rate" | "quantity_based" | string;
    freeShippingApplied?: boolean;
    freeShippingThreshold?: number | null;
    matchedTier?: {
      minQuantity?: number | null;
      maxQuantity?: number | null;
    } | null;
  } | null;
  shippingError?: string | null;
  totalAmount?: number;
  totalInclTax?: number;
  currency?: string;
}

export interface CartDetailedResponse {
  items: CartItemDetailed[];
  pricing?: CartPricingSummary | null;
  totalItems?: number;
  businessId?: string;
}

type GuestCartItemMeta = {
  price?: number;
  salePrice?: number | null;
  discountEndDate?: string | null;
  selectedSizePrice?: number;
  taxCategory?: {
    code: string;
    label: string;
  } | null;
  taxRate?: number;
  taxIncluded?: boolean;
  priceExclTax?: number;
  priceInclTax?: number;
  salePriceExclTax?: number | null;
  salePriceInclTax?: number | null;
  selectedSizePriceExclTax?: number;
  selectedSizePriceInclTax?: number;
  lineTaxAmount?: number;
  shippingType?: ShippingType;
  shippingMethod?: ShippingType;
  shippingCost?: number;
  shippingCharge?: number;
  shipping?: {
    standard?: number;
    express?: number;
    overnight?: number;
    local?: number;
  } | null;
  imageUrl?: string;
  color?: string;
  label?: string;
  stock?: number;
  allowBackorder?: boolean;
  title?: string;
  sku?: string;
};


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
  businessId?: string,
  meta?: GuestCartItemMeta
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
        shippingMethod: meta?.shippingMethod ?? meta?.shippingType,
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

    // 🔔 Notify navbar to refetch server cart count (no reload)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cart:server:update'));
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
    if (meta) Object.assign(existing, meta);
  } else {
    console.log(`Adding new item to guest cart: ${productId}, ${variantId}, ${size}`, businessId);

    if (!businessId) throw new Error('Guest cart requires businessId');
    store.items.push({ productId, variantId, size, quantity, ...meta });
  }

  localStorage.setItem('guest_cart', JSON.stringify(store));
  // 🔔 Notify navbar to recompute guest cart count immediately
  window.dispatchEvent(new Event('cart:update'));

  const totalItems = store.items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  return { success: true, totalItems, reset };
};


const toId = (v: any) => (typeof v === "string" ? v : v?._id);

const toVariantId = (v: any) =>
  typeof v === "string" ? v : v?.variantId ?? v?._id;

/**
 * Server -> Client mapper:
 * Your getCart controller returns items shaped like:
 * { productId, variantId, businessId, quantity, size, color, label, ... }
 * We normalize to CartItem (and keep cartItemId if present).
 */
function mapApiItemToCartItem(apiItem: any): CartItem {
  return {
    productId: toId(apiItem.productId),
    variantId: toVariantId(apiItem.variantId),
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
  // 🔔 notify navbar to refetch server count
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart:server:update'));
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
  // 🔔 notify navbar to refetch server count
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart:server:update'));
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
    window.dispatchEvent(new Event('cart:update'));
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
  // 🔔 notify navbar to refetch server count
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart:server:update'));
  }
};


export const removeFromCart = async (
  productId: string,
  variantId: string,
  size: string
): Promise<void> => {
  const loggedIn = await isUserLoggedIn();

  if (!loggedIn) {
    type GuestCartStore = { businessId: string | null; items: CartItem[] };
    const raw = localStorage.getItem('guest_cart');
    let store: GuestCartStore;
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
    store.items = store.items.filter(
      it => !(it.productId === productId && it.variantId === variantId && it.size === size)
    );
    localStorage.setItem('guest_cart', JSON.stringify(store));
    // 🔔 update navbar immediately for guest cart
    window.dispatchEvent(new Event('cart:update'));
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
  // 🔔 notify navbar to refetch server count
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cart:server:update'));
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

const isSalePriceActive = (salePrice: number | null | undefined, discountEndDate?: string | null) => {
  if (salePrice == null) return false;
  if (!discountEndDate) return true;
  return new Date(discountEndDate).getTime() > Date.now();
};

export const resolveDisplayPrice = (
  basePrice: number | null | undefined,
  salePrice: number | null | undefined,
  saleActive: boolean
) => {
  const base = toNumber(basePrice);
  const sale = salePrice == null ? null : toNumber(salePrice);

  if (!saleActive || sale == null || sale <= 0) {
    return {
      current: base,
      original: base,
      onSale: false,
    };
  }

  return {
    current: sale,
    original: base > 0 ? base : sale,
    onSale: base > 0 && base !== sale,
  };
};







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
  taxCategory?: {
    code: string;
    label: string;
  } | null;
  taxRate?: number;
  taxIncluded?: boolean;
  priceExclTax?: number;
  priceInclTax?: number;
  salePriceExclTax?: number | null;
  salePriceInclTax?: number | null;
};

type SizeMini = {
  size: string;
  stock?: number;
  price?: number;                     // already flattened by backend toJSON
  salePrice?: number | null;
  discountEndDate?: string | null;
  sku?: string;
  taxCategory?: {
    code: string;
    label: string;
  } | null;
  taxRate?: number;
  taxIncluded?: boolean;
  priceExclTax?: number;
  priceInclTax?: number;
  salePriceExclTax?: number | null;
  salePriceInclTax?: number | null;
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
  shipping?: {
    standard?: number;
    express?: number;
    overnight?: number;
    local?: number;
  } | null;
  taxCategory?: {
    code: string;
    label: string;
  } | null;
  taxRate?: number;
  taxIncluded?: boolean;
  priceExclTax?: number;
  priceInclTax?: number;
  salePriceExclTax?: number | null;
  salePriceInclTax?: number | null;
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

const publicProductCache = new Map<string, Promise<any | null>>();

async function getPublicProduct(productId: string): Promise<any | null> {
  if (!productId) return null;

  if (!publicProductCache.has(productId)) {
    publicProductCache.set(
      productId,
      fetch(`${BASE}/api/public/product/${encodeURIComponent(productId)}`)
        .then(async (res) => {
          if (!res.ok) return null;
          const data = await res.json().catch(() => ({}));
          return data?.data ?? null;
        })
        .catch(() => null)
    );
  }

  return publicProductCache.get(productId) ?? null;
}

const sameId = (a: unknown, b: unknown) => String(a ?? "") === String(b ?? "");

const getBusinessIdFromProduct = (product: any) =>
  typeof product?.businessId === "string"
    ? product.businessId
    : product?.businessId?._id ?? product?.business?._id;

async function hydrateCartItemFromPublicProduct(item: CartItemDetailed): Promise<CartItemDetailed> {
  const productId = String(item.productId || "");
  if (!productId) return item;

  const needsHydration =
    !item.title ||
    !item.imageUrl ||
    !item.selectedSizePrice ||
    Number(item.selectedSizePrice) <= 0 ||
    item.stock == null ||
    !item.shipping;

  if (!needsHydration) return item;

  const product = await getPublicProduct(productId);
  if (!product) return item;

  const variant = product.variants?.find((candidate: any) => {
    return (
      sameId(candidate?.variantId, item.variantId) ||
      sameId(candidate?._id, item.variantId) ||
      sameId(candidate?.id, item.variantId)
    );
  });

  if (!variant) {
    return {
      ...item,
      title: item.title ?? product.title,
      imageUrl: item.imageUrl ?? product.coverImage ?? PLACEHOLDER_IMG,
      businessId: item.businessId ?? getBusinessIdFromProduct(product),
    };
  }

  const basePrice = toNumber(variant.price ?? item.price ?? item.selectedSizePrice);
  const salePrice = variant.salePrice == null ? item.salePrice ?? null : toNumber(variant.salePrice);
  const priceExclTax = toNumber(
    variant.priceExclTax ?? product.priceExclTax ?? item.priceExclTax ?? basePrice
  );
  const priceInclTax = toNumber(
    variant.priceInclTax ?? product.priceInclTax ?? item.priceInclTax ?? item.selectedSizePrice ?? basePrice
  );
  const salePriceExclTax =
    variant.salePriceExclTax == null && product.salePriceExclTax == null && item.salePriceExclTax == null
      ? salePrice
      : toNumber(variant.salePriceExclTax ?? product.salePriceExclTax ?? item.salePriceExclTax);
  const salePriceInclTax =
    variant.salePriceInclTax == null && product.salePriceInclTax == null && item.salePriceInclTax == null
      ? salePrice
      : toNumber(variant.salePriceInclTax ?? product.salePriceInclTax ?? item.salePriceInclTax);
  const discountEndDate = variant.discountEndDate ?? item.discountEndDate ?? null;
  const saleActive = isSalePriceActive(salePrice, discountEndDate);
  const shippingMethod: ShippingType =
    item.shippingMethod === "overnight" || item.shippingMethod === "local"
      ? item.shippingMethod
      : item.shippingType === "overnight" || item.shippingType === "local"
        ? item.shippingType
        : "standard";
  const shipping = variant.shipping ?? product.shipping ?? item.shipping ?? null;
  const hasLineShippingCost = item.shippingCost != null || item.shippingCharge != null;
  const shippingCost = hasLineShippingCost
    ? toNumber(item.shippingCost ?? item.shippingCharge)
    : toNumber(shipping?.[shippingMethod]);
  const resolvedPriceExclTax = resolveDisplayPrice(
    priceExclTax,
    salePriceExclTax ?? salePrice,
    saleActive
  );
  const resolvedPriceInclTax = resolveDisplayPrice(
    priceInclTax,
    salePriceInclTax ?? salePrice,
    saleActive
  );
  const selectedSizePrice =
    item.selectedSizePrice && Number(item.selectedSizePrice) > 0
      ? Number(item.selectedSizePrice)
      : resolvedPriceInclTax.current;
  const selectedSizePriceExclTax = resolvedPriceExclTax.current;
  const selectedSizePriceInclTax = resolvedPriceInclTax.current;
  const taxRate = toNumber(variant.taxRate ?? product.taxRate ?? item.taxRate);
  const lineTaxAmount =
    item.lineTaxAmount != null
      ? toNumber(item.lineTaxAmount)
      : Math.max(0, selectedSizePriceInclTax - selectedSizePriceExclTax) * Number(item.quantity ?? 1);

  return {
    ...item,
    variantId: toVariantId(variant) ?? item.variantId,
    size: item.size || variant.attributes?.size || variant.attributes?.Size || "default",
    businessId: item.businessId ?? getBusinessIdFromProduct(product) ?? variant.businessId,
    title: item.title ?? product.title ?? "Untitled",
    imageUrl: item.imageUrl ?? variant.images?.[0] ?? product.coverImage ?? PLACEHOLDER_IMG,
    color: item.color ?? variant.attributes?.Color ?? variant.attributes?.color,
    label: item.label ?? variant.label,
    sku: item.sku ?? variant.sku,
    stock: item.stock ?? toNumber(variant.stock),
    allowBackorder: item.allowBackorder ?? variant.allowBackorder ?? false,
    price: basePrice,
    salePrice,
    taxCategory: item.taxCategory ?? variant.taxCategory ?? product.taxCategory ?? null,
    taxRate,
    taxIncluded: item.taxIncluded ?? variant.taxIncluded ?? product.taxIncluded ?? true,
    priceExclTax,
    priceInclTax,
    salePriceExclTax,
    salePriceInclTax,
    discountEndDate,
    selectedSizePrice,
    selectedSizePriceExclTax,
    selectedSizePriceInclTax,
    lineTaxAmount,
    shippingType: shippingMethod,
    shippingMethod,
    shippingCost,
    shippingCharge: shippingCost,
    shipping,
    isSaleActive: saleActive,
  };
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

  const toNum = (x: any) => (x == null ? undefined : Number(x));

  const detailedItems = items.map((it): CartItemDetailed => {
    const p = productMap[it.productId];
    const v = it.variantId ? variantMap[it.variantId] : undefined;

    const sizeKey = it.size ? String(it.size).toUpperCase() : undefined;
    const sizeObj = v?.sizes?.find((s) => s.size === sizeKey); // <- no fallback

    const price = toNum(sizeObj?.price) ?? toNum(it.price) ?? 0;
    const salePrice = toNum(sizeObj?.salePrice) ?? toNum(it.salePrice) ?? null;
    const priceExclTax =
      toNum(sizeObj?.priceExclTax) ??
      toNum(v?.priceExclTax) ??
      toNum(p?.priceExclTax) ??
      toNum(it.priceExclTax) ??
      price;
    const priceInclTax =
      toNum(sizeObj?.priceInclTax) ??
      toNum(v?.priceInclTax) ??
      toNum(p?.priceInclTax) ??
      toNum(it.priceInclTax) ??
      price;
    const salePriceExclTax =
      toNum(sizeObj?.salePriceExclTax) ??
      toNum(v?.salePriceExclTax) ??
      toNum(p?.salePriceExclTax) ??
      toNum(it.salePriceExclTax) ??
      salePrice;
    const salePriceInclTax =
      toNum(sizeObj?.salePriceInclTax) ??
      toNum(v?.salePriceInclTax) ??
      toNum(p?.salePriceInclTax) ??
      toNum(it.salePriceInclTax) ??
      salePrice;
    const discountEndISO = sizeObj?.discountEndDate ?? it.discountEndDate ?? null;
    const shippingType: ShippingType =
      it.shippingType === 'express' ||
      it.shippingType === 'overnight' ||
      it.shippingType === 'local'
        ? it.shippingType
        : 'standard';
    const variantShippingCost = v?.shipping?.[shippingType];
    const shippingCost = toNum(variantShippingCost) ?? toNum(it.shippingCost) ?? 0;

    const isSaleActive = isSalePriceActive(salePrice, discountEndISO);

    const resolvedPriceExclTax = resolveDisplayPrice(
      priceExclTax,
      salePriceExclTax ?? salePrice,
      isSaleActive
    );
    const resolvedPriceInclTax = resolveDisplayPrice(
      priceInclTax,
      salePriceInclTax ?? salePrice,
      isSaleActive
    );
    const selectedSizePrice =
      toNum(it.selectedSizePrice) ??
      resolvedPriceInclTax.current;
    const selectedSizePriceExclTax =
      toNum(it.selectedSizePriceExclTax) ??
      resolvedPriceExclTax.current;
    const selectedSizePriceInclTax =
      toNum(it.selectedSizePriceInclTax) ??
      resolvedPriceInclTax.current;
    const quantity = it.quantity ?? 1;
    const taxRate = toNum(sizeObj?.taxRate) ?? toNum(v?.taxRate) ?? toNum(p?.taxRate) ?? toNum(it.taxRate) ?? 0;
    const lineTaxAmount =
      toNum(it.lineTaxAmount) ??
      Math.max(0, selectedSizePriceInclTax - selectedSizePriceExclTax) * quantity;

    return {
      productId: it.productId,
      variantId: it.variantId,
      size: it.size,
      quantity,

      businessId: stored?.businessId,
      title: p?.title ?? it.title ?? "Untitled",
      imageUrl: (v?.images?.[0] as string) || it.imageUrl || p?.coverImage || PLACEHOLDER_IMG,
      label: v?.label ?? it.label ?? undefined,
      color: v?.color ?? it.color ?? undefined,
      sku: sizeObj?.sku ?? it.sku ?? undefined,
      stock: toNum(sizeObj?.stock),
      allowBackorder: v?.allowBackorder ?? it.allowBackorder ?? false,

      price,
      salePrice,
      taxCategory: it.taxCategory ?? sizeObj?.taxCategory ?? v?.taxCategory ?? p?.taxCategory ?? null,
      taxRate,
      taxIncluded: it.taxIncluded ?? sizeObj?.taxIncluded ?? v?.taxIncluded ?? p?.taxIncluded ?? true,
      priceExclTax,
      priceInclTax,
      salePriceExclTax,
      salePriceInclTax,
      discountEndDate: discountEndISO,
      selectedSizePrice,
      selectedSizePriceExclTax,
      selectedSizePriceInclTax,
      lineTaxAmount,
      shippingType,
      shippingCost,
      shippingCharge: shippingCost,
      shipping: v?.shipping ?? it.shipping ?? null,

      isSaleActive,
    };
  });

  return Promise.all(detailedItems.map(hydrateCartItemFromPublicProduct));
}









// --- detailed getter (preserves all price fields) ---
export const getCartDetailed = async (): Promise<CartItemDetailed[]> => {
  const data = await getCartDetailedResponse();
  return data.items;
};

export const getCartDetailedResponse = async (
  deliverySpeed?: DeliverySpeed
): Promise<CartDetailedResponse> => {
  const loggedIn = await isUserLoggedIn();

  if (loggedIn) {
    const params = new URLSearchParams();
    if (deliverySpeed) {
      params.set("deliverySpeed", deliverySpeed);
    }

    const url = `${BASE}/api/cart${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetch(url, { credentials: "include" });
    if (res.status === 404) return { items: [], pricing: null };
    if (!res.ok) throw new Error("Failed to fetch cart");

    const data = await res.json();
    const apiItems = data?.cart?.items ?? [];

    const detailedItems = apiItems.map((it: any): CartItemDetailed => {
      const price = toNumber(it.price);
      const salePrice = it.salePrice == null ? null : toNumber(it.salePrice);
      const priceExclTax = toNumber(it.priceExclTax ?? it.productId?.priceExclTax);
      const priceInclTax = toNumber(it.priceInclTax ?? it.productId?.priceInclTax ?? it.selectedSizePrice);
      const salePriceExclTax =
        it.salePriceExclTax == null ? null : toNumber(it.salePriceExclTax);
      const salePriceInclTax =
        it.salePriceInclTax == null ? null : toNumber(it.salePriceInclTax);
      const discountEndISO =
        it.discountEndDate ? new Date(it.discountEndDate).toISOString() : null;
      const shipping = it.shipping
        ? {
            standard: toNumber(it.shipping.standard),
            express: toNumber(it.shipping.express),
            overnight: toNumber(it.shipping.overnight),
            local: toNumber(it.shipping.local),
          }
        : null;
      const shippingCharge = toNumber(it.shippingCharge ?? it.shippingCost);
      const shippingMethod = it.shippingMethod ?? it.shippingType;

      const isSaleActive = isSalePriceActive(salePrice, discountEndISO);

      return {
        productId: toId(it.productId),
        variantId: toVariantId(it.variantId),
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
        taxCategory: it.taxCategory ?? null,
        taxRate: toNumber(it.taxRate),
        taxIncluded: it.taxIncluded ?? true,
        priceExclTax,
        priceInclTax,
        salePriceExclTax,
        salePriceInclTax,
        discountEndDate: discountEndISO,
        selectedSizePrice: toNumber(it.selectedSizePrice),
        selectedSizePriceExclTax: toNumber(it.selectedSizePriceExclTax ?? priceExclTax),
        selectedSizePriceInclTax: toNumber(it.selectedSizePriceInclTax ?? priceInclTax ?? it.selectedSizePrice),
        lineTaxAmount: toNumber(it.lineTaxAmount),
        shippingType: shippingMethod,
        shippingMethod,
        shippingCost: shippingCharge,
        shippingCharge,
        shipping,

        // derived
        isSaleActive,
      };
    });

    const items = await Promise.all(detailedItems.map(hydrateCartItemFromPublicProduct));

    return {
      items,
      pricing: data?.cart?.pricing
        ? {
            business: data.cart.pricing.business,
            availableDeliverySpeeds: Array.isArray(data.cart.pricing.availableDeliverySpeeds)
              ? data.cart.pricing.availableDeliverySpeeds
              : [],
            selectedDeliverySpeed: data.cart.pricing.selectedDeliverySpeed,
            subtotalExclTax: toNumber(
              data.cart.pricing.subtotalExclTax ??
              data.cart.pricing.subtotalExclTaxAmount
            ),
            subtotalAmount: toNumber(data.cart.pricing.subtotalAmount),
            subtotalInclTax: toNumber(data.cart.pricing.subtotalInclTax ?? data.cart.pricing.subtotalAmount),
            taxAmount: toNumber(
              data.cart.pricing.taxAmount ??
              data.cart.pricing.taxTotal
            ),
            taxIncluded: data.cart.pricing.taxIncluded ?? true,
            totalQuantity: toNumber(data.cart.pricing.totalQuantity),
            shipping: data.cart.pricing.shipping
              ? {
                  deliverySpeed: data.cart.pricing.shipping.deliverySpeed,
                  amount: toNumber(data.cart.pricing.shipping.amount),
                  method: data.cart.pricing.shipping.method,
                  freeShippingApplied: Boolean(
                    data.cart.pricing.shipping.freeShippingApplied
                  ),
                  freeShippingThreshold:
                    data.cart.pricing.shipping.freeShippingThreshold == null
                      ? null
                      : toNumber(data.cart.pricing.shipping.freeShippingThreshold),
                  matchedTier: data.cart.pricing.shipping.matchedTier ?? null,
                }
              : null,
            shippingError: data.cart.pricing.shippingError ?? null,
            totalAmount: toNumber(data.cart.pricing.totalAmount),
            totalInclTax: toNumber(data.cart.pricing.totalInclTax ?? data.cart.pricing.totalAmount),
            currency: data.cart.pricing.currency ?? "USD",
          }
        : null,
      totalItems: toNumber(data?.cart?.totalItems),
      businessId: toId(data?.cart?.businessId),
    };
  }

  // Guest: return whatever is stored; (optional) enrich at add time
  try {
    const items = await buildGuestCartDetailed();
    return {
      items,
      pricing: null,
      totalItems: items.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
      businessId: items[0]?.businessId,
    };
  } catch {
    return { items: [], pricing: null };
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
  const onSale = isSalePriceActive(sale, it.discountEndDate);

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
export async function handlePlaceOrderFlow(
  address: ShippingAddress,
  userNote?: string,
  checkoutItems?: CartItemDetailed[],
  selectedDeliverySpeed?: DeliverySpeed
) {
  const loggedIn = await isUserLoggedIn();
  const paymentPage = "/checkout/payment";

  if (!loggedIn) {
    window.location.href = `/login?type=customer`;
    return;
  }

  // Build items from either a product-only checkout or the current cart.
  const cart: CartItemDetailed[] = checkoutItems ?? await getCartDetailed();
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
      selectedDeliverySpeed,
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
