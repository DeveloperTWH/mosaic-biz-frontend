"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Heart } from "lucide-react";
import SimilarProduct from "./Component/SimilarProduct";
import { ProductDetailItem, Variant, BusinessInfo } from "./types/index";
import { toast } from 'react-toastify';
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
} from '@/utils/cartUtils';
import { toggleWishlist, isProductWishlisted } from '@/utils/wishlistUtils';

// Helper to extract unique colors from variants
const getUniqueColors = (variants: Variant[]): string[] => {
  const colors = new Set<string>();
  variants.forEach(v => {
    // Check both lowercase and uppercase versions
    if (v.attributes?.color) colors.add(v.attributes.color);
    if (v.attributes?.Color) colors.add(v.attributes.Color);
  });
  return Array.from(colors);
};

// Helper to get sizes for a specific color
const getSizesForColor = (variants: Variant[], color: string) => {
  return variants
    .filter(v => 
      v.attributes?.color === color || v.attributes?.Color === color
    )
    .map(v => ({
      size: v.attributes?.size, // size is lowercase in both responses
      variantId: v.variantId,
      price: v.price,
      salePrice: v.salePrice,
      stock: v.stock,
      discountEndDate: v.discountEndDate,
      images: v.images
    }));
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetailItem | null>(null);
  const [liked, setLiked] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [cartQty, setCartQty] = useState<number>(0);
  const [loadingQty, setLoadingQty] = useState<boolean>(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Get unique colors from variants
  const colors = product?.variants ? getUniqueColors(product.variants) : [];
  
  // Get sizes for selected color
  const sizes = selectedColor ? getSizesForColor(product?.variants || [], selectedColor) : [];

  // Reset play state whenever mainImage changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
      setIsPlaying(true);
    }
  }, [mainImage]);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/product/${id}`);
        const p: ProductDetailItem = res.data.data;
        setProduct(p);
        console.log('Product data:', p);

        // Set initial selections
        if (p.variants && p.variants.length > 0) {
          const firstVariant = p.variants[0];
          
          // Check for color in both lowercase and uppercase
          const firstColor = firstVariant.attributes?.color || firstVariant.attributes?.Color;
          const firstSize = firstVariant.attributes?.size;
          
          if (firstColor) setSelectedColor(firstColor);
          if (firstSize) setSelectedSize(firstSize);
          setSelectedVariant(firstVariant);
          
          // Set main image
          if (firstVariant.images && firstVariant.images.length > 0) {
            setMainImage(firstVariant.images[0]);
          } else {
            setMainImage(p.coverImage);
          }
        }

        // Check if product is already wishlisted
        try {
          const wishlisted = await isProductWishlisted(p._id);
          setLiked(wishlisted);
        } catch (wishlistErr) {
          console.error('Failed to check wishlist status:', wishlistErr);
          setLiked(false);
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
        toast.error('Failed to load product details');
      }
    };

    loadProduct();
  }, [id]);

  // Update selected variant when color or size changes
  useEffect(() => {
    if (selectedColor && selectedSize && product) {
      const variant = product.variants.find(
        v => 
          (v.attributes?.color === selectedColor || v.attributes?.Color === selectedColor) && 
          v.attributes?.size === selectedSize
      );
      setSelectedVariant(variant || null);
      
      // Update main image when variant changes
      if (variant?.images && variant.images.length > 0) {
        setMainImage(variant.images[0]);
      }
    }
  }, [selectedColor, selectedSize, product]);

  const refreshCartQty = useCallback(async () => {
    if (!product?._id || !selectedVariant?.variantId || !selectedSize) return;

    setLoadingQty(true);
    try {
      const items = await getCart();
      console.log('Cart items:', items);
      
      const line = items.find(
        (it: any) =>
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

  // commented this useEffect - it's needed to fetch cart quantity
  // useEffect(() => {
  //   refreshCartQty();
  // }, [refreshCartQty]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-[#c79b44] rounded-full border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Calculate price with potential discount
  const calculatePrice = () => {
    if (!selectedVariant) return { current: 0, original: 0, discount: 0 };
    
    const base = Number(selectedVariant.price) || 0;
    const sale = selectedVariant.salePrice != null ? Number(selectedVariant.salePrice) : null;
    
    const onSale = sale != null && 
                   selectedVariant.discountEndDate && 
                   new Date(selectedVariant.discountEndDate) > new Date();
    
    return {
      current: onSale ? sale : base,
      original: base,
      discount: onSale ? Math.round(((base - sale) / base) * 100) : 0,
      onSale
    };
  };

  const price = calculatePrice();

  // Get seller/business name from the response
  const getSellerName = (): string => {
    // Check if businessId is an object with businessName
    if (product.businessId && typeof product.businessId === 'object' && 'businessName' in product.businessId) {
      return (product.businessId as BusinessInfo).businessName;
    }
    // Check if business object exists
    if (product.business && typeof product.business === 'object' && 'businessName' in product.business) {
      return (product.business as BusinessInfo).businessName;
    }
    // Fallback
    return "Unknown Seller";
  };

  // Get business ID for cart operations
  const getBusinessId = (): string => {
    if (product.businessId && typeof product.businessId === 'object' && '_id' in product.businessId) {
      return (product.businessId as BusinessInfo)._id;
    }
    return product.businessId as string;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
<div className="relative w-full h-[250px] md:h-[300px] bg-gray-800">
  <div className="absolute inset-0">
    <img
      src="/products/19099 1.png"
      alt="header background"
      className="object-cover w-full h-full"
    />
  </div>
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center px-4">
    <h1 className="text-3xl md:text-5xl font-bold tracking-wide text-white uppercase">
      Shop Product
    </h1>
    <nav className="mt-2 text-base text-gray-300">
      <span className="hover:text-white cursor-pointer">Home</span>
      <span className="mx-2">//</span>
      <span className="hover:text-white cursor-pointer">Shop</span>
      <span className="mx-2">//</span>
      <span className="text-[#c79b44]">Product</span>
    </nav>
  </div>
</div>

      {/* Main Content */}
      <div className="max-w-7xl px-4 py-8 mx-auto lg:px-8">
        {(isBlocking || loadingQty) && (
          <div className="fixed inset-0 z-[1000] bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow">
              <span className="w-5 h-5 border-2 border-[#c79b44] rounded-full border-t-transparent animate-spin" />
              <span className="text-sm font-medium text-gray-700">Loading…</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Image Section */}
          <div className="flex-1">
            <div className="relative w-full mx-auto aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/3] lg:aspect-[5/3] xl:aspect-[3/2] bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.title}
                  className="absolute inset-0 object-contain w-full h-full"
                />
              ) : (
                <img
                  src={product.coverImage}
                  alt={product.title}
                  className="absolute inset-0 object-contain w-full h-full"
                />
              )}

              <button
                className="absolute z-10 p-2 transition-all rounded-full top-4 right-4 bg-white/90 hover:bg-white shadow-md hover:shadow-lg"
                onClick={async () => {
                  try {
                    await toggleWishlist(product._id);
                    setLiked((prev) => !prev);
                  } catch (err) {
                    console.error('Failed to toggle wishlist:', err);
                    toast.error('Failed to update wishlist');
                  }
                }}
                aria-label="Add to Wishlist"
              >
                <Heart
                  className={`w-5 h-5 transition-colors duration-200 ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400'
                    }`}
                  fill={liked ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            {/* Thumbnail Images */}
            {selectedVariant && selectedVariant.images && selectedVariant.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedVariant.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`flex-shrink-0 object-cover w-16 h-16 border-2 rounded cursor-pointer transition-all ${mainImage === img ? "border-[#c79b44] ring-2 ring-[#c79b44]/20" : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${i}`}
                      className="object-cover w-full h-full rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="justify-between flex-1 space-y-4">
            {/* Seller/Business Name */}
            <div className="mb-2">
              <span className="text-xs font-semibold tracking-wider text-[#c79b44] uppercase">
                Seller: {getSellerName()}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">160 Ratings & 5 Reviews</span>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-3xl font-bold text-[#c79b44]">${price.current.toFixed(2)}</span>
              {price.onSale && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ${price.original.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {price.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Color</p>
                  <span className="text-sm text-gray-500 capitalize">{selectedColor || 'Select color'}</span>
                </div>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color as string}
                      onClick={() => {
                        setSelectedColor(color as string);
                        const firstSizeForColor = getSizesForColor(product.variants, color as string)[0]?.size;
                        if (firstSizeForColor) setSelectedSize(firstSizeForColor);
                      }}
                      className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-all shadow-sm ${selectedColor === color 
                        ? "border-[#c79b44] ring-2 ring-[#c79b44] ring-offset-2" 
                        : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color as string }}
                      title={color as string}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Size</p>
                  <button className="text-xs text-[#c79b44] hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      disabled={size.stock <= 0}
                      className={`min-w-[48px] px-4 py-2.5 border-2 rounded-md text-sm font-semibold transition-all ${selectedSize === size.size 
                        ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" 
                        : size.stock <= 0
                        ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-200"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
                      }`}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {cartQty > 0 ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      if (!selectedVariant?.variantId) {
                        toast.error('Variant information is missing');
                        return;
                      }
                      setIsBlocking(true);
                      try {
                        if (cartQty === 1) {
                          await removeFromCart(product._id, selectedVariant.variantId, selectedSize);
                          setCartQty(0);
                        } else {
                          await updateCartQuantity(product._id, selectedVariant.variantId, selectedSize, cartQty - 1);
                          setCartQty((prev) => prev - 1);
                        }
                      } catch (err) {
                        console.error('Failed to update cart:', err);
                        toast.error('Failed to update cart');
                      } finally {
                        setIsBlocking(false);
                      }
                    }}
                    className="w-12 h-12 text-xl font-bold text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors shadow-md"
                  >
                    −
                  </button>
                  <span className="min-w-[40px] text-center text-xl font-bold text-gray-900">{cartQty}</span>
                  <button
                    onClick={async () => {
                      if (!selectedVariant?.variantId) {
                        toast.error('Variant information is missing');
                        return;
                      }
                      setIsBlocking(true);
                      try {
                        await updateCartQuantity(product._id, selectedVariant.variantId, selectedSize, cartQty + 1);
                        setCartQty((prev) => prev + 1);
                      } catch (err) {
                        console.error('Failed to update cart:', err);
                        toast.error('Failed to update cart');
                      } finally {
                        setIsBlocking(false);
                      }
                    }}
                    className="w-12 h-12 text-xl font-bold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-md"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="flex-1 px-8 py-4 font-bold text-white bg-[#1e3a5f] rounded-md hover:bg-[#152a45] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg uppercase tracking-wide"
                  disabled={isBlocking || loadingQty || !selectedVariant}
                  onClick={async () => {
                    if (isBlocking || !selectedVariant) return;
                    if (!selectedVariant.variantId) {
                      toast.error('Variant information is missing');
                      return;
                    }
                    setIsBlocking(true);
                    try {
                      const res = await addToCart(
                        product._id,
                        selectedVariant.variantId,
                        selectedSize,
                        1,
                        getBusinessId()
                      );

                      if (res?.reset) {
                        toast.info('Your cart was switched to this store.');
                      }

                      setCartQty(1);
                    } catch (err: any) {
                      toast.error(err?.message || 'Failed to add to cart.');
                    } finally {
                      setIsBlocking(false);
                    }
                  }}
                >
                  Add To Cart
                </button>
              )}

              <button
                className="flex-1 px-8 py-4 font-bold text-white bg-[#c79b44] rounded-md hover:bg-[#b08a3a] transition-all shadow-md hover:shadow-lg uppercase tracking-wide"
                onClick={() => {
                  if (!selectedVariant) {
                    toast.error('Please select both color and size.');
                    return;
                  }
                  if (!selectedVariant.variantId) {
                    toast.error('Variant information is missing');
                    return;
                  }

                  const queryParams = new URLSearchParams({
                    type: 'buy',
                    productId: product._id,
                    variantId: selectedVariant.variantId,
                    size: selectedSize,
                    quantity: '1',
                    price: String(price.current),
                  });

                  window.location.href = `/checkout/address?${queryParams.toString()}`;
                }}
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>

        {/* Product Details / Specifications */}
        <div className="mt-10 lg:ml-[calc(50%+1.5rem)] lg:w-[calc(50%-1.5rem)]">
          <h3 className="mb-3 text-[18px] leading-none font-semibold font-montserrat text-[#c79b44] border-b border-gray-200 pb-2">
            Product Details
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {product.metaFields && product.metaFields.length > 0 ? (
              product.metaFields.map((field, i) => (
                <div key={i} className="flex py-1">
                  <span className="w-40 text-[14px] font-bold font-montserrat text-[#2E2E2E]">
                    {field.key
                      .split(" ")
                      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </span>
                  <span className="text-[14px] font-medium font-montserrat text-[#5F5F5F]">{field.value}</span>
                </div>
              ))
            ) : product.attributes && product.attributes.length > 0 ? (
              product.attributes.map((attr, i) => (
                <div key={i} className="flex py-1">
                  <span className="w-40 text-[14px] font-bold font-montserrat text-[#2E2E2E]">
                    {attr.name
                      .split(" ")
                      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </span>
                  <span className="text-[14px] font-medium font-montserrat text-[#5F5F5F]">
                    {Array.isArray(attr.values) ? attr.values.join(", ") : String(attr.values ?? "")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No specifications available</p>
            )}
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-8 pt-6 border-t border-gray-100 lg:ml-[calc(50%+1.5rem)] lg:w-[calc(50%-1.5rem)]">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Ratings & Reviews Section */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-6">Ratings & Reviews</h3>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">4.5</div>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-600">160 Ratings & 5 Reviews</p>
            </div>
            <div className="flex-1">
              {/* Rating bars could go here */}
            </div>
          </div>
          <button className="mt-6 px-8 py-3 font-bold text-white bg-[#1e3a5f] rounded-md hover:bg-[#152a45] transition-colors uppercase tracking-wide">
            Rate Product
          </button>
        </div>

        {/* Similar Products */}
        <div className="mt-12">
          <SimilarProduct productId={product._id} />
        </div>
      </div>
    </div>
  );
}
