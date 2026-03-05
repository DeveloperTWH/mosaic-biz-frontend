"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type VendorBusiness = {
  _id: string;
  businessName: string;
  description?: string;
  logo?: string;
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
  image: string;
  price: number;
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
      image: item?.coverImage || "/ShopProduct/Aria-SK6-Helmet 1.png",
      price: toNumber(item?.price),
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
  const key = badge.trim().toLowerCase();
  const badgeMap: Record<string, string> = {
    silver: "/badge/Silver.png",
    gold: "/badge/Gold.png",
    platinum: "/badge/Platinum.png",
    diamond: "/badge/Diamond.png",
  };
  return badgeMap[key] ?? null;
}

export default function ProductVendorProfilePage() {
  const params = useParams();
  const businessId =
    typeof params.businessId === "string" ? params.businessId : params.businessId?.[0];

  const [profile, setProfile] = useState<VendorBusiness | null>(null);
  const [vendorDetails, setVendorDetails] = useState<VendorDetails | null>(null);
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [minority, setMinority] = useState("");
  const [sort, setSort] = useState("price_asc");
  const [apiTotal, setApiTotal] = useState(0);

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
      } catch (err: any) {
        setError(err?.message || "Failed to load vendor profile.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [businessId, sort]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchBusinessType = !businessType || (profile?.listingType ?? "").toLowerCase().includes(businessType.toLowerCase());
      const matchLocation = !location || formatAddress(vendorDetails ?? undefined).toLowerCase().includes(location.toLowerCase());
      const matchMinority =
        !minority ||
        (vendorDetails?.minorityCategories ?? []).some((cat) =>
          cat.toLowerCase().includes(minority.toLowerCase())
        );
      return matchBusinessType && matchLocation && matchMinority;
    });
  }, [products, businessType, location, minority, profile?.listingType, vendorDetails]);

  const totalProducts = filteredProducts.length;
  const safeTotalProducts = apiTotal > 0 ? apiTotal : totalProducts;
  const safeAverageRating = toNumber(profile?.metrics?.averageRating);
  const safeReviewCount = toNumber(profile?.metrics?.reviewCount);
  const badgeImage = getBadgeImage(profile?.badge);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative w-full h-[180px] bg-gray-800 overflow-hidden">
        <img
          src="/products/19099 1.png"
          alt="vendor header"
          className="absolute inset-0 object-cover w-full h-full opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-white uppercase">
            {profile?.businessName || "Vendor Profile"}
          </h1>
          <nav className="mt-2 text-sm text-gray-300">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">//</span>
            <Link href="/products" className="hover:text-white">
              Product
            </Link>
            <span className="mx-2">//</span>
            <span className="text-[#c79b44]">Vendor Profile</span>
          </nav>
        </div>
      </div>

      <div className="w-full bg-[#1A1F71] py-6 text-center text-white pb-10">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="flex-[3] min-w-0">
              <label className="block text-left text-[14px] font-medium text-white font-poppins">
                Filter By Business Type
              </label>
              <input
                type="text"
                placeholder="Type Here"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full h-10 px-4 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-custom-orange text-xs font-poppins"
              />
            </div>

            <div className="flex-[2] min-w-0">
              <label className="block text-left text-[14px] font-medium text-white font-poppins">
                Filter By Location
              </label>
              <input
                type="text"
                placeholder="Choose Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 px-4 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-custom-orange text-xs font-poppins"
              />
            </div>

            <div className="flex-[2] min-w-0">
              <label className="block text-left text-[14px] font-medium text-white font-poppins">
                Filter By Minority
              </label>
              <input
                type="text"
                placeholder="Choose Minority"
                value={minority}
                onChange={(e) => setMinority(e.target.value)}
                className="w-full h-10 px-4 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-custom-orange text-xs font-poppins"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#c79b44] rounded-full border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-gray-600">Loading vendor profile...</p>
          </div>
        </div>
      ) : error ? (
        <div className="max-w-6xl px-4 py-10 mx-auto">
          <div className="p-4 text-red-700 bg-red-50 border border-red-200 rounded">{error}</div>
        </div>
      ) : (
        <div className="max-w-6xl px-4 py-8 mx-auto lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <div className="relative min-h-[320px] rounded border border-gray-200 bg-gradient-to-br from-[#d6ece1] via-[#f0e5d4] to-[#dce5ef] overflow-hidden">
              {profile?.logo ? (
                <img
                  src={profile.logo}
                  alt={profile.businessName}
                  className="absolute inset-0 w-full h-full object-contain p-8"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-[#1e3a5f]">
                  {profile?.businessName?.charAt(0)?.toUpperCase() || "V"}
                </div>
              )}
              {badgeImage && (
                <div className="absolute right-3 bottom-3 bg-white/95 rounded-lg border border-gray-200 shadow-sm p-2">
                  <img
                    src={badgeImage}
                    alt={`${profile?.badge || "Business"} badge`}
                    className="w-14 h-14 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="border border-gray-200 p-5 bg-white">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-md border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                  {profile?.logo ? (
                    <img
                      src={profile.logo}
                      alt={profile.businessName}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#1e3a5f]">
                      {profile?.businessName?.charAt(0)?.toUpperCase() || "V"}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1A1F71]">
                    Business Details
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">{profile?.businessName || "Vendor"}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-gray-900">Brand Name: </span>
                  <span className="text-gray-700">{profile?.businessName || "N/A"}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Category: </span>
                  <span className="text-gray-700">{profile?.listingType || "N/A"}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Established In: </span>
                  <span className="text-gray-700">{vendorDetails?.yearsInBusiness || "N/A"}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Location: </span>
                  <span className="text-gray-700">{formatAddress(vendorDetails ?? undefined)}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Call Us: </span>
                  <span className="text-gray-700">{profile?.phone || "N/A"}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Email: </span>
                  <span className="text-gray-700">{profile?.email || "N/A"}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Website: </span>
                  <span className="text-gray-700">{vendorDetails?.website || "N/A"}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Badge: </span>
                  <span className="text-gray-700">{profile?.badge || "N/A"}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-3xl font-semibold text-gray-900">
              {profile?.businessName || "Vendor"}
            </h2>
            <p className="mt-4 text-sm text-gray-700 leading-6">
              {vendorDetails?.businessBio || "No business description available."}
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-600">
              (Showing {totalProducts > 0 ? 1 : 0} - {totalProducts} Products Of {safeTotalProducts} Products)
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-1 text-sm border rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="latest">Latest</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="py-10 text-center text-gray-600">No products found for this vendor.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
              {filteredProducts.map((item) => {
                const effectivePrice =
                  item.salePrice != null && item.salePrice > 0 && item.salePrice < item.price
                    ? item.salePrice
                    : item.price;

                return (
                  <Link
                    key={item._id}
                    href={`/product/${item._id}`}
                    className="p-2 border-2 border-[#D9D9D9] w-full shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight leading-snug font-poppins line-clamp-2 h-[42px]">
                        {item.title}
                      </h3>

                      <p className="mb-2 text-xs text-gray-600 leading-5 font-montserrat h-[40px] overflow-hidden">
                        {item.description || "\u00a0"}
                      </p>

                      <p className="text-[11px] text-gray-500 mb-2">
                        {item.reviewCount} Ratings & Reviews
                      </p>

                      <div className="mt-auto">
                        {item.salePrice != null && item.salePrice < item.price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-red-600">
                              ${effectivePrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ${effectivePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
