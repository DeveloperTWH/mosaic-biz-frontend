"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import ClientTestimonials from "../../../Components/ClientTestimonials";
import CommerceMobileSearchBar from "../../../Components/CommerceMobileSearchBar";
import { buildSearchPageUrl, PublicSearchFilters } from "../../../Components/publicSearch";
import MarketEmptyState from "../../../Components/MarketEmptyState";
import MarketErrorState from "../../../Components/MarketErrorState";
import MarketImage from "../../../Components/MarketImage";
import MarketLoadingBlock from "../../../Components/MarketLoadingBlock";
import MarketPrice from "../../../Components/MarketPrice";
import { toFiniteNumber } from "@/lib/marketplace/display";

type VendorBusiness = {
  _id: string;
  businessName: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  email?: string;
  phone?: string;
  listingType?: string;
  badge?: string;
  metrics?: {
    totalViews?: number;
    totalSales?: number;
    totalRevenue?: number;
    averageRating?: number;
    reviewCount?: number;
  };
};

type VendorDetails = {
  minorityCategories?: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  yearsInBusiness?: string;
  website?: string;
  businessBio?: string;
  googleReviewLink?: string;
  communityServiceLink?: string;
  refundPolicyDocument?: {
    url?: string;
    verified?: boolean;
  };
  termsDocument?: {
    url?: string;
    verified?: boolean;
  };
};

type VendorProfileResponse = {
  success: boolean;
  data?: {
    business?: VendorBusiness;
    vendorDetails?: VendorDetails;
  };
};

type VendorProduct = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  price: number | null;
  salePrice: number | null;
  rating: number;
  reviewCount: number;
};

type PublicBusinessProductItem = {
  _id: string;
  title: string;
  description?: string;
  price?: { $numberDecimal?: string } | string | number;
  coverImage?: string;
  slug?: string;
};

type PublicBusinessProductsResponse = {
  success: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
  data?: PublicBusinessProductItem[];
};

type RevealFieldKey = "call" | "email" | "address" | "website";

function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object" && "$numberDecimal" in value) {
    const parsed = Number((value as { $numberDecimal?: string }).$numberDecimal);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function normalizePublicBusinessProducts(payload: PublicBusinessProductsResponse): VendorProduct[] {
  const items = Array.isArray(payload?.data) ? payload.data : [];
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    return {
      _id: String(item?._id ?? ""),
      title: String(item?.title ?? "Untitled Product"),
      description: typeof item?.description === "string" ? item.description.replace(/<[^>]*>/g, "") : "",
      image: item?.coverImage,
      price: toFiniteNumber(item?.price),
      salePrice: null,
      rating: 0,
      reviewCount: 0,
    };
  });
}

function formatAddress(details?: VendorDetails): string {
  const address = details?.address;
  if (!address) return "Not available";
  return [address.street, address.city, address.state, address.country, address.zipCode]
    .filter(Boolean)
    .join(", ");
}

function getBadgeImage(badge?: string): string | null {
  if (!badge) return null;
  const key = badge.trim().toLowerCase().replace(/[\s_-]+/g, "");
  const badgeMap: Record<string, string> = {
    bronze: "/badge.png",
    silver: "/badge/Silver.png",
    gold: "/badge/Gold.png",
    platinum: "/badge/Platinum.png",
    diamond: "/badge/Diamond.png",
  };
  return badgeMap[key] ?? null;
}

function getSafeExternalUrl(url?: string): string {
  if (!url) return "";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
}

function buildRevealState(): Record<RevealFieldKey, boolean> {
  return {
    call: true,
    email: true,
    address: true,
    website: true,
  };
}

