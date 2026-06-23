"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, PenTool } from "lucide-react";
import SimilarProduct from "./Component/SimilarProduct";
import { ProductDetailItem, Variant, BusinessInfo } from "./types/index";
import { toast } from 'react-toastify';
import { Review } from "@/types/review";
import {
  addToCart,
  getCart,
  getCartDetailed,
  updateCartQuantity,
  removeFromCart,
  resolveDisplayPrice,
} from '@/utils/cartUtils';
import { toggleWishlist, isProductWishlisted } from '@/utils/wishlistUtils';
import CommerceMobileSearchBar from "../../Components/CommerceMobileSearchBar";
import PublicPageHero from "../../Components/PublicPageHero";
import MarketplaceEligibilityBanner from "../../Components/MarketplaceEligibilityBanner";
import MarketLoadingBlock from "../../Components/MarketLoadingBlock";
import MobileStickyActionBar from "../../Components/MobileStickyActionBar";
import TrustBadge from "../../Components/TrustBadge";
import { pickBadgeValue } from "@/lib/trustBadge";
import { buildSearchPageUrl, PublicSearchFilters } from "../../Components/publicSearch";
import MarketEmptyState from "../../Components/MarketEmptyState";
import ShopperTrustCallout from "../../Components/ShopperTrustCallout";
import { SHOPPER_PRODUCT_TRUST_NOTE } from "../../Components/marketTrustProof";
import { getStockHint } from "../../Components/publicCards/publicProductCardMappers";
import {
  extractBusinessFromProduct,
  getBusinessIdFromUnknown,
  getMarketplaceEligibility,
  type MarketplaceEligibility,
} from "@/lib/marketplace/businessEligibility";
import { fetchPublicVendorEligibility } from "@/lib/marketplace/fetchPublicVendorEligibility";

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

interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Record<number, number>;
}

interface ProductReviewsResponse {
  success: boolean;
  data: {
    summary: ReviewSummary;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    reviews: Review[];
  };
}

const emptyRatingBreakdown: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

