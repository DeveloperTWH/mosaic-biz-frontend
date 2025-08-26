"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Heart } from "lucide-react";
import SimilarProduct from "./Component/SimilarProduct";
import { ProductDetailItem } from "@/types/product";
import { toast } from 'react-toastify';
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
} from '@/utils/cartUtils';

import { toggleWishlist, isProductWishlisted } from '@/utils/wishlistUtils';



export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetailItem | null>(null);
  const [liked, setLiked] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [cartQty, setCartQty] = useState<number>(0);
  const [loadingQty, setLoadingQty] = useState<boolean>(false);
  const [isBlocking, setIsBlocking] = useState(false);





  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/${id}`);
        const p: ProductDetailItem = res.data.data;
        setProduct(p);
        console.log(p);

        const firstVariant = p.variants?.[0];
        const firstSize = firstVariant?.sizes?.[0];

        if (firstVariant?.color) setSelectedColor(firstVariant.color);
        if (firstSize?.size) setSelectedSize(firstSize.size);

        // ✅ Check if product is already wishlisted
        const wishlisted = await isProductWishlisted(p._id);
        setLiked(wishlisted);
      } catch (err) {
        console.error('Failed to fetch product', err);
      }
    };

    loadProduct();
  }, [id]);

  const selectedVariant = product?.variants.find(v => v.color === selectedColor);
  const selectedPrice = selectedVariant?.sizes?.find(s => s.size === selectedSize);

  const refreshCartQty = useCallback(async () => {
    if (!product?._id || !selectedVariant?.variantId || !selectedSize) return;

    setLoadingQty(true);
    try {
      const items = await getCart(); // <- must resolve to CartItem[]
      const line = items.find(
        (it) =>
          it.productId === product._id &&
          it.variantId === selectedVariant.variantId &&
          it.size === selectedSize
      );
      setCartQty(line?.quantity ?? 0);
    } catch (e) {
      console.error('Failed to refresh cart qty', e);
      setCartQty(0);
    } finally {
      setLoadingQty(false);
    }
  }, [product?._id, selectedVariant?.variantId, selectedSize]);


  useEffect(() => {
    refreshCartQty();
  }, [refreshCartQty]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-screen-xl px-4 py-10 mx-auto lg:px-8">
      {(isBlocking || loadingQty) && (
        <div className="fixed inset-0 z-[1000] bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow">
            <span className="w-5 h-5 border-2 border-yellow-500 rounded-full border-t-transparent animate-spin" />
            <span className="text-sm font-medium text-gray-700">Loading…</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Image Section */}
        <div className="flex-1">
          <div className="relative w-full mx-auto aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/3] lg:aspect-[5/3] xl:aspect-[3/2]">
            <img
              src={mainImage || selectedVariant?.images?.[0] || product.coverImage}
              alt={product.title}
              className="absolute inset-0 object-contain w-full h-full rounded shadow"
            />

            <button
              className="absolute z-10 p-1 transition rounded-full top-4 right-4 bg-white/70 hover:bg-white"
              onClick={async () => {
                await toggleWishlist(product._id);
                setLiked((prev) => !prev);
              }}
              aria-label="Add to Wishlist"
            >
              <Heart
                className={`w-6 h-6 transition-colors duration-200 ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400'
                  }`}
                fill={liked ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {/* Include cover image first */}
            {[product.coverImage, ...(selectedVariant?.images || [])].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                onClick={() => setMainImage(img)}
                className={`object-cover w-16 h-16 border rounded cursor-pointer ${mainImage === img ? "ring-2 ring-yellow-400" : ""
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="justify-between flex-1 space-y-4">
          <h2 className="text-sm text-gray-400 uppercase">{product.brand || "Unknown Brand"}</h2>
          <div>
            <h1 className="text-xl font-bold leading-tight">{product.title}</h1>
            <p className="text-sm text-gray-600" >{product.description}</p>
          </div>

          {(() => {
            const onSale =
              selectedPrice?.salePrice != null &&
              selectedPrice?.discountEndDate &&
              new Date(selectedPrice.discountEndDate) > new Date();

            const base = Number(selectedPrice?.price) || 0;
            const sale = selectedPrice?.salePrice != null ? Number(selectedPrice.salePrice) : null;

            return (
              <div className="text-2xl font-bold text-[#c79b44]">
                ${onSale ? sale : base}

                {onSale && (
                  <>
                    <span className="ml-2 text-base text-gray-400 line-through">
                      ${base}
                    </span>
                    <span className="ml-2 text-sm text-green-600">
                      {Math.round(((base - (sale ?? 0)) / base) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            );
          })()}



          {/* Color Selection */}
          {product.variants.length > 1 && (
            <div>
              <p className="mb-1 font-semibold">COLOR</p>
              <div className="flex gap-3">
                {product.variants.map((variant) => (
                  <div
                    key={variant.color}
                    onClick={() => {
                      setLoadingQty(true);
                      setSelectedColor(variant.color);
                      const firstSize = variant.sizes?.[0]?.size;
                      if (firstSize) setSelectedSize(firstSize);
                      setLoadingQty(false);
                    }}
                    className={`w-6 h-6 rounded-full cursor-pointer border-2 ${selectedColor === variant.color ? "border-black" : "border-gray-300"
                      }`}
                    style={{ backgroundColor: variant.color }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div>
            <p className="mb-1 font-semibold">{selectedVariant?.label}</p>
            <div className="flex gap-3">
              {selectedVariant?.sizes?.map((size) => (
                <button
                  key={size.size}
                  onClick={() => {
                    setIsBlocking(true);
                    setSelectedSize(size.size)
                    setIsBlocking(false);
                  }}
                  className={`border px-3 py-1 rounded ${selectedSize === size.size ? "bg-black text-white" : "bg-white text-black"}`}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          {/* Offers */}
          {/* <div>
            <p className="font-semibold">AVAILABLE OFFERS</p>
            <ul className="ml-6 text-sm text-gray-600 list-disc">
              <li>5% cashback on Axis Bank Credit Card – T&C apply</li>
              <li>10% off on orders above $1,000 using SBI Credit Card – T&C apply</li>
            </ul>
          </div> */}

          {/* Buttons */}
          <div className="flex gap-4 pt-10 mt-4">
            {cartQty > 0 ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    setIsBlocking(true);
                    if (cartQty === 1) {
                      if (!selectedVariant?.variantId || !selectedSize) {
                        setIsBlocking(false);
                        toast.error('Please select both variant and size.');
                        return;
                      }
                      // Check if the selected size is in stock or backordering is allowed
                      const selectedVariantSize = selectedVariant?.sizes.find(s => s.size === selectedSize);
                      if (!selectedVariantSize || selectedVariantSize.stock <= 0) {
                        if (!selectedVariant.allowBackorder) {
                          setIsBlocking(false);
                          toast.error('This size is out of stock and backordering is not allowed.');
                          return;
                        }
                      }

                      await removeFromCart(product._id, selectedVariant?.variantId, selectedSize);
                      setCartQty(0);
                      setIsBlocking(false);
                    } else {
                      if (!selectedVariant?.variantId || !selectedSize) {
                        setIsBlocking(false);
                        toast.error('Please select both variant and size.');
                        return;
                      }
                      const selectedVariantSize = selectedVariant?.sizes.find(s => s.size === selectedSize);
                      if (!selectedVariantSize || selectedVariantSize.stock <= 0) {
                        if (!selectedVariant.allowBackorder) {
                          setIsBlocking(false);
                          toast.error('This size is out of stock and backordering is not allowed.');
                          return;
                        }
                      }

                      await updateCartQuantity(product._id, selectedVariant?.variantId, selectedSize, cartQty - 1);
                      setCartQty((prev) => prev - 1);
                      setIsBlocking(false);
                    }
                  }}
                  className="w-10 h-10 text-lg font-bold text-white bg-red-500 rounded hover:bg-red-600"
                >
                  –
                </button>
                <span className="min-w-[32px] text-center text-lg font-medium">{cartQty}</span>
                <button
                  onClick={async () => {
                    setIsBlocking(true);
                    if (!selectedVariant?.variantId || !selectedSize) {
                      setIsBlocking(false);
                      toast.error('Please select both variant and size.');
                      return;
                    }
                    const selectedVariantSize = selectedVariant?.sizes.find(s => s.size === selectedSize);
                    if (!selectedVariantSize || selectedVariantSize.stock <= 0) {
                      if (!selectedVariant.allowBackorder) {
                        setIsBlocking(false);
                        toast.error('This size is out of stock and backordering is not allowed.');
                        return;
                      }
                    }

                    await updateCartQuantity(product._id, selectedVariant?.variantId, selectedSize, cartQty + 1);
                    setCartQty((prev) => prev + 1);
                    setIsBlocking(false);
                  }}
                  className="w-10 h-10 text-lg font-bold text-white bg-green-600 rounded hover:bg-green-700"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="px-6 py-2 font-bold text-black bg-yellow-400 rounded hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isBlocking || loadingQty}
                onClick={async () => {
                  if (isBlocking) return;
                  setIsBlocking(true);
                  try {
                    if (!selectedVariant?.variantId || !selectedSize) {
                      toast.error('Please select both variant and size.');
                      return;
                    }

                    const selectedVariantSize = selectedVariant?.sizes.find(s => s.size === selectedSize);
                    if ((!selectedVariantSize || selectedVariantSize.stock <= 0) && !selectedVariant.allowBackorder) {
                      toast.error('This size is out of stock and backordering is not allowed.');
                      return;
                    }

                    const res = await addToCart(
                      product._id,
                      selectedVariant.variantId,
                      selectedSize,
                      1,
                      product.businessId
                    );

                    // optional: if backend forced a business switch
                    if (res?.reset) {
                      toast.info('Your cart was switched to this store.');
                    }

                    setCartQty(1);
                  } catch (err: any) {
                    // show backend error (e.g., wrong role / 403 / 401 / stock issues)
                    toast.error(err?.message || 'Failed to add to cart.');
                  } finally {
                    setIsBlocking(false);
                  }
                }}
              >
                🛒 ADD TO CART
              </button>

            )}

            <button
              className="px-6 py-2 font-bold text-white bg-black rounded hover:bg-gray-900"
              onClick={() => {
                setIsBlocking(true);
                if (!selectedVariant?.variantId || !selectedSize || !selectedPrice) {
                  setIsBlocking(false);
                  toast.error('Please select both variant and size.');
                  return;
                }

                const selectedVariantSize = selectedVariant?.sizes.find(s => s.size === selectedSize);
                if (!selectedVariantSize || selectedVariantSize.stock <= 0) {
                  if (!selectedVariant.allowBackorder) {
                    setIsBlocking(false);
                    toast.error('This size is out of stock and backordering is not allowed.');
                    return;
                  }
                }

                const price = selectedPrice?.salePrice &&
                  selectedPrice?.discountEndDate &&
                  new Date(selectedPrice.discountEndDate) > new Date()
                  ? selectedPrice.salePrice
                  : selectedPrice.price;

                const queryParams = new URLSearchParams({
                  type: 'buy',
                  productId: product._id,
                  variantId: selectedVariant.variantId,
                  size: selectedSize,
                  quantity: '1',
                  price: String(price),
                });

                window.location.href = `/checkout/address?${queryParams.toString()}`;
              }}
            >
              BUY NOW
            </button>
          </div>

        </div>
      </div>

      {/* Product Details */}
      <div className="mt-12">
        <h3 className="mb-2 text-lg font-bold">PRODUCT DETAILS</h3>
        <ul className="grid grid-cols-1 text-sm text-gray-700 md:grid-cols-2 gap-y-2">
          {product.specifications?.map((spec, i) => (
            <li key={i}><b>{spec.key}:</b> {spec.value}</li>
          ))}
        </ul>
      </div>

      {/* Ratings */}
      <div className="mt-10">
        <h3 className="text-lg font-bold">RATINGS & REVIEWS</h3>
        <div className="flex items-center gap-2 mt-2 text-yellow-600">
          ⭐ {product.variants?.[0]?.averageRating || 0}
          <span className="text-gray-700">
            ({product.variants?.[0]?.totalReviews || 0} ratings)
          </span>
        </div>
        <button className="px-4 py-2 mt-4 font-bold bg-yellow-400 rounded">
          RATE PRODUCT
        </button>
      </div>

      {/* Similar Products */}
      <SimilarProduct />
    </div>
  );
}