function RevealConsentModal({
  variant,
  open,
  loading,
  error,
  onClose,
  onConfirm,
}: {
  variant: "signin" | "consent";
  open: boolean;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  const isSignIn = variant === "signin";

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-xl border border-[#e3dcc7] bg-white shadow-2xl">
        <div className="border-b border-[#ece6d9] px-6 py-5">
          <h3 className="text-lg font-poppins font-semibold text-brand-navy-light">
            {isSignIn ? "Sign in to view contact details." : "Confirm contact permission"}
          </h3>
        </div>
        <div className="space-y-4 px-6 py-5">
          <p className="text-sm font-montserrat leading-6 text-brand-muted">
            {isSignIn
              ? "This helps us keep things transparent and ensures vendors can follow up on your enquiry. By continuing, you agree to be contacted by the vendor."
              : "To view these details, please confirm that the vendor can contact you regarding your enquiry."}
          </p>
          {error ? (
            <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-11 w-full border border-border-warm px-5 text-sm font-semibold uppercase tracking-wide text-brand-muted transition-colors hover:bg-surface-panel disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[140px] sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="h-11 w-full bg-[#C7A040] px-5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#a88432] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[180px] sm:w-auto"
            >
              {loading ? "Please wait..." : isSignIn ? "Sign In & Continue" : "I Agree"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductVendorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const businessId =
    typeof params.businessId === "string" ? params.businessId : params.businessId?.[0];

  const [profile, setProfile] = useState<VendorBusiness | null>(null);
  const [vendorDetails, setVendorDetails] = useState<VendorDetails | null>(null);
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [filters, setFilters] = useState<PublicSearchFilters>({
    keyword: "",
    location: "",
    minorityType: "",
  });
  const [sort, setSort] = useState("price_asc");
  const [apiTotal, setApiTotal] = useState(0);
  const [badgeSrc, setBadgeSrc] = useState<string | null>(null);
  const [revealedFields, setRevealedFields] = useState<
    Record<RevealFieldKey, boolean>
  >({
    call: false,
    email: false,
    address: false,
    website: false,
  });
  const [revealModal, setRevealModal] = useState<"signin" | "consent" | null>(null);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealError, setRevealError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setError("Invalid business id.");
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
        const profileUrl = `${apiBase}/api/public/product/vendor-profile/${businessId}`;

        const profileRes = await fetch(profileUrl, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!profileRes.ok) {
          throw new Error("Failed to load vendor profile.");
        }

        const profileJson = (await profileRes.json()) as VendorProfileResponse;
        if (!profileJson.success || !profileJson.data?.business) {
          throw new Error("Vendor profile is not available.");
        }

        setProfile(profileJson.data.business);
        setVendorDetails(profileJson.data.vendorDetails ?? null);

        const productsUrl = `${apiBase}/api/public/products/business/${businessId}?page=1&limit=10&sort=${encodeURIComponent(sort)}`;
        const productsRes = await fetch(productsUrl, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!productsRes.ok) {
          throw new Error("Failed to load vendor products.");
        }

        const productsJson = (await productsRes.json()) as PublicBusinessProductsResponse;
        setProducts(normalizePublicBusinessProducts(productsJson));
        setApiTotal(toNumber(productsJson.total));
      } catch (err) {
        console.error("Product vendor profile load error:", err);
        setError("We could not load this vendor profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [businessId, sort, reloadKey]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchBusinessType = !filters.keyword || (profile?.listingType ?? "").toLowerCase().includes(filters.keyword.toLowerCase());
      const matchLocation = !filters.location || formatAddress(vendorDetails ?? undefined).toLowerCase().includes(filters.location.toLowerCase());
      const matchMinority =
        !filters.minorityType ||
        (vendorDetails?.minorityCategories ?? []).some((cat) =>
          cat.toLowerCase().includes(filters.minorityType.toLowerCase())
        );
      return matchBusinessType && matchLocation && matchMinority;
    });
  }, [products, filters, profile?.listingType, vendorDetails]);

  const totalProducts = filteredProducts.length;
  const safeTotalProducts = apiTotal > 0 ? apiTotal : totalProducts;
  const safeAverageRating = toNumber(profile?.metrics?.averageRating);
  const safeReviewCount = toNumber(profile?.metrics?.reviewCount);
  const badgeImage = getBadgeImage(profile?.badge);
  const businessAddress = formatAddress(vendorDetails ?? undefined);
  const websiteValue = (vendorDetails?.website || "").trim();
  const googleReviewLink = (vendorDetails?.googleReviewLink || "").trim();
  const communityServiceLink = (vendorDetails?.communityServiceLink || "").trim();
  const refundPolicyDocumentUrl = (vendorDetails?.refundPolicyDocument?.url || "").trim();
  const termsDocumentUrl = (vendorDetails?.termsDocument?.url || "").trim();
  const bannerImage = profile?.coverImage || profile?.logo || "";

  useEffect(() => {
    setBadgeSrc(badgeImage);
  }, [badgeImage]);

  const openRevealFlow = (field: RevealFieldKey) => {
    if (revealedFields[field]) return;

    const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("user_session") === "true";
    setRevealError(null);
    setRevealModal(isLoggedIn ? "consent" : "signin");
  };

  const closeRevealModal = () => {
    if (revealLoading) return;
    setRevealModal(null);
    setRevealError(null);
  };

  const handleRevealConfirm = async () => {
    if (revealModal === "signin") {
      const redirectPath =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : `/vendor-profile/product-vendor/${businessId}`;
      router.push(`/login?type=customer&redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    if (!businessId) {
      setRevealError("Business details are unavailable right now. Please try again.");
      return;
    }

    try {
      setRevealLoading(true);
      setRevealError(null);

      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
      const response = await fetch(`${base}/api/enquiries/reveal`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ businessId }),
      });

      if (response.status === 401) {
        setRevealModal("signin");
        setRevealError("Please sign in to continue.");
        return;
      }

      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.message || payload?.error || "Unable to reveal contact details right now.");
      }

      setRevealedFields(buildRevealState());
      setRevealModal(null);
    } catch (err) {
      console.error("Product vendor contact reveal error:", err);
      setRevealError("Unable to reveal contact details right now.");
    } finally {
      setRevealLoading(false);
    }
  };

  return (
    <div className="market-surface-light min-h-screen">
      <div className="vendor-profile-hero-band">
        <img
          src="/products/19099 1.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 px-4 text-center">
          <h1 className="vendor-profile-hero-title">
            {profile?.businessName || "Vendor Profile"}
          </h1>
          <nav className="mt-2 font-montserrat text-sm text-white/90" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-white">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="vendor-profile-breadcrumb-accent">Vendor profile</span>
          </nav>
        </div>
      </div>

      <CommerceMobileSearchBar
        filters={filters}
        onChange={setFilters}
        onSubmit={() => router.push(buildSearchPageUrl(filters))}
      />

      {loading ? (
        <MarketLoadingBlock label="Loading vendor profile…" minHeight="min-h-[40vh]" />
      ) : error ? (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-10">
          <MarketErrorState
            title="Vendor profile unavailable"
            description="We could not load this vendor profile. Please try again."
            ctaLabel="Browse vendors"
            ctaHref="/vendors"
            onRetry={() => setReloadKey((key) => key + 1)}
          />
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
          <Link
            href="/vendors"
            className="mb-6 inline-flex min-h-11 items-center font-montserrat text-sm font-medium text-brand-teal transition-colors hover:text-brand-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            ← Back to vendors
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <div className="vendor-profile-cover-panel">
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                {bannerImage ? (
                  <img
                    src={bannerImage}
                    alt={profile?.businessName || "Vendor cover"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center font-poppins text-4xl font-bold text-brand-navy-light">
                    {profile?.businessName?.charAt(0)?.toUpperCase() || "V"}
                  </div>
                )}
              </div>
              {badgeSrc && (
                <div className="absolute right-8 -bottom-10 z-20">
                  <div className="relative w-24 h-24 drop-shadow-[0_10px_12px_rgba(0,0,0,0.22)]">
                    <div
                      className="absolute inset-0 bg-white border border-gray-200"
                      style={{
                        clipPath: "polygon(25% 6%, 75% 6%, 98% 50%, 75% 94%, 25% 94%, 2% 50%)",
                      }}
                    />
                    <div
                      className="absolute inset-[10px] bg-[#f8f9fb]"
                      style={{
                        clipPath: "polygon(25% 6%, 75% 6%, 98% 50%, 75% 94%, 25% 94%, 2% 50%)",
                      }}
                    />
                    <div
                      className="absolute inset-[10px] overflow-hidden"
                      style={{
                        clipPath: "polygon(25% 6%, 75% 6%, 98% 50%, 75% 94%, 25% 94%, 2% 50%)",
                      }}
                    >
                      <img
                        src={badgeSrc ?? undefined}
                        alt={`${profile?.badge || "Business"} badge`}
                        className="h-full w-full object-contain p-2"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (img.src.endsWith("/badge.png")) {
                            setBadgeSrc(null);
                            return;
                          }
                          setBadgeSrc("/badge.png");
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="vendor-profile-detail-card">
              <div className="flex items-center gap-2 pb-3">
                <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-warm bg-surface-panel">
                  {profile?.logo ? (
<img
  src={profile.logo}
  alt={profile.businessName}
  className="h-full w-full object-contain p-1"
/>
                  ) : (
                    <span className="font-poppins text-sm font-bold text-brand-navy-light">
                      {profile?.businessName?.charAt(0)?.toUpperCase() || "V"}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <span className="vendor-profile-detail-label">Brand name</span>
                  <span className="vendor-profile-detail-value">
  {profile?.businessName || "N/A"}
</span>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <span className="vendor-profile-detail-label">Category</span>
                  <span className="vendor-profile-detail-value">{profile?.listingType || "N/A"}</span>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <span className="vendor-profile-detail-label">Established</span>
                  <span className="vendor-profile-detail-value">{vendorDetails?.yearsInBusiness || "N/A"}</span>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <span className="vendor-profile-detail-label">Location</span>
                  <span className="vendor-profile-detail-value">
                    {vendorDetails?.address?.city || vendorDetails?.address?.state || "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <span className="vendor-profile-detail-label">Call us</span>
                  {profile?.phone ? (
                    revealedFields.call ? (
                      <span className="vendor-profile-detail-value">{profile.phone}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openRevealFlow("call")}
                        className="vendor-profile-reveal-link"
                      >
                        Click to reveal
                      </button>
                    )
                  ) : (
                    <span className="text-brand-muted">N/A</span>
                  )}
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <span className="vendor-profile-detail-label">Email us</span>
                  {profile?.email ? (
                    revealedFields.email ? (
                      <span className="vendor-profile-detail-value break-all">{profile.email}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openRevealFlow("email")}
                        className="vendor-profile-reveal-link"
                      >
                        Click to reveal
                      </button>
                    )
                  ) : (
                    <span className="vendor-profile-detail-value">N/A</span>
                  )}
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <span className="vendor-profile-detail-label">Address</span>
                  {businessAddress !== "Not available" ? (
                    revealedFields.address ? (
                      <span className="vendor-profile-detail-value">{businessAddress}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openRevealFlow("address")}
                        className="vendor-profile-reveal-link"
                      >
                        Click to reveal
                      </button>
                    )
                  ) : (
                    <span className="text-brand-muted">N/A</span>
                  )}
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-2">
                  <span className="vendor-profile-detail-label">Website</span>
                  {websiteValue ? (
                    revealedFields.website ? (
                      <a
                        href={getSafeExternalUrl(websiteValue)}
                        target="_blank"
                        rel="noreferrer"
                        className="vendor-profile-detail-value text-brand-navy-light underline hover:text-brand-teal-dark"
                      >
                        {websiteValue}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openRevealFlow("website")}
                        className="vendor-profile-reveal-link"
                      >
                        Click to reveal
                      </button>
                    )
                  ) : (
                    <span className="text-brand-muted">N/A</span>
                  )}
                </div>
                {googleReviewLink ? (
                  <div className="grid grid-cols-[96px_1fr] gap-2">
                    <span className="vendor-profile-detail-label">Reviews</span>
                    <a
                      href={getSafeExternalUrl(googleReviewLink)}
                      target="_blank"
                      rel="noreferrer"
                      className="vendor-profile-detail-value text-brand-navy-light underline break-all"
                    >
                      Google review
                    </a>
                  </div>
                ) : null}
                {communityServiceLink ? (
                  <div className="grid grid-cols-[96px_1fr] gap-2">
                    <span className="vendor-profile-detail-label">Community</span>
                    <a
                      href={getSafeExternalUrl(communityServiceLink)}
                      target="_blank"
                      rel="noreferrer"
                      className="vendor-profile-detail-value text-brand-navy-light underline break-all"
                    >
                      Community service
                    </a>
                  </div>
                ) : null}
                {refundPolicyDocumentUrl ? (
                  <div className="grid grid-cols-[96px_1fr] items-center gap-2">
                    <span className="vendor-profile-detail-label">Refund policy</span>
                    <a
                      href={refundPolicyDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashboard-input-border px-2.5 py-1.5 text-brand-navy-light hover:bg-surface-panel"
                      aria-label="View refund policy"
                      title="View refund policy"
                    >
                      <Eye size={16} />
                    </a>
                  </div>
                ) : null}
                {termsDocumentUrl ? (
                  <div className="grid grid-cols-[96px_1fr] items-center gap-2">
                    <span className="vendor-profile-detail-label">Terms doc</span>
                    <a
                      href={termsDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashboard-input-border px-2.5 py-1.5 text-brand-navy-light hover:bg-surface-panel"
                      aria-label="View terms document"
                      title="View terms document"
                    >
                      <Eye size={16} />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-8">
          <h2 className="vendor-profile-section-title">
  {profile?.businessName || "Vendor"}
</h2>

<p className="mt-2 font-montserrat text-sm leading-relaxed text-brand-muted">
  {vendorDetails?.businessBio || "No business description available."}
</p>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-montserrat text-sm text-brand-muted">
              Showing {totalProducts > 0 ? 1 : 0}–{totalProducts} of {safeTotalProducts} products
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="vendor-product-sort" className="font-montserrat text-sm text-brand-navy">
                Sort by
              </label>
              <select
                id="vendor-product-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="market-select min-h-11 cursor-pointer rounded-lg border border-dashboard-input-border bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="latest">Latest</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <MarketEmptyState
              title="No products listed yet"
              description="This vendor has not published products matching your filters."
              ctaLabel="Browse products"
              ctaHref="/products"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
              {filteredProducts.map((item) => {
                const onSale =
                  item.price != null &&
                  item.salePrice != null &&
                  item.salePrice > 0 &&
                  item.salePrice < item.price;

                return (
                  <Link
                    key={item._id}
                    href={`/product/${item._id}`}
                    className="vendor-profile-product-card"
                  >
                    <div className="vendor-profile-product-card-media">
                      <MarketImage
                        src={item.image}
                        alt={item.title}
                        aspect="square"
                        objectFit="contain"
                        fallbackLabel="Image coming soon"
                        className="h-full w-full transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-3">
                      <h3 className="market-card-light-title line-clamp-2 text-sm uppercase leading-snug">
                        {item.title}
                      </h3>

                      <p className="market-card-light-body mb-2 line-clamp-2 text-xs">
                        {item.description || "\u00a0"}
                      </p>

                      <p className="mb-2 text-xs text-brand-muted">
                        {item.reviewCount} ratings & reviews
                      </p>

                      <MarketPrice
                        value={onSale ? item.salePrice : item.price}
                        compareAt={onSale ? item.price : null}
                        onSale={onSale}
                        label="Starting from"
                        priceClassName={onSale ? "text-base font-semibold text-brand-orange" : "text-base font-semibold text-brand-navy"}
                        compareClassName="text-xs text-brand-muted line-through"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          <ClientTestimonials />
        </div>
      )}

      <RevealConsentModal
        variant={revealModal ?? "consent"}
        open={revealModal !== null}
        loading={revealLoading}
        error={revealError}
        onClose={closeRevealModal}
        onConfirm={handleRevealConfirm}
      />
    </div>
  );
}
