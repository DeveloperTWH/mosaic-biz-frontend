"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import AddressComponent, { Address } from "../../cart/Component/AddressComponent";
import { CartItemDetailed, handlePlaceOrderFlow, resolveDisplayPrice } from "@/utils/cartUtils";

type BuyNowItem = CartItemDetailed & {
  shipping?: {
    standard?: number;
    overnight?: number;
    local?: number;
  } | null;
};

type AppliedDiscount = {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode: string;
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object" && "$numberDecimal" in (value as Record<string, unknown>)) {
    const parsed = parseFloat(String((value as Record<string, unknown>).$numberDecimal));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isSaleActive = (salePrice?: number | null, discountEndDate?: string | null) => {
  if (salePrice == null) return false;
  if (!discountEndDate) return true;
  return new Date(discountEndDate).getTime() > Date.now();
};

function BuyNowContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") || "";
  const variantId = searchParams.get("variantId") || "";
  const size = searchParams.get("size") || "default";
  const shippingMethod = (searchParams.get("shippingMethod") || "standard") as "standard" | "overnight" | "local";

  const [item, setItem] = useState<BuyNowItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
  const [userNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);

  const loadBuyNowItem = useCallback(async () => {
    if (!productId || !variantId) {
      toast.error("Product selection is missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/product/${productId}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.message || "Failed to load product");
        setItem(null);
        return;
      }

      const product = data?.data;
      const variant = product?.variants?.find((v: any) => v.variantId === variantId);

      if (!product || !variant) {
        toast.error("Selected variant was not found");
        setItem(null);
        return;
      }

      if (variant.stock <= 0 && !variant.allowBackorder) {
        toast.error("This product is out of stock");
        setItem(null);
        return;
      }

      const basePrice = toNumber(variant.price);
      const salePrice = variant.salePrice == null ? null : toNumber(variant.salePrice);
      const priceExclTax = toNumber(variant.priceExclTax ?? product.priceExclTax ?? basePrice);
      const priceInclTax = toNumber(variant.priceInclTax ?? product.priceInclTax ?? basePrice);
      const salePriceExclTax =
        variant.salePriceExclTax == null && product.salePriceExclTax == null
          ? salePrice
          : toNumber(variant.salePriceExclTax ?? product.salePriceExclTax);
      const salePriceInclTax =
        variant.salePriceInclTax == null && product.salePriceInclTax == null
          ? salePrice
          : toNumber(variant.salePriceInclTax ?? product.salePriceInclTax);
      const discountEndDate = variant.discountEndDate ?? null;
      const saleActive = isSaleActive(salePrice, discountEndDate);
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
      const selectedSizePrice = resolvedPriceInclTax.current;
      const shipping = variant.shipping ?? product.shipping ?? null;
      const shippingCost = toNumber(shipping?.[shippingMethod]);

      setItem({
        productId: product._id,
        variantId: variant.variantId,
        businessId: typeof product.businessId === "string" ? product.businessId : product.businessId?._id,
        size,
        quantity: 1,
        imageUrl: variant.images?.[0] || product.coverImage,
        color: variant.attributes?.Color || variant.attributes?.color,
        label: variant.sku,
        stock: variant.stock,
        allowBackorder: variant.allowBackorder ?? false,
        title: product.title,
        sku: variant.sku,
        price: basePrice,
        salePrice,
        taxCategory: variant.taxCategory ?? product.taxCategory ?? null,
        taxRate: toNumber(variant.taxRate ?? product.taxRate),
        taxIncluded: variant.taxIncluded ?? product.taxIncluded ?? true,
        priceExclTax,
        priceInclTax,
        salePriceExclTax,
        salePriceInclTax,
        discountEndDate,
        selectedSizePrice,
        selectedSizePriceExclTax: resolvedPriceExclTax.current,
        selectedSizePriceInclTax: resolvedPriceInclTax.current,
        lineTaxAmount: Math.max(0, resolvedPriceInclTax.current - resolvedPriceExclTax.current),
        shippingType: shippingMethod,
        shippingMethod,
        shippingCost,
        shippingCharge: shippingCost,
        shipping,
        isSaleActive: saleActive,
      });
    } catch (error) {
      console.error("Failed to load buy now item", error);
      toast.error("Failed to load product");
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [productId, shippingMethod, size, variantId]);

  useEffect(() => {
    loadBuyNowItem();
  }, [loadBuyNowItem]);

  const subtotal = item ? Number(item.selectedSizePrice ?? 0) * (item.quantity || 0) : 0;
  const shippingTotal = item ? Number(item.shippingCost ?? item.shippingCharge ?? 0) * (item.quantity || 0) : 0;
  const businessId = item?.businessId;
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId);
  const discountAmount = appliedDiscount?.discountAmount ?? 0;
  const discountedSubtotal = appliedDiscount?.finalAmount ?? subtotal;
  const payableTotal = Math.max(0, discountedSubtotal + shippingTotal);

  const totalSavings = useMemo(() => {
    if (!item) return 0;

    const resolved = resolveDisplayPrice(
      Number(item.priceInclTax ?? item.selectedSizePriceInclTax ?? item.price ?? item.selectedSizePrice ?? 0),
      item.salePriceInclTax ?? item.salePrice ?? null,
      Boolean(item.isSaleActive)
    );

    return Math.max(0, resolved.original - resolved.current) * (item.quantity ?? 1);
  }, [item]);

  useEffect(() => {
    setAppliedDiscount(null);
  }, [subtotal, shippingTotal, businessId]);

  const applyCoupon = async () => {
    const trimmedCoupon = couponCode.trim();

    if (!trimmedCoupon) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (!businessId) {
      toast.error("Business information is missing for this product");
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
          amount: subtotal,
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

  const changeQuantity = (nextQuantity: number) => {
    if (!item) return;
    if (nextQuantity < 1) return;
    if (item.stock != null && nextQuantity > item.stock && !item.allowBackorder) {
      toast.error("Not enough stock for this product");
      return;
    }
    setItem({ ...item, quantity: nextQuantity });
  };

  const placeOrder = () => {
    if (!item) {
      toast.error("No item to checkout");
      return;
    }

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
      userNote,
      [item]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-gray-600">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ebecef]">
      <div className="flex flex-wrap gap-5 px-4 py-6 mx-auto max-w-7xl">
        <div className="w-full lg:w-[68%]">

          <AddressComponent
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelect={setSelectedAddressId}
            onAdd={(address) => {
              setAddresses((prev) => [...prev, address]);
              setSelectedAddressId(address.id);
            }}
          />

          <div className="mt-6 space-y-6 bg-white">
            {!item ? (
              <div className="p-8 text-center text-gray-600">Unable to load this product for checkout.</div>
            ) : (
              <div className="p-4 border border-gray-200 rounded-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-4 min-w-0">
                    <img
                      className="object-contain flex-shrink-0 w-20 h-20 rounded bg-gray-50"
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.title || "Product"}
                    />

                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{item.title || "Product"}</div>
                      <div className="text-xs text-gray-500">
                        {item.sku ? `${item.sku}: ` : ""}
                        {item.size}
                        {item.color ? ` - ${item.color}` : ""}
                      </div>

                      <div className="mt-2">
                        {(() => {
                          const resolved = resolveDisplayPrice(
                            Number(item.priceInclTax ?? item.selectedSizePriceInclTax ?? item.price ?? item.selectedSizePrice ?? 0),
                            item.salePriceInclTax ?? item.salePrice ?? null,
                            Boolean(item.isSaleActive)
                          );

                          if (resolved.onSale) {
                            return (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-base text-gray-800">${resolved.current.toFixed(2)}</span>
                                <span className="text-sm text-gray-400 line-through">${resolved.original.toFixed(2)}</span>
                              </div>
                            );
                          }

                          return (
                            <span className="text-base text-gray-800">${resolved.current.toFixed(2)}</span>
                          );
                        })()}
                        {(item.taxIncluded ?? true) && (
                          <div className="mt-1 text-xs text-gray-500">Tax included. Breakdown shown before payment.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-gray-500">
                    Shipping: {shippingMethod.replace(/^./, (char) => char.toUpperCase())} $
                    {Number(item.shippingCost ?? 0).toFixed(2)}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changeQuantity((item.quantity || 1) - 1)}
                        className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>

                      <div className="w-6 text-sm text-center">{item.quantity}</div>

                      <button
                        onClick={() => changeQuantity((item.quantity || 1) + 1)}
                        className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[30%] lg:mt-0">
          <div className="w-full bg-white border border-gray-200">
            <div className="p-5 mb-2 text-lg text-gray-800 border-b-2 border-gray-200">
              <h3 className="pt-2 text-lg text-gray-800">Price Details</h3>
            </div>

            <div className="p-5">
              <div className="flex justify-between mt-3 text-sm text-gray-600">
                <div>Product Price</div>
                <div>${subtotal.toFixed(2)}</div>
              </div>

              {item && (item.taxIncluded ?? true) && (
                <div className="mt-2 text-xs text-gray-500">
                  Product prices are shown tax-inclusive.
                </div>
              )}

              <div className="flex justify-between mt-3 text-sm text-gray-600">
                <div>Shipping</div>
                <div>${shippingTotal.toFixed(2)}</div>
              </div>

              <div className="mt-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">Discount Coupon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={applyingCoupon || !item}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {applyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </div>

                {appliedDiscount && (
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-green-600">Applied: {appliedDiscount.couponCode}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedDiscount(null);
                        setCouponCode("");
                      }}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <div>Discount</div>
                <div className={discountAmount > 0 ? "text-green-600" : ""}>${discountAmount.toFixed(2)}</div>
              </div>

              <div className="flex justify-between mt-4 text-lg font-semibold text-gray-900">
                <div>Total</div>
                <div>${payableTotal.toFixed(2)}</div>
              </div>

              {totalSavings > 0 && (
                <div className="mt-2 text-sm font-medium text-green-600">
                  You will save ${totalSavings.toFixed(2)} on this order
                </div>
              )}

              <div className="flex items-center justify-end mt-5 space-x-2">
                <button
                  className="px-4 py-2 text-white bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!item}
                  onClick={placeOrder}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuyNowPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center">Loading checkout...</p>}>
      <BuyNowContent />
    </Suspense>
  );
}
