// app/cart/page.tsx
"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import AddressComponent from "./Component/AddressComponent";
import { getCartDetailed, updateCartQuantity, removeFromCart } from "@/utils/cartUtils";

type CartItem = {
    productId: string;
    variantId: string;
    size: string;
    quantity: number;
    imageUrl?: string;
    color?: string;
    label?: string;
    price?: number;                       // base price from API
    salePrice?: number | null;            // sale price (may be null)
    discountEndDate?: string | null;      // ISO string or null
    selectedSizePrice?: number;  // salePrice or price (already decided by backend)
    stock?: number;
    allowBackorder?: boolean;
    title?: string;
    sku?: string;

};

export default function CartPage() {
    const [selectedTab, setSelectedTab] = useState<"product" | "food">("product");
    const [itemsProduct, setItemsProduct] = useState<CartItem[]>([]);
    const [itemsFood, setItemsFood] = useState<CartItem[]>([]); // keep for future Grocery integration
    const [loading, setLoading] = useState<boolean>(true);

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
    const totalQtyProduct = itemsProduct.reduce((sum, it) => sum + (it.quantity || 0), 0);

    const totalSavingsProduct = useMemo(() => {
        return itemsProduct.reduce((sum, it: any) => {
            const base = Number(it.price ?? it.selectedSizePrice ?? 0);
            const end = it.discountEndDate ? new Date(it.discountEndDate) : null;
            const saleActive =
                it.salePrice != null && end != null && end.getTime() > Date.now();

            const effective = saleActive
                ? Number(it.salePrice)
                : Number(it.selectedSizePrice ?? base);

            const perUnitSaving = Math.max(0, base - effective);
            return sum + perUnitSaving * (it.quantity ?? 1);
        }, 0);
    }, [itemsProduct]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-12 h-12 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin" />
                    <p className="text-sm font-medium text-gray-600">Loading your cart…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#ebecef]">
            <div className="flex flex-wrap gap-5 px-4 py-6 mx-auto max-w-7xl">
                {/* Tab Navigation */}
                <div className="w-full lg:w-2/3">
                    <div className="flex gap-5 px-5 mb-8 bg-white">
                        <button
                            className={`sm:p-5 p-2 pt-3 sm:text-lg text-sm font-semibold ${selectedTab === "product" ? "border-b-4 border-blue-500" : "text-gray-800"
                                }`}
                            onClick={() => setSelectedTab("product")}
                        >
                            Mosaic biz hub ({itemsProduct.length})
                        </button>
                        <button
                            className={`sm:p-5 p-2 pt-3 sm:text-lg text-sm font-semibold ${selectedTab === "food" ? "border-b-4 border-blue-500" : "text-gray-800"
                                }`}
                            onClick={() => setSelectedTab("food")}
                        >
                            Grocery ({itemsFood.length})
                        </button>
                    </div>

                    {/* Delivery Address */}
                    <AddressComponent />

                    {/* Cart Items */}
                    {selectedTab === "product" ? (
                        <div className="mt-6 space-y-6 bg-white">
                            {itemsProduct.length === 0 ? (
                                <div className="p-8 text-center text-gray-600">Your cart is empty.</div>
                            ) : (
                                itemsProduct.map((item) => (
                                    <div
                                        key={`${item.productId}-${item.variantId}-${item.size}`}
                                        className="p-4 rounded-md"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                className="object-contain w-20 h-20 rounded bg-gray-50"
                                                src={item.imageUrl || "/placeholder.png"}
                                                alt={item.title || "Product"}
                                            />
                                            <div className="flex flex-col justify-between">
                                                <div className="font-semibold text-gray-800">
                                                    {item.title || "Product"}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {item.label ? `${item.label}: ` : ""}
                                                    {item.size}
                                                    {item.color ? ` · ${item.color}` : ""}
                                                    {item.sku ? ` · SKU: ${item.sku}` : ""}
                                                </div>

                                                <div className="flex items-center gap-2 mt-5">
                                                    {(() => {
                                                        const base = Number(item.price ?? item.selectedSizePrice ?? 0);
                                                        const sale = item.salePrice != null ? Number(item.salePrice) : null;
                                                        const end = item.discountEndDate ? new Date(item.discountEndDate) : null;
                                                        const saleActive =
                                                            (item as any).isSaleActive ??
                                                            (sale != null && end != null && end.getTime() > Date.now());

                                                        if (saleActive && sale != null && sale < base) {
                                                            const pct = base > 0 ? Math.round(((base - sale) / base) * 100) : 0;
                                                            return (
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-base text-gray-800">${sale.toFixed(2)}</span>
                                                                        <span className="text-sm text-gray-400 line-through">${base.toFixed(2)}</span>
                                                                        {pct > 0 && <span className="text-sm text-green-600">{pct}% OFF</span>}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        Offer valid till {end!.toLocaleDateString()}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        const effective = Number(item.selectedSizePrice ?? base);
                                                        return <span className="text-base text-gray-800">${effective.toFixed(2)}</span>;
                                                    })()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-5">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => dec(item)}
                                                    className="px-3 py-1 text-lg bg-gray-200 rounded-md"
                                                >
                                                    -
                                                </button>
                                                <div className="text-sm">{item.quantity}</div>
                                                <button
                                                    onClick={() => inc(item)}
                                                    className="px-3 py-1 text-lg bg-gray-200 rounded-md"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="text-sm font-semibold text-gray-800">
                                                ${((Number(item.selectedSizePrice) || 0) * (item.quantity || 0)).toFixed(2)}
                                            </div>

                                            <button
                                                onClick={() => removeLine(item)}
                                                className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="mt-6 space-y-6 bg-white">
                            {itemsFood.length === 0 ? (
                                <div className="p-8 text-center text-gray-600">
                                    Grocery cart is empty.
                                </div>
                            ) : (
                                itemsFood.map((item) => (
                                    <div
                                        key={item.sku || `${item.productId}-${item.variantId}-${item.size}`}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
                                    >
                                        <div className="flex items-center">
                                            <img
                                                className="object-cover w-16 h-16"
                                                src={item.imageUrl || "/placeholder.png"}
                                                alt={item.title || "Item"}
                                            />
                                            <div className="ml-4">
                                                <div className="font-medium text-gray-800">
                                                    {item.title || "Item"}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {item.size}{item.color ? ` · ${item.color}` : ""}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-800">
                                            ${Number(item.selectedSizePrice || 0).toFixed(2)}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => dec(item)}
                                                className="px-2 py-1 bg-gray-200 rounded-full"
                                            >
                                                -
                                            </button>
                                            <div className="text-sm">{item.quantity}</div>
                                            <button
                                                onClick={() => inc(item)}
                                                className="px-2 py-1 bg-gray-200 rounded-full"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Price Details */}
                <div className="w-full lg:w-1/4 lg:mt-0">
                    <div className="w-full bg-white border border-gray-200">
                        <div className="p-5 mb-2 text-lg text-gray-800 border-b-2 border-gray-200">
                            <h3 className="pt-2 text-lg text-gray-800">Price Details</h3>
                        </div>

                        {selectedTab === "product" ? (
                            <div className="p-5">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <div>Items</div>
                                    <div>{totalQtyProduct}</div>
                                </div>

                                <div className="flex justify-between pt-2 pb-2 mt-4 text-lg text-gray-800 border-t-2 border-b-2 border-gray-200">
                                    <div>Subtotal</div>
                                    <div>${subtotalProduct.toFixed(2)}</div>
                                </div>

                                <div className="mt-2 text-sm font-medium text-green-600">
                                    You will save ${totalSavingsProduct.toFixed(2)} on this order
                                </div>


                                <div className="flex items-center justify-end mt-5 space-x-2">
                                    <button
                                        className="px-4 py-2 text-white bg-blue-500"
                                        onClick={() => (window.location.href = "/checkout/address")}
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
