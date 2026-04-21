// app/cart/page.tsx
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import AddressComponent from "./Component/AddressComponent";
import { getCartDetailed, updateCartQuantity, removeFromCart, handlePlaceOrderFlow } from "@/utils/cartUtils";

type CartItem = {
    productId: string;
    variantId: string;
    businessId?: string;
    size: string;
    quantity: number;
    imageUrl?: string;
    color?: string;
    label?: string;
    price?: number;                       // base price from API
    salePrice?: number | null;            // sale price (may be null)
    discountEndDate?: string | null;      // ISO string or null
    selectedSizePrice?: number;  // salePrice or price (already decided by backend)
    shippingType?: "standard" | "overnight" | "local";
    shippingMethod?: "standard" | "overnight" | "local";
    shippingCost?: number;
    shippingCharge?: number;
    shipping?: {
        standard?: number;
        overnight?: number;
        local?: number;
    } | null;
    stock?: number;
    allowBackorder?: boolean;
    title?: string;
    sku?: string;
    isSaleActive?: boolean;

};

type AppliedDiscount = {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
    couponCode: string;
};

export type ShippingAddress = {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
};

export type Address = {
    id: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
};

export default function CartPage() {
    const [selectedTab, setSelectedTab] = useState<"product" | "food">("product");
    const [itemsProduct, setItemsProduct] = useState<CartItem[]>([]);
    const [itemsFood] = useState<CartItem[]>([]); // keep for future Grocery integration
    const [loading, setLoading] = useState<boolean>(true);
    const [addresses, setAddresses] = useState<Address[]>([
        
    ]);

    const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(
        addresses.find(a => a.isDefault)?.id
    );
    const [userNote, setUserNote] = useState<string>("");
    const [couponCode, setCouponCode] = useState<string>("");
    const [applyingCoupon, setApplyingCoupon] = useState<boolean>(false);
    const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);

    const isSaleActive = (salePrice?: number | null, discountEndDate?: string | null) => {
        if (salePrice == null) return false;
        if (!discountEndDate) return true;
        return new Date(discountEndDate).getTime() > Date.now();
    };

    const getEffectiveShippingCost = (item: CartItem) =>
        Number(item.shippingCost ?? item.shippingCharge ?? 0);

    const getEffectiveShippingMethod = (item: CartItem) =>
        item.shippingMethod ?? item.shippingType;

    const getShippingLabel = (type?: CartItem["shippingType"] | CartItem["shippingMethod"]) => {
        if (!type) return "";
        return type.replace(/^./, (char) => char.toUpperCase());
    };

    const getShippingOptions = (item: CartItem) => {
        if (!item.shipping) return [];

        return (["standard", "overnight", "local"] as const)
            .map((type) => ({
                type,
                cost: Number(item.shipping?.[type] ?? 0),
            }))
            .filter((option) => option.cost > 0);
    };

    const loadCart = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCartDetailed();
            // Support both shapes: array OR { items: [...] }
            const list = Array.isArray(res) ? res : (res as any)?.items ?? [];
            setItemsProduct(list as CartItem[]);
        } catch (e) {
            console.error("Failed to load cart", e);
            toast.error("Failed to load cart");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const inc = async (line: CartItem) => {
        const nextQty = (line.quantity || 0) + 1;

        if (line.stock != null && nextQty > line.stock && !line.allowBackorder) {
            toast.error("Not enough stock for this size");
            return;
        }

        // optimistic UI
        setItemsProduct(prev =>
            prev.map(it =>
                it.productId === line.productId && it.variantId === line.variantId && it.size === line.size
                    ? { ...it, quantity: nextQty }
                    : it
            )
        );

        try {
            await updateCartQuantity(line.productId, line.variantId, line.size, nextQty);
        } catch (e: any) {
            toast.error(e?.message || "Failed to update");
            loadCart(); // re-sync
        }
    };

    const dec = async (line: CartItem) => {
        const nextQty = (line.quantity || 0) - 1;

        if (nextQty <= 0) {
            await removeLine(line);
            return;
        }

        // optimistic UI
        setItemsProduct(prev =>
            prev.map(it =>
                it.productId === line.productId && it.variantId === line.variantId && it.size === line.size
                    ? { ...it, quantity: nextQty }
                    : it
            )
        );

        try {
            await updateCartQuantity(line.productId, line.variantId, line.size, nextQty);
        } catch (e: any) {
            toast.error(e?.message || "Failed to update");
            loadCart(); // re-sync
        }
    };

    const removeLine = async (line: CartItem) => {
        // optimistic UI
        setItemsProduct(prev =>
            prev.filter(it => !(it.productId === line.productId && it.variantId === line.variantId && it.size === line.size))
        );

        try {
            await removeFromCart(line.productId, line.variantId, line.size);
        } catch (e: any) {
            toast.error(e?.message || "Failed to remove");
            loadCart(); // re-sync
        }
    };

    const subtotalProduct = itemsProduct.reduce(
        (sum, it) => sum + (Number(it.selectedSizePrice) || 0) * (it.quantity || 0),
        0
    );
    const shippingTotalProduct = itemsProduct.reduce(
        (sum, it) => sum + getEffectiveShippingCost(it) * (it.quantity || 0),
        0
    );
    const totalQtyProduct = itemsProduct.reduce((sum, it) => sum + (it.quantity || 0), 0);
    const businessId = itemsProduct[0]?.businessId;

    const totalSavingsProduct = useMemo(() => {
        return itemsProduct.reduce((sum, it: any) => {
            const base = Number(it.price ?? it.selectedSizePrice ?? 0);
            const saleActive = isSaleActive(it.salePrice, it.discountEndDate);

            const effective = saleActive
                ? Number(it.salePrice)
                : Number(it.selectedSizePrice ?? base);

            const perUnitSaving = Math.max(0, base - effective);
            return sum + perUnitSaving * (it.quantity ?? 1);
        }, 0);
    }, [itemsProduct]);

    useEffect(() => {
        setAppliedDiscount(null);
    }, [subtotalProduct, shippingTotalProduct, businessId]);

    const discountAmountProduct = appliedDiscount?.discountAmount ?? 0;
    const discountedSubtotalProduct = appliedDiscount?.finalAmount ?? subtotalProduct;
    const payableTotalProduct = Math.max(0, discountedSubtotalProduct + shippingTotalProduct);

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);

    const applyCoupon = async () => {
        const trimmedCoupon = couponCode.trim();

        if (!trimmedCoupon) {
            toast.error("Please enter a coupon code");
            return;
        }

        if (!businessId) {
            toast.error("Business information is missing for this cart");
            return;
        }

        if (subtotalProduct <= 0) {
            toast.error("Your cart is empty");
            return;
        }

        setApplyingCoupon(true);
        try {
            const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
            const res = await fetch(`${base}/api/discounts/apply`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    couponCode: trimmedCoupon,
                    businessId,
                    amount: subtotalProduct,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data?.success || !data?.data) {
                toast.error(data?.message || "Failed to apply coupon");
                return;
            }

            setAppliedDiscount(data.data as AppliedDiscount);
            setCouponCode((data.data as AppliedDiscount).couponCode || trimmedCoupon);
            toast.success("Coupon applied successfully");
        } catch (error) {
            console.error("Failed to apply coupon", error);
            toast.error("Failed to apply coupon");
        } finally {
            setApplyingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setAppliedDiscount(null);
        setCouponCode("");
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-12 h-12 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin" />
                    <p className="text-sm font-medium text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#ebecef]">
            <div className="flex flex-wrap gap-5 px-4 py-6 mx-auto max-w-7xl">
                {/* Tab Navigation */}
                <div className="w-full lg:w-[68%]">
                    <div className="flex gap-5 px-5 mb-8 bg-white">
                        <button
                            className={`sm:p-5 p-2 pt-3 sm:text-lg text-sm font-semibold ${selectedTab === "product" ? "border-b-4 border-blue-500" : "text-gray-800"
                                }`}
                            onClick={() => setSelectedTab("product")}
                        >
                            Items  ({itemsProduct.length})
                        </button>
                        {/* <button
                            className={`sm:p-5 p-2 pt-3 sm:text-lg text-sm font-semibold ${selectedTab === "food" ? "border-b-4 border-blue-500" : "text-gray-800"
                                }`}
                            onClick={() => setSelectedTab("food")}
                        >
                            Grocery ({itemsFood.length})
                        </button> */}
                    </div>

                    {/* Delivery Address */}
                    <AddressComponent
                        addresses={addresses}
                        selectedAddressId={selectedAddressId}
                        onSelect={setSelectedAddressId}
                        onAdd={(addr) => {
                            setAddresses(prev => [...prev, addr]);
                            setSelectedAddressId(addr.id);
                        }}
                    />

                    {/* Cart Items */}
{selectedTab === "product" ? (
  <div className="mt-6 space-y-6 bg-white">
    {itemsProduct.length === 0 ? (
      <div className="p-8 text-center text-gray-600">
        Your cart is empty.
      </div>
    ) : (
      itemsProduct.map((item) => (
        <div
          key={`${item.productId}-${item.variantId}-${item.size}`}
          className="p-4 border border-gray-200 rounded-md"
        >
          {/* TOP ROW */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-4 min-w-0">
              {/* IMAGE */}
              <img
                className="object-contain w-20 h-20 rounded bg-gray-50 flex-shrink-0"
                src={item.imageUrl || "/placeholder.png"}
                alt={item.title || "Product"}
              />

              {/* INFO */}
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 truncate">
                  {item.title || "Product"}
                </div>

                <div className="text-xs text-gray-500">
                  {item.label ? `${item.label}: ` : ""}
                  {item.size}
                  {item.color ? ` - ${item.color}` : ""}
                </div>

                {/* PRICE */}
                <div className="mt-2">
                  {(() => {
                    const effectivePrice = Number(
                      item.selectedSizePrice ?? item.salePrice ?? item.price ?? 0
                    );
                    const originalPrice = Number(item.price ?? effectivePrice);
                    const sale = item.salePrice != null ? Number(item.salePrice) : null;
                    const saleActive =
                      item.isSaleActive ??
                      isSaleActive(sale, item.discountEndDate);

                    if (saleActive && sale != null && originalPrice > effectivePrice) {
                      const pct =
                        originalPrice > 0
                          ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
                          : 0;

                      return (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base text-gray-800">
                            ${effectivePrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                          {pct > 0 && (
                            <span className="text-sm text-green-600">
                              {pct}% OFF
                            </span>
                          )}
                        </div>
                      );
                    }

                    return (
                      <span className="text-base text-gray-800">
                        ${effectivePrice.toFixed(2)}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* REMOVE BUTTON */}
            <button
              onClick={() => removeLine(item)}
              className="text-xs text-red-600 whitespace-nowrap"
            >
              Remove
            </button>
          </div>

          {/* BOTTOM ROW */}
          <div className="flex items-center justify-between mt-4">
            {/* SHIPPING */}
            <div className="text-xs text-gray-500">
              {(() => {
                const shippingOptions = getShippingOptions(item);
                const effectiveShippingCost = getEffectiveShippingCost(item);
                const effectiveShippingMethod = getEffectiveShippingMethod(item);

                if (effectiveShippingMethod) {
                  return (
                    <>
                      Shipping: {getShippingLabel(effectiveShippingMethod)} $
                      {effectiveShippingCost.toFixed(2)}
                    </>
                  );
                }

                if (shippingOptions.length > 0) {
                  return (
                    <>
                      Shipping:{" "}
                      {shippingOptions
                        .map((option) => `${getShippingLabel(option.type)} $${option.cost.toFixed(2)}`)
                        .join(" | ")}
                      {effectiveShippingCost > 0 && (
                        <>{" "} | Applied: ${effectiveShippingCost.toFixed(2)}</>
                      )}
                    </>
                  );
                }

                if (effectiveShippingCost > 0) {
                  return <>Shipping: ${effectiveShippingCost.toFixed(2)}</>;
                }

                return null;
              })()}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-6">
              {/* QUANTITY */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dec(item)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>

                <div className="text-sm w-6 text-center">
                  {item.quantity}
                </div>

                <button
                  onClick={() => inc(item)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                >
                  +
                </button>
              </div>

              {/* TOTAL */}
              {/* <div className="text-sm font-semibold text-gray-800 min-w-[70px] text-right">
                $
                {(
                  (Number(item.selectedSizePrice) || 0) *
                  (item.quantity || 0)
                ).toFixed(2)}
              </div> */}
            </div>
          </div>
        </div>
      ))
    )}
  </div>
) : null}
                </div>

                {/* Price Details */}
                <div className="w-full lg:w-[30%] lg:mt-0">
                    <div className="w-full bg-white border border-gray-200">
                        <div className="p-5 mb-2 text-lg text-gray-800 border-b-2 border-gray-200">
                            <h3 className="pt-2 text-lg text-gray-800">Price Details</h3>
                        </div>

                        {selectedTab === "product" ? (
                            <div className="p-5">
                                {/* <div className="flex justify-between text-sm text-gray-600">
                                    <div>Items</div>
                                    <div>{totalQtyProduct}</div>
                                </div> */}

                                <div className="flex justify-between mt-3 text-sm text-gray-600">
                                    <div>Product Price</div>
                                    <div>${subtotalProduct.toFixed(2)}</div>
                                </div>

                                <div className="flex justify-between mt-3 text-sm text-gray-600">
                                    <div>Shipping</div>
                                    <div>${shippingTotalProduct.toFixed(2)}</div>
                                </div>

                                <div className="mt-5">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Discount Coupon
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Enter coupon code"
                                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={applyCoupon}
                                            disabled={applyingCoupon || itemsProduct.length === 0}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {applyingCoupon ? "Applying..." : "Apply"}
                                        </button>
                                    </div>

                                    {appliedDiscount && (
                                        <div className="flex items-center justify-between mt-2 text-sm">
                                            <span className="text-green-600">
                                                Applied: {appliedDiscount.couponCode}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={removeCoupon}
                                                className="text-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between mt-4 text-sm text-gray-600">
                                    <div>Discount</div>
                                    <div className={discountAmountProduct > 0 ? "text-green-600" : ""}>
                                        ${discountAmountProduct.toFixed(2)}
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4 text-lg font-semibold text-gray-900">
                                    <div>Total</div>
                                    <div>${payableTotalProduct.toFixed(2)}</div>
                                </div>

                                {totalSavingsProduct > 0 && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        You will save ${totalSavingsProduct.toFixed(2)} on this order
                                    </div>
                                )}


                                <div className="flex items-center justify-end mt-5 space-x-2">
                                    <button
                                        className="px-4 py-2 text-white bg-blue-900"
                                        onClick={() => {
                                            if (!selectedAddress) {
                                                alert("Please add address");
                                                return;
                                            }
                                            handlePlaceOrderFlow(
                                                {
                                                    fullName: selectedAddress.fullName,
                                                    phone: selectedAddress.phone,
                                                    addressLine1: selectedAddress.addressLine1,
                                                    addressLine2: selectedAddress.addressLine2 ?? "",
                                                    city: selectedAddress.city ?? "",
                                                    state: selectedAddress.state ?? "",
                                                    country: selectedAddress.country ?? "",
                                                    postalCode: selectedAddress.postalCode ?? "",
                                                },
                                                userNote
                                            );
                                        }}
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-5">
                                <div className="text-sm text-gray-600">
                                    Grocery checkout coming soon.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
