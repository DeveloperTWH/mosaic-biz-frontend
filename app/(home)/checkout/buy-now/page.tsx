"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import AddressComponent, { Address } from "../../cart/Component/AddressComponent";
import { CartItemDetailed, handlePlaceOrderFlow, resolveDisplayPrice } from "@/utils/cartUtils";

type DeliverySpeed = "standard" | "express" | "overnight" | "local";

type BuyNowItem = CartItemDetailed & {
  vendorState?: string;
  shipping?: {
    standard?: number;
    express?: number;
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
  const initialShippingMethod = (searchParams.get("shippingMethod") || "standard") as DeliverySpeed;
  const initialQuantity = Math.max(1, Number(searchParams.get("quantity") || "1"));

  const [selectedTab] = useState<"product" | "food">("product");
  const [item, setItem] = useState<BuyNowItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
  const [selectedDeliverySpeed, setSelectedDeliverySpeed] = useState<DeliverySpeed | undefined>(undefined);
  const [deliverySpeedLoading, setDeliverySpeedLoading] = useState(false);
  const [userNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);

  const getEffectiveShippingCost = (line: BuyNowItem) =>
    Number(line.shippingCost ?? line.shippingCharge ?? 0);

  const getEffectiveShippingMethod = (line?: BuyNowItem) =>
    line?.shippingMethod ?? line?.shippingType;

  const getShippingLabel = (type?: DeliverySpeed) => {
    if (!type) return "";
    if (type === "overnight") return "Express";
    return type.replace(/^./, (char) => char.toUpperCase());
  };

  const getShippingOptions = (line: BuyNowItem) => {
    if (!line.shipping) return [];

    return (["standard", "express", "overnight", "local"] as const)
      .map((type) => ({
        type,
        cost: Number(line.shipping?.[type] ?? 0),
        isDefined: line.shipping?.[type] != null,
      }))
      .filter((option) => option.isDefined);
  };

  const getShippingCostForSpeed = (line: BuyNowItem, speed?: DeliverySpeed) => {
    if (!speed) return getEffectiveShippingCost(line);

    const speedCost = line.shipping?.[speed];
    if (speedCost != null) {
      return Number(speedCost);
    }

    return getEffectiveShippingCost(line);
  };

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
      const shipping = variant.shipping ?? product.shipping ?? null;
      const normalizedShippingMethod =
        shipping?.[initialShippingMethod] != null
          ? initialShippingMethod
          : (["standard", "express", "overnight", "local"] as const).find(
              (speed) => shipping?.[speed] != null
            ) ?? "standard";
      const shippingCost = toNumber(shipping?.[normalizedShippingMethod]);
      const vendorState =
        product?.businessId?.state ??
        product?.business?.state ??
        product?.state;

      setItem({
        productId: product._id,
        variantId: variant.variantId,
        businessId: typeof product.businessId === "string" ? product.businessId : product.businessId?._id,
        size,
        quantity: initialQuantity,
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
        selectedSizePrice: resolvedPriceInclTax.current,
        selectedSizePriceExclTax: resolvedPriceExclTax.current,
        selectedSizePriceInclTax: resolvedPriceInclTax.current,
        lineTaxAmount: Math.max(0, resolvedPriceInclTax.current - resolvedPriceExclTax.current) * initialQuantity,
        shippingType: normalizedShippingMethod,
        shippingMethod: normalizedShippingMethod,
        shippingCost,
        shippingCharge: shippingCost,
        shipping,
        isSaleActive: saleActive,
        vendorState,
      });
      setSelectedDeliverySpeed(normalizedShippingMethod);
    } catch (error) {
      console.error("Failed to load buy now item", error);
      toast.error("Failed to load product");
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [initialQuantity, initialShippingMethod, productId, size, variantId]);

  useEffect(() => {
    loadBuyNowItem();
  }, [loadBuyNowItem]);

  const handleAddressesChange = useCallback((nextAddresses: Address[]) => {
    setAddresses(nextAddresses);

    if (!nextAddresses.length) {
      setSelectedAddressId(undefined);
      return;
    }

    setSelectedAddressId((currentSelectedId) => {
      if (currentSelectedId && nextAddresses.some((address) => address.id === currentSelectedId)) {
        return currentSelectedId;
      }

      return nextAddresses.find((address) => address.isDefault)?.id ?? nextAddresses[0]?.id;
    });
  }, []);

  const handleDeliverySpeedChange = async (deliverySpeed: DeliverySpeed) => {
    if (!item || deliverySpeedLoading) {
      return;
    }

    setDeliverySpeedLoading(true);
    try {
      const shippingCost = getShippingCostForSpeed(item, deliverySpeed);
      setSelectedDeliverySpeed(deliverySpeed);
      setItem((current) =>
        current
          ? {
              ...current,
              shippingType: deliverySpeed,
              shippingMethod: deliverySpeed,
              shippingCost,
              shippingCharge: shippingCost,
            }
          : current
      );
    } finally {
      setDeliverySpeedLoading(false);
    }
  };

  const itemsProduct = useMemo(() => (item ? [item] : []), [item]);
  const subtotalProduct = itemsProduct.reduce(
    (sum, currentItem) => sum + (Number(currentItem.selectedSizePrice) || 0) * (currentItem.quantity || 0),
    0
  );
  const totalQtyProduct = itemsProduct.reduce((sum, currentItem) => sum + (currentItem.quantity || 0), 0);
  const availableDeliverySpeeds = useMemo<DeliverySpeed[]>(() => {
    if (!item) return [];

    const derivedSpeeds = new Set<DeliverySpeed>();
    getShippingOptions(item).forEach((option) => {
      derivedSpeeds.add(option.type);
    });

    const effectiveMethod = getEffectiveShippingMethod(item);
    if (effectiveMethod) {
      derivedSpeeds.add(effectiveMethod as DeliverySpeed);
    }

    return Array.from(derivedSpeeds);
  }, [item]);
  const fallbackSelectedDeliverySpeed = useMemo<DeliverySpeed | undefined>(() => {
    return selectedDeliverySpeed ?? (getEffectiveShippingMethod(item ?? undefined) as DeliverySpeed | undefined) ?? availableDeliverySpeeds[0];
  }, [availableDeliverySpeeds, item, selectedDeliverySpeed]);
  const effectiveShippingTotalProduct = useMemo(() => {
    if (!item) return 0;
    return getShippingCostForSpeed(item, fallbackSelectedDeliverySpeed);
  }, [fallbackSelectedDeliverySpeed, item]);
  const effectiveTaxAmountProduct = itemsProduct.reduce(
    (sum, currentItem) => sum + Number(currentItem.lineTaxAmount ?? 0),
    0
  );
  const effectiveSubtotalExclTaxProduct = Math.max(0, subtotalProduct - effectiveTaxAmountProduct);
  const businessId = item?.businessId;
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId);

  const totalSavingsProduct = useMemo(() => {
    return itemsProduct.reduce((sum, currentItem) => {
      const resolved = resolveDisplayPrice(
        Number(
          currentItem.priceInclTax ??
            currentItem.selectedSizePriceInclTax ??
            currentItem.price ??
            currentItem.selectedSizePrice ??
            0
        ),
        currentItem.salePriceInclTax ?? currentItem.salePrice ?? null,
        currentItem.isSaleActive ?? isSaleActive(currentItem.salePrice, currentItem.discountEndDate)
      );
      const perUnitSaving = Math.max(0, resolved.original - resolved.current);
      return sum + perUnitSaving * (currentItem.quantity ?? 1);
    }, 0);
  }, [itemsProduct]);

  useEffect(() => {
    if (!selectedDeliverySpeed && availableDeliverySpeeds.length > 0) {
      setSelectedDeliverySpeed(availableDeliverySpeeds[0]);
    }
  }, [availableDeliverySpeeds, selectedDeliverySpeed]);

  useEffect(() => {
    setAppliedDiscount(null);
  }, [businessId, effectiveShippingTotalProduct, subtotalProduct]);

  const discountAmountProduct = appliedDiscount?.discountAmount ?? 0;
  const discountedSubtotalProduct = appliedDiscount?.finalAmount ?? subtotalProduct;
  const payableTotalProduct = Math.max(0, discountedSubtotalProduct + effectiveShippingTotalProduct);

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

    if (subtotalProduct <= 0) {
      toast.error("No item available for checkout");
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

  const inc = async () => {
    if (!item) return;

    const nextQty = (item.quantity || 0) + 1;
    if (item.stock != null && nextQty > item.stock && !item.allowBackorder) {
      toast.error("Not enough stock for this size");
      return;
    }

    setItem({
      ...item,
      quantity: nextQty,
      lineTaxAmount: Math.max(
        0,
        Number(item.selectedSizePriceInclTax ?? 0) - Number(item.selectedSizePriceExclTax ?? 0)
      ) * nextQty,
    });
  };

  const dec = async () => {
    if (!item) return;

    const nextQty = (item.quantity || 0) - 1;
    if (nextQty <= 0) {
      setItem(null);
      return;
    }

    setItem({
      ...item,
      quantity: nextQty,
      lineTaxAmount: Math.max(
        0,
        Number(item.selectedSizePriceInclTax ?? 0) - Number(item.selectedSizePriceExclTax ?? 0)
      ) * nextQty,
    });
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
        <div className="w-full lg:w-[68%]">
          <div className="flex gap-5 px-5 mb-8 bg-white">
            <button
              className={`sm:p-5 p-2 pt-3 sm:text-lg text-sm font-semibold ${
                selectedTab === "product" ? "border-b-4 border-blue-500" : "text-gray-800"
              }`}
            >
              Items ({totalQtyProduct})
            </button>
          </div>

          {selectedTab === "product" ? (
            <div className="mt-6 space-y-6 bg-white">
              {itemsProduct.length === 0 ? (
                <div className="p-8 text-center text-gray-600">Unable to load this product for checkout.</div>
              ) : (
                itemsProduct.map((currentItem) => (
                  <div
                    key={`${currentItem.productId}-${currentItem.variantId}-${currentItem.size}`}
                    className="p-4 border border-gray-200 rounded-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-4 min-w-0">
                        <img
                          className="object-contain flex-shrink-0 w-20 h-20 rounded bg-gray-50"
                          src={currentItem.imageUrl || "/placeholder.png"}
                          alt={currentItem.title || "Product"}
                        />

                        <div className="min-w-0">
                          <div className="font-semibold text-gray-800 truncate">
                            {currentItem.title || "Product"}
                          </div>

                          <div className="text-xs text-gray-500">
                            {currentItem.color ? `${currentItem.color}: ` : ""}
                            {currentItem.size}
                          </div>

                          <div className="mt-2">
                            {(() => {
                              const resolved = resolveDisplayPrice(
                                Number(
                                  currentItem.priceInclTax ??
                                    currentItem.selectedSizePriceInclTax ??
                                    currentItem.price ??
                                    currentItem.selectedSizePrice ??
                                    0
                                ),
                                currentItem.salePriceInclTax ?? currentItem.salePrice ?? null,
                                currentItem.isSaleActive ??
                                  isSaleActive(currentItem.salePrice, currentItem.discountEndDate)
                              );

                              if (resolved.onSale) {
                                const pct =
                                  resolved.original > 0
                                    ? Math.round(((resolved.original - resolved.current) / resolved.original) * 100)
                                    : 0;

                                return (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-base text-gray-800">${resolved.current.toFixed(2)}</span>
                                    <span className="text-sm text-gray-400 line-through">
                                      ${resolved.original.toFixed(2)}
                                    </span>
                                    {pct > 0 && <span className="text-sm text-green-600">{pct}% OFF</span>}
                                  </div>
                                );
                              }

                              return (
                                <div className="flex flex-col gap-1">
                                  <span className="text-base text-gray-800">${resolved.current.toFixed(2)}</span>
                                </div>
                              );
                            })()}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Tax included : ${Number(currentItem.lineTaxAmount ?? 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs text-gray-500">
                        {(() => {
                          const shippingOptions = getShippingOptions(currentItem);
                          const effectiveShippingCost = getShippingCostForSpeed(
                            currentItem,
                            fallbackSelectedDeliverySpeed
                          );
                          const effectiveShippingMethod =
                            fallbackSelectedDeliverySpeed ?? getEffectiveShippingMethod(currentItem);

                          if (effectiveShippingMethod) {
                            return (
                              <>
                                Shipping: {getShippingLabel(effectiveShippingMethod as DeliverySpeed)} $
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
                              </>
                            );
                          }

                          return null;
                        })()}
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={dec}
                            className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
                            disabled={currentItem.quantity <= 1}
                          >
                            -
                          </button>

                          <div className="w-6 text-sm text-center">{currentItem.quantity}</div>

                          <button
                            onClick={inc}
                            className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : null}

          {selectedTab === "product" && itemsProduct.length > 0 && availableDeliverySpeeds.length > 0 ? (
            <div className="mt-6 bg-white border border-gray-200 rounded-md p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Shipping Speed</h3>
                  <p className="mt-1 text-xs text-gray-500">Choose shipping Speed for your order</p>
                  {selectedDeliverySpeed ? (
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      Selected: {getShippingLabel(selectedDeliverySpeed)} - ${effectiveShippingTotalProduct.toFixed(2)}
                    </p>
                  ) : null}
                </div>

                {deliverySpeedLoading && <div className="text-xs text-blue-600">Updating shipping...</div>}
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {availableDeliverySpeeds.map((speed) => {
                  const isActive = selectedDeliverySpeed === speed;

                  if (speed === "local") {

                    // console.log("vendor state : " , item?.vendorState)
                    // console.log("slected adress",  selectedAddress?.state)
                    const localVendor = item?.vendorState && selectedAddress?.state
                      ? item.vendorState === selectedAddress.state
                      : false;

                    if (!localVendor) {
                      return null;
                    }
                  }

                  return (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => handleDeliverySpeedChange(speed)}
                      disabled={deliverySpeedLoading}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "border-blue-900 bg-blue-900 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {getShippingLabel(speed)}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <AddressComponent
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelect={setSelectedAddressId}
              onAddressesChange={handleAddressesChange}
              onAdd={(address) => {
                setSelectedAddressId(address.id);
              }}
            />
          </div>
        </div>

        <div className="w-full lg:w-[30%] lg:mt-0">
          <div className="w-full bg-white border border-gray-200">
            <div className="p-5 mb-2 text-lg text-gray-800 border-b-2 border-gray-200">
              <h3 className="pt-2 text-lg text-gray-800">Price Details</h3>
            </div>

            {selectedTab === "product" ? (
              <div className="p-5">
                <div className="flex justify-between mt-3 text-sm text-gray-600">
                  <div>Subtotal Excl. Tax</div>
                  <div>${effectiveSubtotalExclTaxProduct.toFixed(2)}</div>
                </div>

                <div className="flex justify-between mt-3 text-sm text-gray-600">
                  <div>Tax Total</div>
                  <div className={effectiveTaxAmountProduct === 0 ? "text-green-600" : ""}>
                    ${effectiveTaxAmountProduct.toFixed(2)}
                  </div>
                </div>

                <div className="flex justify-between mt-3 text-sm text-gray-600">
                  <div>Shipping</div>
                  <div>${effectiveShippingTotalProduct.toFixed(2)}</div>
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
                      disabled={applyingCoupon || itemsProduct.length === 0}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {applyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>

                  {appliedDiscount && (
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-green-600">Applied: {appliedDiscount.couponCode}</span>
                      <button type="button" onClick={removeCoupon} className="text-red-600">
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
                    className="px-4 py-2 text-white bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={itemsProduct.length === 0}
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
                        userNote,
                        itemsProduct,
                        selectedDeliverySpeed,
                        "buy-now"
                      );
                    }}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5">
                <div className="text-sm text-gray-600">Grocery checkout coming soon.</div>
              </div>
            )}
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
