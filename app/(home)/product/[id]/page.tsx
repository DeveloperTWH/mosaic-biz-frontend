"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, ChevronDown } from "lucide-react";
import SimilarProduct from "./Component/SimilarProduct";
import { ProductDetailItem, Variant, BusinessInfo } from "./types/index";
import { toast } from 'react-toastify';
import {
  addToCart,
  getCart,
  getCartDetailed,
  updateCartQuantity,
  removeFromCart,
} from '@/utils/cartUtils';
import { toggleWishlist, isProductWishlisted } from '@/utils/wishlistUtils';
import PublicSearchFilterBar from "../../Components/PublicSearchFilterBar";
import { buildSearchPageUrl, PublicSearchFilters } from "../../Components/publicSearch";

const getAttributeGroups = (variants: Variant[]): Map<string, Set<string>> => {
  const attributeMap = new Map<string, Set<string>>();
  variants.forEach(variant => {
    if (variant.attributes) {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          if (!attributeMap.has(key)) attributeMap.set(key, new Set());
          attributeMap.get(key)?.add(value);
        }
      });
    }
  });
  return attributeMap;
};



const getAvailableOptions = (
  variants: Variant[],
  attributeKey: string,
  selectedAttributes: Record<string, string>
): string[] => {
  const otherSelections = { ...selectedAttributes };
  delete otherSelections[attributeKey];
  const relevantVariants = variants.filter(variant => {
    if (!variant.attributes) return false;
    return Object.entries(otherSelections).every(([key, value]) => {
      return !value || variant.attributes?.[key] === value;
    });
  });
  const options = new Set<string>();
  relevantVariants.forEach(variant => {
    const value = variant.attributes?.[attributeKey];
    if (value && typeof value === 'string') options.add(value);
  });
  return Array.from(options);
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];
  const [product, setProduct] = useState<ProductDetailItem | null>(null);
  const [liked, setLiked] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [cartQty, setCartQty] = useState<number>(0);
  const [loadingQty, setLoadingQty] = useState<boolean>(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [attributeGroups, setAttributeGroups] = useState<Map<string, Set<string>>>(new Map());
  const [filters, setFilters] = useState<PublicSearchFilters>({
    keyword: "",
    location: "",
    minorityType: "",
  });
  const [selectedShipping, setSelectedShipping] = useState<'standard' | 'overnight' | 'local'>('standard');
  const [showVendorSwitchDialog, setShowVendorSwitchDialog] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/product/${id}`);
        const p: ProductDetailItem = res.data.data;
        setProduct(p);

        if (p.variants && p.variants.length > 0) {
          const groups = getAttributeGroups(p.variants);
          setAttributeGroups(groups);
          const firstVariant = p.variants[0];
          if (firstVariant.attributes) {
            const initialAttributes: Record<string, string> = {};
            Object.entries(firstVariant.attributes).forEach(([key, value]) => {
              if (value && typeof value === 'string') initialAttributes[key] = value;
            });
            setSelectedAttributes(initialAttributes);
          }
          setSelectedVariant(firstVariant);
          if (firstVariant.images && firstVariant.images.length > 0) {
            setMainImage(firstVariant.images[0]);
          } else {
            setMainImage(p.coverImage);
          }
        }

        try {
          const wishlisted = await isProductWishlisted(p._id);
          setLiked(wishlisted);
        } catch {
          setLiked(false);
        }
      } catch (err) {
        toast.error('Failed to load product details');
      }
    };
    loadProduct();
  }, [id]);

  const handleSelectShipping = (type: 'standard' | 'overnight' | 'local') => {
  console.log('Selected shipping:', type);
  // You can update state or call API here
};

  useEffect(() => {
    if (Object.keys(selectedAttributes).length > 0 && product?.variants) {
      const matchingVariant = product.variants.find(variant => {
        if (!variant.attributes) return false;
        return Object.entries(selectedAttributes).every(([key, value]) => {
          return variant.attributes?.[key] === value;
        });
      });
      setSelectedVariant(matchingVariant || null);
      // if (matchingVariant?.images && matchingVariant.images.length > 0) {
      //   setMainImage(matchingVariant.images[0]);
      // }
   const firstImage =
  matchingVariant?.images?.[0] ||
  product?.galleryImages?.[0] ||
  product?.coverImage;

setMainImage(firstImage);
    }
  }, [selectedAttributes, product]);

  const refreshCartQty = useCallback(async () => {
    if (!product?._id || !selectedVariant?.variantId) return;
    setLoadingQty(true);
    try {
      const items = await getCart();
      const line = items.find(
        (it: any) => it.productId === product._id && it.variantId === selectedVariant.variantId
      );
      setCartQty(line?.quantity ?? 0);
    } catch {
      setCartQty(0);
    } finally {
      setLoadingQty(false);
    }
  }, [product?._id, selectedVariant?.variantId]);

  const calculatePrice = () => {
    if (!selectedVariant) return { current: 0, original: 0, discount: 0, onSale: false };
    const base = Number(selectedVariant.price) || 0;
    const sale = selectedVariant.salePrice != null ? Number(selectedVariant.salePrice) : null;
    const onSale =
      sale != null &&
      (!selectedVariant.discountEndDate || new Date(selectedVariant.discountEndDate).getTime() > Date.now());
    return {
      current: onSale ? (sale as number) : base,
      original: base,
      discount: onSale && base > 0 && (sale as number) < base
        ? Math.round(((base - (sale as number)) / base) * 100)
        : 0,
      onSale
    };
  };

  const price = calculatePrice();

  const getSellerName = (): string => {
    if (!product) return "Unknown Seller";
    if (product.businessId && typeof product.businessId === 'object' && 'businessName' in product.businessId)
      return (product.businessId as BusinessInfo).businessName;
    if (product.business && typeof product.business === 'object' && 'businessName' in product.business)
      return (product.business as BusinessInfo).businessName;
    return "Unknown Seller";
  };

  const getBusinessId = (): string => {
    if (!product) return '';
    if (product.businessId && typeof product.businessId === 'object' && '_id' in product.businessId)
      return (product.businessId as BusinessInfo)._id;
    if (typeof product.businessId === 'string') return product.businessId;
    if (product.business && typeof product.business === 'object' && '_id' in product.business)
      return (product.business as BusinessInfo)._id;
    return '';
  };

  const formatAttributeName = (key: string): string => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
  };

  const isVariantSelected = (): boolean => {
    if (!product?.variants || product.variants.length === 0) return true;
    if (product.variants.length === 1) return true;
    return selectedVariant !== null;
  };

  const isColor = (key: string) => key.toLowerCase().includes('color');
  const sellerBusinessId = getBusinessId();

  const handleSearch = () => {
    router.push(buildSearchPageUrl(filters));
  };

  const productImages = [
  ...(selectedVariant?.images || []),
  ...(product?.galleryImages || [])
];

  const toNumber = (value: unknown): number => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    if (value && typeof value === 'object' && '$numberDecimal' in (value as Record<string, unknown>)) {
      const parsed = parseFloat(String((value as Record<string, unknown>).$numberDecimal));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatMoney = (value: unknown): string => toNumber(value).toFixed(2);

  const resolvedShipping = {
    standard: selectedVariant?.shipping?.standard ?? product?.shipping?.standard ?? 0,
    overnight: selectedVariant?.shipping?.overnight ?? product?.shipping?.overnight ?? 0,
    local: selectedVariant?.shipping?.local ?? product?.shipping?.local ?? 0
  };

  const performAddToCart = useCallback(async () => {
    if (!product || isBlocking || !selectedVariant?.variantId) {
      toast.error('Variant information is missing');
      return;
    }

    setIsBlocking(true);
    try {
      const sizeValue = selectedVariant.attributes?.size || selectedVariant.attributes?.Size || 'default';
      const basePrice = toNumber(selectedVariant.price);
      const variantSalePrice =
        selectedVariant.salePrice == null ? null : toNumber(selectedVariant.salePrice);
      const discountEndDate = selectedVariant.discountEndDate ?? null;
      const saleActive =
        variantSalePrice != null &&
        (!discountEndDate || new Date(discountEndDate).getTime() > Date.now());
      const res = await addToCart(
        product._id,
        selectedVariant.variantId,
        sizeValue,
        1,
        getBusinessId(),
          {
            price: basePrice,
            salePrice: variantSalePrice,
            discountEndDate,
            selectedSizePrice: saleActive ? variantSalePrice ?? basePrice : basePrice,
            shippingType: selectedShipping,
            shippingMethod: selectedShipping,
            shippingCost: toNumber(resolvedShipping[selectedShipping]),
            imageUrl: selectedVariant.images?.[0] || product.coverImage,
            color: selectedVariant.attributes?.Color || selectedVariant.attributes?.color,
            stock: selectedVariant.stock,
          allowBackorder: selectedVariant.allowBackorder ?? false,
          title: product.title,
          sku: selectedVariant.sku,
        }
      );
      if (res?.reset) toast.info('Your cart was switched to this store.');
      setCartQty(1);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add to cart.');
    } finally {
      setIsBlocking(false);
    }
  }, [isBlocking, product, resolvedShipping, selectedShipping, selectedVariant]);

  const handleAddToCartClick = useCallback(async () => {
    if (isBlocking || !selectedVariant?.variantId) {
      toast.error('Variant information is missing');
      return;
    }

    try {
      const cartItems = await getCartDetailed();
      const currentBusinessId = getBusinessId();
      const existingBusinessId = cartItems.find((item) => item.businessId)?.businessId;

      if (cartItems.length > 0 && existingBusinessId && existingBusinessId !== currentBusinessId) {
        setShowVendorSwitchDialog(true);
        return;
      }

      await performAddToCart();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to check cart.');
    }
  }, [isBlocking, performAddToCart, selectedVariant]);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative w-full h-[180px] bg-gray-800 overflow-hidden">
        <img src="/products/19099 1.png" alt="header" className="absolute inset-0 object-cover w-full h-full opacity-40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-white uppercase">Shop Product
</h1>
          <nav className="mt-2 text-sm text-gray-300">
            <span className="hover:text-white cursor-pointer">Home</span>
            <span className="mx-2">//</span>
            <span className="hover:text-white cursor-pointer">Shop</span>
            <span className="mx-2">//</span>
            <span className="text-[#c79b44]">Product</span>
          </nav>
        </div>
      </div>

      {/* Filter Section */}
      <PublicSearchFilterBar filters={filters} onChange={setFilters} onSubmit={handleSearch} />

      {/* Blocking overlay */}
      {(isBlocking || loadingQty) && (
        <div className="fixed inset-0 z-[1000] bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow">
            <span className="w-5 h-5 border-2 border-[#c79b44] rounded-full border-t-transparent animate-spin" />
            <span className="text-sm font-medium text-gray-700">Loading…</span>
          </div>
        </div>
      )}

      {showVendorSwitchDialog && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900">You&apos;re adding a product from a different vendor.</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Your current cart contains items from another vendor and will be cleared if you continue.
            </p>
            <p className="mt-2 text-sm font-medium text-gray-800">Do you want to proceed?</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setShowVendorSwitchDialog(false)}
                className="min-w-[140px] rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowVendorSwitchDialog(false);
                  await performAddToCart();
                }}
                className="min-w-[140px] rounded-md bg-[#1e3a5f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#152a45]"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl px-4 py-8 mx-auto lg:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">

          {/* LEFT: Images */}
          <div className="lg:w-[45%]">
            <div className="relative w-full aspect-square bg-gray-50 rounded overflow-hidden border border-gray-100">
              <img
                // src={mainImage || product.coverImage}
                src={mainImage || productImages[0] || product.coverImage}
                alt={product.title}
                className="absolute inset-0 object-cover w-full h-full"
              />
              <button
                className="absolute z-10 p-2 rounded-full top-3 right-3 bg-white/90 hover:bg-white shadow"
                onClick={async () => {
                  try {
                    await toggleWishlist(product._id);
                    setLiked(prev => !prev);
                  } catch {
                    toast.error('Failed to update wishlist');
                  }
                }}
              >
                <Heart className={`w-4 h-4 ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnails */}
{productImages.length > 0 && (
  <div className="flex gap-2 mt-3 flex-wrap">
    {productImages.map((img: string, i: number) => (
      <button
        key={i}
        onClick={() => setMainImage(img)}
        className={`w-[80px] h-[80px] border-2 rounded overflow-hidden transition-all ${
          mainImage === img
            ? "border-[#c79b44]"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <img
          src={img}
          alt={`thumb-${i}`}
          className="object-cover w-full h-full"
        />
      </button>
    ))}
  </div>
)}

            {/* {selectedVariant?.images && selectedVariant.images.length > 0 && (
              <div className="flex gap-2 mt-3">
                {selectedVariant.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`w-[80px] h-[80px] border-2 rounded overflow-hidden transition-all ${mainImage === img ? 'border-[#c79b44]' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`thumb-${i}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )} */}
          </div>

          {/* RIGHT: Info */}
          <div className="flex-1 space-y-3">
            {/* Seller */}
            <p className="text-xs text-[#c79b44]">
              <span className="text-gray-400">Seller: </span>
              {sellerBusinessId ? (
                <Link
                  href={`/vendor-profile/product-vendor/${sellerBusinessId}`}
                  className="font-medium hover:underline cursor-pointer"
                >
                  {getSellerName()}
                </Link>
              ) : (
                <span className="font-medium">{getSellerName()}</span>
              )}
            </p>

            {/* Product Title */}
<h1
  className="text-[22px] leading-snug text-gray-900"
  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 , fontSize: '36px' }}
>
  {product.title}
</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 underline cursor-pointer"> 0 Ratings & 0 Reviews</span>
            </div>

            {/* Price (hide when 0) */}
  {/* Price (hide when 0) */}
{price.current > 0 && (
  <div className="flex items-baseline gap-3 pb-3 border-b border-gray-200">
    {/* Current price (sale price) */}
    <span
      className="text-3xl text-gray-900"
      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
    >
      ${price.current.toFixed(2)}
    </span>

    {/* Slashed/original price */}
    {price.onSale && price.original > price.current && (
      <>
        <span className="text-base text-gray-400 line-through">
          ${price.original.toFixed(2)}
        </span>
        {price.discount > 0 && (
          <span className="text-sm font-semibold text-green-600">
            {price.discount}% OFF
          </span>
        )}
      </>
    )}
  </div>
)}

            {/* Attributes */}
            {attributeGroups.size > 0 && (
              <div className="space-y-3">
                {Array.from(attributeGroups.entries()).map(([attributeKey, values]) => {
                  const availableOptions = getAvailableOptions(product.variants || [], attributeKey, selectedAttributes);
                  const currentValue = selectedAttributes[attributeKey] || '';
                  const colorAttr = isColor(attributeKey);

                  return (
                    <div key={attributeKey} className="border-b border-gray-100 pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {formatAttributeName(attributeKey)}
                          {currentValue && !colorAttr && (
                            <span className="font-normal text-gray-500 ml-2">{currentValue}</span>
                          )}
                        </p>
                        {/* <ChevronDown className="w-4 h-4 text-gray-400" /> */}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {Array.from(values).map(value => {
                          const isAvailable = availableOptions.includes(value);
                          const isSelected = currentValue === value;

                          if (colorAttr) {
                            return (
                              <button
                                key={value}
                                onClick={() => isAvailable && setSelectedAttributes(prev => ({ ...prev, [attributeKey]: value }))}
                                disabled={!isAvailable}
                                title={value}
                                className={`w-7 h-7 rounded-full border-2 transition-all ${isSelected ? 'border-black ring-2 ring-offset-1 ring-gray-400' : 'border-gray-300'} ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
                                style={{ backgroundColor: value }}
                              />
                            );
                          }

                          return (
                            <button
                              key={value}
                              onClick={() => isAvailable && setSelectedAttributes(prev => ({ ...prev, [attributeKey]: value }))}
                              disabled={!isAvailable}
                              className={`min-w-[38px] px-3 py-1.5 border rounded text-sm font-medium transition-all ${isSelected
                                ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                                : !isAvailable
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-[#1e3a5f] cursor-pointer'
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Choose Your Shipping */}
<div className="pt-2">
  <p className="text-sm font-semibold text-gray-800">Choose Your Shipping</p>
  <p className="text-xs text-gray-500">Select one shipping option</p>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
    {(['standard', 'overnight', 'local'] as const).map((type) => {
      const isSelected = selectedShipping === type;
      return (
        <button
          key={type}
          onClick={() => setSelectedShipping(type)}
          className={`
            flex flex-col items-start p-4 rounded-md border transition-colors
            ${isSelected ? 'bg-[#c9a227] border-[#c9a227] text-white' : 'bg-white border-gray-300 hover:bg-gray-50'}
          `}
        >
          <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'} capitalize`}>
            {type}
          </p>
          <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
            ${formatMoney(resolvedShipping[type])}
          </p>
        </button>
      );
    })}
  </div>
</div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {cartQty > 0 ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (!selectedVariant?.variantId) return;
                      setIsBlocking(true);
                      try {
                        const sizeValue = selectedVariant.attributes?.size || selectedVariant.attributes?.Size || 'default';
                        if (cartQty === 1) { 
                          await removeFromCart(product._id, selectedVariant.variantId, sizeValue); 
                          setCartQty(0); 
                        }
                        else { 
                          await updateCartQuantity(product._id, selectedVariant.variantId, sizeValue, cartQty - 1); 
                          setCartQty(p => p - 1); 
                        }
                      } catch { toast.error('Failed to update cart'); }
                      finally { setIsBlocking(false); }
                    }}
                    className="w-9 h-9 text-base font-bold text-white bg-red-500 rounded hover:bg-red-600"
                  >−</button>
                  <span className="min-w-[28px] text-center font-medium">{cartQty}</span>
                  <button
                    onClick={async () => {
                      if (!selectedVariant?.variantId) return;
                      setIsBlocking(true);
                      try { 
                        const sizeValue = selectedVariant.attributes?.size || selectedVariant.attributes?.Size || 'default';
                        await updateCartQuantity(product._id, selectedVariant.variantId, sizeValue, cartQty + 1); 
                        setCartQty(p => p + 1); 
                      }
                      catch { toast.error('Failed to update cart'); }
                      finally { setIsBlocking(false); }
                    }}
                    className="w-9 h-9 text-base font-bold text-white bg-green-600 rounded hover:bg-green-700"
                  >+</button>
                </div>
              ) : (
                <button
                  className="flex-1 py-2.5 font-semibold text-white bg-[#1e3a5f] rounded hover:bg-[#152a45] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm uppercase tracking-wide"
                  disabled={isBlocking || loadingQty || !isVariantSelected() || Boolean(selectedVariant && selectedVariant.stock <= 0)}
                  onClick={handleAddToCartClick}
                >
                  {!isVariantSelected() ? 'Select Options' : selectedVariant && selectedVariant.stock <= 0 ? 'Out of Stock' : 'Add To Cart'}
                </button>
              )}

              <button
                className="flex-1 py-2.5 font-semibold text-white bg-[#c79b44] rounded hover:bg-[#b08a3a] transition-colors text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isVariantSelected() || Boolean(selectedVariant && selectedVariant.stock <= 0)}
                onClick={() => {
                  if (!selectedVariant?.variantId) { toast.error('Variant information is missing'); return; }
                  const sizeValue = selectedVariant.attributes?.size || selectedVariant.attributes?.Size || 'default';
                  const queryParams = new URLSearchParams({
                    type: 'buy', productId: product._id, variantId: selectedVariant.variantId,
                    size: sizeValue,
                    quantity: '1',
                    shippingMethod: selectedShipping,
                  });
                  router.push(`/checkout/buy-now?${queryParams.toString()}`);
                }}
              >
                Buy Now
              </button>
            </div>

            {/* Product Details Table — RIGHT COLUMN */}
            {((product.metaFields && product.metaFields.length > 0) || (product.attributes && product.attributes.length > 0)) && (
              <div className="mt-8 pt-4 border-t border-gray-100">
<h3
  className="uppercase tracking-wider mb-3"
  style={{
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: '20px',
    color: '#C7A040'
  }}
>
  Product Details
</h3>
<div className="space-y-0">
  {product.metaFields && product.metaFields.length > 0
    ? product.metaFields.map((field, i) => (
      <div key={i} className="flex py-1.5 border-b border-gray-100">
        <span
          className="w-44 shrink-0"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '16px'
          }}
        >
          {field.key
            .split(" ")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")}
        </span>

        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            fontSize: '16px'
          }}
        >
          {field.value}
        </span>
      </div>
    ))
    : product.attributes?.map((attr, i) => (
      <div key={i} className="flex py-1.5 border-b border-gray-100">
        <span
          className="w-44 shrink-0"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            fontSize: '16px'
          }}
        >
          {attr.name
            .split(" ")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")}
        </span>

        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 500,
            fontSize: '16px'
          }}
        >
          {Array.isArray(attr.values)
            ? attr.values.join(", ")
            : String(attr.values ?? "")}
        </span>
      </div>
    ))
  }