const renderStarIcons = (rating: number, sizeClass = 'w-4 h-4') =>
  [1, 2, 3, 4, 5].map((star) => {
    const filled = rating >= star;
    const partial = rating < star && rating > star - 1;

    return (
      <div key={star} className={`relative ${sizeClass}`}>
        <svg className={`${sizeClass} text-gray-200 fill-current`} viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        {(filled || partial) && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: filled ? '100%' : `${Math.max(0, Math.min(100, (rating - (star - 1)) * 100))}%` }}
          >
            <svg className={`${sizeClass} text-yellow-400 fill-current`} viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        )}
      </div>
    );
  });

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];
  const [product, setProduct] = useState<ProductDetailItem | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "error" | "ready">("loading");
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary>({
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: emptyRatingBreakdown,
  });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsSubmitting, setReviewsSubmitting] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [vendorEligibility, setVendorEligibility] = useState<MarketplaceEligibility | null>(null);

  const fetchReviews = useCallback(async (productId: string) => {
    setReviewsLoading(true);
    try {
      const res = await axios.get<ProductReviewsResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/${productId}/reviews?page=1&limit=10`
      );
      const summary = res.data.data.summary;
      setReviewSummary({
        totalReviews: summary?.totalReviews ?? 0,
        averageRating: summary?.averageRating ?? 0,
        ratingBreakdown: { ...emptyRatingBreakdown, ...(summary?.ratingBreakdown ?? {}) },
      });
      setReviews(res.data.data.reviews ?? []);
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      setLoadState("loading");
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/product/${id}`);
        const p: ProductDetailItem = res.data.data;
        setProduct(p);
        setLoadState("ready");

        const business = extractBusinessFromProduct(p);
        let eligibility = getMarketplaceEligibility(business);
        if (eligibility.code === "unknown") {
          const businessId =
            getBusinessIdFromUnknown(p.businessId) ?? getBusinessIdFromUnknown(p.business);
          if (businessId) {
            eligibility = await fetchPublicVendorEligibility(businessId);
          }
        }
        setVendorEligibility(eligibility);

        setReviewSummary({
          totalReviews: Number(p.totalReviews) || 0,
          averageRating: Number(p.averageRating) || 0,
          ratingBreakdown: emptyRatingBreakdown,
        });
        await fetchReviews(p._id);

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
        setProduct(null);
        setLoadState("error");
        toast.error('Failed to load product details');
      }
    };
    loadProduct();
  }, [fetchReviews, id]);

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

  useEffect(() => {
    refreshCartQty();
  }, [refreshCartQty]);

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

  const calculatePrice = () => {
    if (!selectedVariant) return { current: 0, original: 0, discount: 0, onSale: false };
    const base =
      toNumber(selectedVariant.priceInclTax ?? selectedVariant.price ?? product?.priceInclTax ?? product?.price) || 0;
    const sale =
      selectedVariant.salePriceInclTax != null || selectedVariant.salePrice != null
        ? toNumber(
            selectedVariant.salePriceInclTax ??
              selectedVariant.salePrice ??
              product?.salePriceInclTax ??
              product?.salePrice
          )
        : null;
    const onSale =
      sale != null &&
      (!selectedVariant.discountEndDate || new Date(selectedVariant.discountEndDate).getTime() > Date.now());
    const resolved = resolveDisplayPrice(base, sale, onSale);
    return {
      current: resolved.current,
      original: resolved.original,
      discount: resolved.onSale && resolved.original > 0
        ? Math.round(((resolved.original - resolved.current) / resolved.original) * 100)
        : 0,
      onSale: resolved.onSale
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
  const purchaseBlocked = Boolean(vendorEligibility && !vendorEligibility.eligible);
  const totalReviews = reviewSummary.totalReviews || Number(product?.totalReviews) || 0;
  const averageRating = reviewSummary.averageRating || Number(product?.averageRating) || 0;
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  const handleSearch = () => {
    router.push(buildSearchPageUrl(filters));
  };

  const productImages = [
  ...(selectedVariant?.images || []),
  ...(product?.galleryImages || [])
];

  const formatMoney = (value: unknown): string => toNumber(value).toFixed(2);
  const formatReviewDate = (value: string): string =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value));

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

    if (vendorEligibility && !vendorEligibility.eligible) {
      toast.error(vendorEligibility.message);
      return;
    }

    setIsBlocking(true);
    try {
      const sizeValue = selectedVariant.attributes?.size || selectedVariant.attributes?.Size || 'default';
      const basePrice = toNumber(selectedVariant.price);
      const variantSalePrice =
        selectedVariant.salePrice == null ? null : toNumber(selectedVariant.salePrice);
      const basePriceInclTax = toNumber(
        selectedVariant.priceInclTax ?? product.priceInclTax ?? basePrice
      );
      const basePriceExclTax = toNumber(
        selectedVariant.priceExclTax ?? product.priceExclTax ?? basePrice
      );
      const variantSalePriceInclTax =
        selectedVariant.salePriceInclTax == null && product.salePriceInclTax == null
          ? variantSalePrice
          : toNumber(selectedVariant.salePriceInclTax ?? product.salePriceInclTax);
      const variantSalePriceExclTax =
        selectedVariant.salePriceExclTax == null && product.salePriceExclTax == null
          ? variantSalePrice
          : toNumber(selectedVariant.salePriceExclTax ?? product.salePriceExclTax);
      const discountEndDate = selectedVariant.discountEndDate ?? null;
      const saleActive =
        variantSalePrice != null &&
        (!discountEndDate || new Date(discountEndDate).getTime() > Date.now());
      const resolvedUnitPriceInclTax = resolveDisplayPrice(
        basePriceInclTax,
        variantSalePriceInclTax ?? variantSalePrice,
        saleActive
      );
      const resolvedUnitPriceExclTax = resolveDisplayPrice(
        basePriceExclTax,
        variantSalePriceExclTax ?? variantSalePrice,
        saleActive
      );
      const res = await addToCart(
        product._id,
        selectedVariant.variantId,
        sizeValue,
        1,
        getBusinessId(),
          {
            price: basePrice,
            salePrice: variantSalePrice,
            taxCategory: selectedVariant.taxCategory ?? product.taxCategory ?? null,
            taxRate: toNumber(selectedVariant.taxRate ?? product.taxRate),
            taxIncluded: selectedVariant.taxIncluded ?? product.taxIncluded ?? true,
            priceExclTax: basePriceExclTax,
            priceInclTax: basePriceInclTax,
            salePriceExclTax: variantSalePriceExclTax,
            salePriceInclTax: variantSalePriceInclTax,
            discountEndDate,
            selectedSizePrice: resolvedUnitPriceInclTax.current,
            selectedSizePriceExclTax: resolvedUnitPriceExclTax.current,
            selectedSizePriceInclTax: resolvedUnitPriceInclTax.current,
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
  }, [isBlocking, product, resolvedShipping, selectedShipping, selectedVariant, vendorEligibility]);

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

  const handleBuyNowClick = useCallback(() => {
    if (!selectedVariant?.variantId) {
      toast.error("Variant information is missing");
      return;
    }
    const sizeValue = selectedVariant.attributes?.size || selectedVariant.attributes?.Size || "default";
    const queryParams = new URLSearchParams({
      type: "buy",
      productId: product!._id,
      variantId: selectedVariant.variantId,
      size: sizeValue,
      quantity: "1",
      shippingMethod: selectedShipping,
    });
    router.push(`/checkout/buy-now?${queryParams.toString()}`);
  }, [product, router, selectedShipping, selectedVariant]);

  const productBadge = product ? pickBadgeValue(product as unknown as Record<string, unknown>) : null;

  const openReviewForm = () => {
    setReviewFormOpen((prev) => !prev);
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!product?._id) return;

    if (!reviewForm.comment.trim()) {
      toast.error('Please enter your review comment.');
      return;
    }

    setReviewsSubmitting(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product/${product._id}/reviews`,
        {
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      toast.success('Review submitted successfully.');
      setReviewForm({ rating: 5, comment: '' });
      setReviewFormOpen(false);
      await fetchReviews(product._id);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.info('Please log in as a customer to submit a review.');
        // localStorage.setItem("product_id", id ?? "")
        // router.push('/login?type=customer');
        const redirectPath =
          typeof window !== "undefined"
            ? `${window.location.pathname}${window.location.search}`
            : `/product/${id}`;
        router.push(`/login?type=customer&redirect=${encodeURIComponent(redirectPath)}`);
        return;
      }
      toast.error(err?.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewsSubmitting(false);
    }
  };

  if (loadState === "loading") {
    return (
      <div className="bg-market-bg">
        <MarketLoadingBlock label="Loading product details…" minHeight="min-h-[60vh]" />
      </div>
    );
  }

  if (loadState === "error" || !product) {
    return (
      <div className="min-h-[60vh] bg-market-bg px-4 py-16">
        <MarketEmptyState
          title="Product unavailable"
          description="This product may have been removed or is temporarily unavailable."
          ctaLabel="Browse all products"
          ctaHref="/products"
          onRetry={() => router.refresh()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-market-bg">
      <PublicPageHero
        title={product.title || "Product"}
        variant="compact"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          { label: product.title || "Product" },
        ]}
        imageUrl="/bgdetailpage.png"
      />

      <CommerceMobileSearchBar filters={filters} onChange={setFilters} onSubmit={handleSearch} />

      {vendorEligibility ? (
        <div className="container-page pt-4">
          <MarketplaceEligibilityBanner eligibility={vendorEligibility} />
        </div>
      ) : null}

      {/* Blocking overlay */}
      {(isBlocking || loadingQty) && (
        <div className="fixed inset-0 z-[1000] bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow">
            <span className="w-5 h-5 border-2 border-[#c79b44] rounded-full border-t-transparent animate-spin" />
            <span className="text-sm font-medium text-brand-navy">Loading…</span>
          </div>
        </div>
      )}

      {showVendorSwitchDialog && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-brand-navy">You&apos;re adding a product from a different vendor.</h2>
            <p className="mt-4 text-sm leading-6 text-brand-muted">
              Your current cart contains items from another vendor and will be cleared if you continue.
            </p>
            <p className="mt-2 text-sm font-medium text-brand-navy">Do you want to proceed?</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setShowVendorSwitchDialog(false)}
                className="min-w-[140px] rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-gray-50"
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
      <div className="container-page market-content-safe-bottom py-8">
        <Link
          href="/products"
          className="mb-6 inline-flex min-h-11 items-center font-montserrat text-sm font-medium text-market-teal transition-colors hover:text-brand-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-market-gold"
        >
          ← Back to products
        </Link>
        <div className="market-card-light flex flex-col gap-8 p-4 sm:p-6 lg:flex-row lg:gap-10">

          {/* LEFT: Images */}
          <div className="lg:w-[45%]">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-dashboard-border-light bg-white">
              {mainImage || productImages[0] || product.coverImage ? (
                <img
                  src={mainImage || productImages[0] || product.coverImage}
                  alt={product.title}
                  className="absolute inset-0 h-full w-full object-contain p-4"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center font-montserrat text-sm text-brand-muted">
                  Image coming soon
                </div>
              )}
              <button
                type="button"
                className="absolute right-3 top-3 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/95 shadow hover:bg-white"
                onClick={async () => {
                  try {
                    await toggleWishlist(product._id);
                    setLiked(prev => !prev);
                  } catch {
                    toast.error('Failed to update wishlist');
                  }
                }}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`h-4 w-4 ${liked ? 'text-red-500 fill-red-500' : 'text-brand-muted'}`} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnails */}
{productImages.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-2">
    {productImages.map((img: string, i: number) => (
      <button
        type="button"
        key={i}
        onClick={() => setMainImage(img)}
        className={`h-20 w-20 overflow-hidden rounded-lg border-2 bg-white transition-all ${
          mainImage === img
            ? "border-brand-gold ring-2 ring-brand-gold/30"
            : "border-dashboard-border-light hover:border-brand-gold/50"
        }`}
      >
        <img
          src={img}
          alt={`${product.title} view ${i + 1}`}
          className="h-full w-full object-contain p-1"
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
            {/* Trust badge + seller */}
            <div className="flex flex-wrap items-center gap-3">
              <TrustBadge tier={productBadge} size="sm" linkToExplainer />
              <p className="text-xs text-[#c79b44]">
                <span className="text-brand-muted">Seller: </span>
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
            </div>

            {/* Product Title */}
            <h1 className="font-poppins text-2xl font-semibold leading-snug text-brand-navy sm:text-3xl">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {renderStarIcons(averageRating, 'w-3.5 h-3.5')}
              </div>
              <span className="text-xs text-brand-muted underline cursor-pointer">
                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'} Ratings & {totalReviews} Reviews
              </span>
            </div>

            {/* Price (hide when 0) */}
  {/* Price (hide when 0) */}
{price.current > 0 && (
  <div className="flex items-baseline gap-3 pb-3 border-b border-gray-200">
    {/* Current price (sale price) */}
    <span
      className="commerce-price-primary"
      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
    >
      ${price.current.toFixed(2)}
    </span>

    {/* Slashed/original price */}
    {price.onSale && price.original > price.current && (
      <>
        <span className="commerce-price-compare">
          ${price.original.toFixed(2)}
        </span>
        {price.discount > 0 && (
          <span className="text-sm font-semibold text-green-600">
            {price.discount}% OFF
          </span>
        )}
      </>
    )}

    {(selectedVariant?.taxIncluded ?? product.taxIncluded) && (
      <span className="rounded border border-green-200 bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
        Tax incl.
      </span>
    )}
  </div>
)}

            {(selectedVariant?.taxIncluded ?? product.taxIncluded) && (
              <p className="text-xs text-brand-muted -mt-1">
                Price shown includes tax. Detailed tax breakdown appears in cart
              </p>
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
                        <p className="text-sm font-semibold text-brand-navy">
                          {formatAttributeName(attributeKey)}
                          {currentValue && !colorAttr && (
                            <span className="font-normal text-brand-muted ml-2">{currentValue}</span>
                          )}
                        </p>
                        {/* <ChevronDown className="w-4 h-4 text-brand-muted" /> */}
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
                                className={`w-7 h-7 rounded-full border-2 transition-all ${isSelected ? 'border-brand-navy ring-2 ring-offset-1 ring-brand-gold' : 'border-gray-300'} ${!isAvailable ? 'opacity-60 cursor-not-allowed ring-1 ring-gray-200' : 'cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold'}`}
                                style={{ backgroundColor: value }}
                              />
                            );
                          }

                          return (
                            <button
                              key={value}
                              onClick={() => isAvailable && setSelectedAttributes(prev => ({ ...prev, [attributeKey]: value }))}
                              disabled={!isAvailable}
                              className={`min-w-[38px] px-3 py-1.5 border rounded text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${isSelected
                                ? 'commerce-option-selected'
                                : !isAvailable
                                ? 'commerce-option-disabled'
                                : 'commerce-option'
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
{/* <div className="pt-2">
  <p className="text-sm font-semibold text-brand-navy">Choose Your Shipping</p>
  <p className="text-xs text-brand-muted">Select one shipping option</p>

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
          <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-brand-muted'} capitalize`}>
            {type}
          </p>
          <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-brand-navy'}`}>
            ${formatMoney(resolvedShipping[type])}
          </p>
        </button>
      );
    })}
  </div>
</div> */}

            {selectedVariant ? (
              <p className="text-sm font-medium text-brand-navy">
                {(() => {
                  const hint = getStockHint(selectedVariant.stock, selectedVariant.allowBackorder);
                  if (hint === "Out of stock") {
                    return <span className="text-dashboard-warn-text">Currently out of stock</span>;
                  }
                  if (hint) {
                    return <span className="text-brand-gold">{hint} — order soon</span>;
                  }
                  return <span className="text-brand-muted">In stock — ready to ship from verified vendor</span>;
                })()}
              </p>
            ) : null}

            <div className="shopper-buy-box space-y-4">
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {cartQty > 0 ? (
                <div className="commerce-qty-control flex-1 flex-wrap">
                  <button
                    type="button"
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
                    className="commerce-qty-btn"
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className="min-w-[2rem] text-center text-base font-semibold text-brand-navy">{cartQty}</span>
                  <button
                    type="button"
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
                    className="commerce-qty-btn"
                    aria-label="Increase quantity"
                  >+</button>
                  <Link href="/cart" className="ml-auto text-sm font-semibold text-brand-navy-light underline">
                    View cart
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  className="commerce-action-primary"
                  disabled={isBlocking || loadingQty || purchaseBlocked || !isVariantSelected() || Boolean(selectedVariant && selectedVariant.stock <= 0 && !selectedVariant.allowBackorder)}
                  onClick={handleAddToCartClick}
                >
                  {!isVariantSelected() ? 'Select options' : selectedVariant && selectedVariant.stock <= 0 && !selectedVariant.allowBackorder ? 'Out of stock' : 'Add to cart'}
                </button>
              )}

              <button
                type="button"
                className="commerce-action-secondary"
                disabled={purchaseBlocked || !isVariantSelected() || Boolean(selectedVariant && selectedVariant.stock <= 0 && !selectedVariant.allowBackorder)}
                onClick={handleBuyNowClick}
              >
                Buy now
              </button>
            </div>

            <ShopperTrustCallout>{SHOPPER_PRODUCT_TRUST_NOTE}</ShopperTrustCallout>
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
          className="w-44 shrink-0 text-brand-navy"
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
          className="market-card-light-body"
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
          className="w-44 shrink-0 text-brand-navy"
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
          className="market-card-light-body"
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
                  className="market-card-light-body market-prose-light"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px' }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Additional Information — RIGHT COLUMN */}
            {(product.weight || product.netQuantity || product.genericName) && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h3
                  className="text-sm text-brand-navy uppercase tracking-wider mb-3"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                >
                  Additional Information
                </h3>
                <div className="space-y-0">
                  {product.weight && (
                    <div className="flex py-1.5 border-b border-gray-100">
                      <span className="w-44 text-xs text-brand-muted shrink-0" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>Item Weight</span>
                      <span className="text-xs text-brand-navy" style={{ fontWeight: 600 }}>{product.weight}</span>
                    </div>
                  )}
                  {product.netQuantity && (
                    <div className="flex py-1.5 border-b border-gray-100">
                      <span className="w-44 text-xs text-brand-muted shrink-0" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>Net Quantity</span>
                      <span className="text-xs text-brand-navy" style={{ fontWeight: 600 }}>{product.netQuantity}</span>
                    </div>
                  )}
                  {product.genericName && (
                    <div className="flex py-1.5 border-b border-gray-100">
                      <span className="w-44 text-xs text-brand-muted shrink-0" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>Generic Name</span>
                      <span className="text-xs text-brand-navy" style={{ fontWeight: 600 }}>{product.genericName}</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={openReviewForm}
                  className="mt-4 px-5 py-2 bg-[#c79b44] text-white text-xs font-semibold rounded hover:bg-[#b08a3a] transition-colors uppercase tracking-wide"
                >
                  Add Review
                </button>
              </div>
            )}

            {/* Ratings & Reviews — RIGHT COLUMN */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3
                className="text-sm text-brand-navy uppercase tracking-wider mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
              >
                Ratings & Reviews
              </h3>
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-brand-navy">
                  {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                </div>
                <div className="flex items-center justify-center gap-0.5 mt-1 md:justify-start">
                  {renderStarIcons(averageRating)}
                </div>
                <p className="mt-1 text-xs text-brand-muted">{totalReviews} Ratings & {totalReviews} Reviews</p>
              </div>
              <button
                type="button"
                onClick={openReviewForm}
                className="mt-4 inline-flex items-center gap-2 px-7 py-2.5 font-semibold text-white bg-[#1e3a5f] rounded hover:bg-[#152a45] transition-colors uppercase tracking-wide text-xs"
              >
                <PenTool className="w-4 h-4" />
                {reviewFormOpen ? 'Close Review Form' : 'Rate Product'}
              </button>

              {reviewFormOpen && (
                <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4 rounded-xl border border-gray-200 bg-[#faf8f3] p-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-brand-navy">Your Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                          className="transition-transform hover:scale-105"
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <svg
                            className={`h-8 w-8 ${
                              star <= reviewForm.rating ? 'text-yellow-400' : 'text-brand-muted'
                            } fill-current`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-brand-muted">Selected: {reviewForm.rating} / 5</p>
                  </div>

                  <div>
                    <label htmlFor="review-comment" className="mb-2 block text-sm font-semibold text-brand-navy">
                      Your Review
                    </label>
                    <textarea
                      id="review-comment"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience with this product"
                      className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-brand-navy outline-none transition-colors focus:border-[#c79b44]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewsSubmitting}
                    className="rounded-md bg-[#c79b44] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b08a3a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reviewsSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              <div className="mt-6 space-y-4">
                {reviewsLoading ? (
                  <div className="rounded-lg border border-dashed border-gray-200 px-4 py-6 text-sm text-brand-muted">
                    Loading reviews...
                  </div>
                ) : visibleReviews.length > 0 ? (
                  <>
                    {visibleReviews.map((review) => (
                      <div key={review._id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-brand-navy">{review.userId?.name || 'Anonymous'}</p>
                            <p className="mt-1 text-xs text-brand-muted">{formatReviewDate(review.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {renderStarIcons(review.rating, 'w-3.5 h-3.5')}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-brand-navy">{review.comment}</p>
                      </div>
                    ))}

                    {reviews.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setShowAllReviews((prev) => !prev)}
                        className="text-sm font-semibold text-[#1e3a5f] underline underline-offset-2"
                      >
                        {showAllReviews ? 'Show Less Reviews' : 'Show More Reviews'}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-200 px-4 py-6 text-sm text-brand-muted">
                    No reviews yet. Be the first to rate this product.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Similar Products — full width below both columns */}
        <div className="mt-14">
          <SimilarProduct productId={product._id} />
        </div>
      </div>

      <MobileStickyActionBar
        leading={
          price.current > 0 ? (
            <span className="font-poppins text-base font-semibold text-market-gold sm:text-lg">
              ${price.current.toFixed(2)}
            </span>
          ) : undefined
        }
        primaryLabel={
          !isVariantSelected()
            ? "Select options"
            : selectedVariant && selectedVariant.stock <= 0 && !selectedVariant.allowBackorder
              ? "Out of stock"
              : "Add to cart"
        }
        onPrimaryClick={handleAddToCartClick}
        primaryDisabled={
          isBlocking ||
          loadingQty ||
          purchaseBlocked ||
          !isVariantSelected() ||
          Boolean(selectedVariant && selectedVariant.stock <= 0 && !selectedVariant.allowBackorder)
        }
        secondaryLabel="Buy now"
        onSecondaryClick={handleBuyNowClick}
        secondaryDisabled={
          purchaseBlocked ||
          !isVariantSelected() ||
          Boolean(selectedVariant && selectedVariant.stock <= 0 && !selectedVariant.allowBackorder)
        }
      />
    </div>
  );
}