</div>
              </div>
            )}

            {/* About Item — RIGHT COLUMN */}
            {product.description && (
              <div className="mt-6 pt-4 border-t border-gray-100">
            <h3
  className="uppercase tracking-wider mb-3"
  style={{
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: '20px',
    color: '#C7A040'
  }}
>
  About Item
</h3>
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px' }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Additional Information — RIGHT COLUMN */}
            {(product.weight || product.netQuantity || product.genericName) && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3
                  className="text-sm text-gray-900 uppercase tracking-wider mb-3"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                >
                  Additional Information
                </h3>
                <div className="space-y-0">
                  {product.weight && (
                    <div className="flex py-1.5 border-b border-gray-100">
                      <span className="w-44 text-xs text-gray-500 shrink-0" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>Item Weight</span>
                      <span className="text-xs text-gray-800" style={{ fontWeight: 600 }}>{product.weight}</span>
                    </div>
                  )}
                  {product.netQuantity && (
                    <div className="flex py-1.5 border-b border-gray-100">
                      <span className="w-44 text-xs text-gray-500 shrink-0" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>Net Quantity</span>
                      <span className="text-xs text-gray-800" style={{ fontWeight: 600 }}>{product.netQuantity}</span>
                    </div>
                  )}
                  {product.genericName && (
                    <div className="flex py-1.5 border-b border-gray-100">
                      <span className="w-44 text-xs text-gray-500 shrink-0" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>Generic Name</span>
                      <span className="text-xs text-gray-800" style={{ fontWeight: 600 }}>{product.genericName}</span>
                    </div>
                  )}
                </div>
                <button className="mt-4 px-5 py-2 bg-[#c79b44] text-white text-xs font-semibold rounded hover:bg-[#b08a3a] transition-colors uppercase tracking-wide">
                  Add Review
                </button>
              </div>
            )}

            {/* Ratings & Reviews — RIGHT COLUMN */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3
                className="text-sm text-gray-900 uppercase tracking-wider mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
              >
                Ratings & Reviews
              </h3>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900">0</div>
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">0 Ratings & 0 Reviews</p>
                </div>
              </div>
              <button className="mt-4 px-7 py-2.5 font-semibold text-white bg-[#1e3a5f] rounded hover:bg-[#152a45] transition-colors uppercase tracking-wide text-xs">
                Rate Product
              </button>
            </div>

          </div>
        </div>

        {/* Similar Products — full width below both columns */}
        <div className="mt-14">
          <SimilarProduct productId={product._id} />
        </div>
      </div>
    </div>
  );
}
