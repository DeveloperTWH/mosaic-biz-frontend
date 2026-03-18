"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ClientTestimonials from "../../../Components/ClientTestimonials";

type CategoryRef = {
  _id?: string;
  name?: string;
};

type BusinessHour = {
  _id?: string;
  day?: string;
  hours?: string;
  closed?: boolean;
};

type TableType = {
  type?: string;
  count?: number;
};

type FoodLocation = {
  type?: string;
  coordinates?: [number, number];
  address?: string;
};

type Food = {
  _id?: string;
  coverImage?: string;
  images?: string[];
  menuImage?: string;
  categoryId?: CategoryRef;
  subcategoryId?: CategoryRef;
  businessName?: string;
  location?: FoodLocation;
  businessHours?: BusinessHour[];
  bookingToolLink?: string;
  foodType?: string;
  brand?: string;
  tableTypes?: TableType[];
  bookingTimeSlots?: string[];
  totalReviews?: number;
  averageRating?: number;
  badge?: string;
  createdAt?: string;
};

type Business = {
  _id?: string;
  businessName?: string;
  slug?: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  email?: string;
  phone?: string;
  address?: string;
  badge?: string;
};

type FoodProfileResponse = {
  success: boolean;
  data?: {
    food?: Food;
    business?: Business;
  };
};

function cleanText(value?: string): string {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim() : "";
}

function getBadgeImage(badge?: string): string | null {
  if (!badge) return null;
  const key = badge.trim().toLowerCase().replace(/[\s_-]+/g, "");
  const badgeMap: Record<string, string> = {
    silver: "/badge/silver.png",
    gold: "/badge/gold.png",
    platinum: "/badge/platinum.png",
    diamond: "/badge/diamond.png",
  };
  return badgeMap[key] ?? null;
}

function getMapEmbedUrl(address?: string, coordinates?: [number, number]): string | undefined {
  if (Array.isArray(coordinates) && coordinates.length === 2) {
    const [lng, lat] = coordinates;
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  if (address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }

  return undefined;
}

function normalizeData(payload: FoodProfileResponse) {
  const food = payload?.data?.food;
  const business = payload?.data?.business;

  const galleryItems = [food?.coverImage, ...(food?.images ?? []), food?.menuImage]
    .filter((item): item is string => Boolean(item))
    .filter((item, index, list) => list.indexOf(item) === index);

  return {
    title: food?.businessName || business?.businessName || food?.brand || "Food Vendor",
    category: food?.categoryId?.name || "",
    subcategory: food?.subcategoryId?.name || "",
    foodType: food?.foodType || "",
    brand: food?.brand || "",
    coverImage: food?.coverImage || business?.coverImage || "",
    galleryImages: galleryItems,
    businessHours: food?.businessHours || [],
    bookingToolLink: food?.bookingToolLink || "",
    tableTypes: food?.tableTypes || [],
    bookingTimeSlots: food?.bookingTimeSlots || [],
    averageRating: Number(food?.averageRating) || 0,
    totalReviews: Number(food?.totalReviews) || 0,
    createdAt: food?.createdAt || "",
    locationAddress: food?.location?.address || business?.address || "",
    coordinates: food?.location?.coordinates,
    businessName: business?.businessName || food?.businessName || "",
    businessDescription: cleanText(business?.description),
    businessLogo: business?.logo || "",
    businessEmail: business?.email || "",
    businessPhone: business?.phone || "",
    businessAddress: business?.address || food?.location?.address || "",
    businessBadge: business?.badge || food?.badge || "",
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i <= Math.round(rating) ? "text-[#c79b44]" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default function FoodVendorProfilePage() {
  const params = useParams();
  const foodId = typeof params.foodId === "string" ? params.foodId : params.foodId?.[0];

  const [data, setData] = useState<ReturnType<typeof normalizeData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minority, setMinority] = useState("");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [bookForm, setBookForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    tableType: "",
    timeSlot: "",
    message: "",
  });

  useEffect(() => {
    if (!foodId) {
      setError("Invalid food id.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
        const res = await fetch(`${base}/api/public/foods/${foodId}`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load food vendor profile.");

        const json = (await res.json()) as FoodProfileResponse;
        if (!json.success || !json.data?.food) throw new Error("Food vendor profile unavailable.");

        setData(normalizeData(json));
      } catch (e: any) {
        setError(e?.message || "Error loading food vendor profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [foodId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#c79b44] border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="font-medium text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const reveal = (key: string) => setRevealed((prev) => ({ ...prev, [key]: true }));
  const badgeImage = getBadgeImage(data.businessBadge);
  const heroTitle = data.businessName || data.title || "Food Vendor";
  const heroSection = data.category || "Food And Grocery";
  const galleryItems = data.galleryImages.slice(0, 6);
  const estYear = data.createdAt ? new Date(data.createdAt).getFullYear() : null;
  const mapUrl = getMapEmbedUrl(data.locationAddress, data.coordinates);

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="relative h-[180px] w-full overflow-hidden bg-gray-800">
        <img
          src="/products/19099 1.png"
          alt="vendor header"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 px-4 text-center">
          <h1 className="text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">
            {heroTitle}
          </h1>
          <nav className="mt-2 text-sm text-gray-300">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">//</span>
            <Link href="/foods" className="hover:text-white">
              {heroSection}
            </Link>
            <span className="mx-2">//</span>
            <span className="text-[#c79b44]">{heroTitle}</span>
          </nav>
        </div>
      </div>

      <div className="w-full bg-[#1A1F71] py-6 pb-10 text-white">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <div className="min-w-0 flex-[3]">
              <label className="block text-left text-[14px] font-medium text-white font-poppins">
                Filter By Business Type
              </label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="Type Here"
                className="h-10 w-full bg-white px-4 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-orange"
              />
            </div>

            <div className="min-w-0 flex-1">
              <label className="block text-left text-[14px] font-medium text-white font-poppins">
                Filter By Location
              </label>
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Choose Location"
                className="h-10 w-full bg-white px-4 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-orange"
              />
            </div>

            <div className="min-w-0 flex-1">
              <label className="block text-left text-[14px] font-medium text-white font-poppins">
                Filter By Minority
              </label>
              <input
                type="text"
                value={minority}
                onChange={(e) => setMinority(e.target.value)}
                placeholder="Choose Minority"
                className="h-10 w-full bg-white px-4 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-orange"
              />
            </div>

            <div className="min-w-0 flex-1">
              <button className="flex h-10 w-full items-center justify-center bg-[#C7A040] text-sm font-semibold text-white transition-colors hover:bg-[#a88432]">
                Search Here
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="relative h-[280px] w-full overflow-visible border border-[#e8e1cf] bg-gray-100 md:h-[340px]">
              {data.coverImage ? (
                <img src={data.coverImage} alt={heroTitle} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-gray-300">
                  {heroTitle.charAt(0) || "F"}
                </div>
              )}
              {badgeImage && (
                <div className="absolute right-8 -bottom-10 z-20">
                  <div className="relative h-24 w-24 drop-shadow-[0_10px_12px_rgba(0,0,0,0.22)]">
                    <div
                      className="absolute inset-0 border border-gray-200 bg-white"
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
                    <div className="absolute inset-0 flex items-center justify-center p-3">
                      <img
                        src={badgeImage ?? undefined}
                        alt={`${data.businessBadge || "Business"} badge`}
                        className="h-full w-full object-contain scale-110"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-7 border-b border-[#ece6d9] pb-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-[32px] font-semibold leading-none text-[#1b1b1b]">{heroTitle}</h2>
                {[data.category, data.foodType].filter(Boolean).slice(0, 2).map((item) => (
                  <span
                    key={item}
                    className="border border-[#d7cfbb] bg-[#f7f3e7] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#8a7b52]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={data.averageRating} />
                {data.totalReviews > 0 && (
                  <span className="text-[11px] text-[#8c8c8c]">
                    {data.averageRating.toFixed(1)} Ratings And {data.totalReviews} Reviews
                  </span>
                )}
              </div>
              {data.businessDescription && (
                <p className="mt-3 max-w-[760px] text-[11px] leading-5 text-[#7b7b7b]">
                  {data.businessDescription}
                </p>
              )}
              <button className="mt-4 flex h-8 items-center gap-2 border border-[#c79b44] px-3 text-[11px] font-semibold uppercase tracking-wide text-[#c79b44] transition-colors hover:bg-[#c79b44] hover:text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Review
              </button>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-[#c79b44]">Photo Gallery</h3>
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                {Array.from({ length: Math.max(galleryItems.length, 6) }).map((_, i) => {
                  const image = galleryItems[i];
                  return (
                    <div key={i} className="h-[78px] overflow-hidden bg-[#dfdfdf]">
                      {image ? (
                        <img
                          src={image}
                          alt={`Gallery ${i + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold text-[#c79b44]">Testimonials</h3>
              <ClientTestimonials />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5">
              <div className="flex items-center gap-2 pb-3">
                <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded border bg-gray-50">
                  {data.businessLogo ? (
                    <img
                      src={data.businessLogo}
                      alt={data.businessName}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-[#1e3a5f]">
                      {data.businessName?.charAt(0) || "F"}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-[12px]">
                {[
                  { label: "Brand Name", value: data.businessName, key: null },
                  { label: "Category", value: data.category || "N/A", key: null },
                  { label: "Food Type", value: data.foodType || "N/A", key: null },
                  { label: "Brand", value: data.brand || "N/A", key: null },
                  { label: "Established In", value: estYear?.toString() || "N/A", key: null },
                  { label: "Call Us", value: data.businessPhone, key: "call" },
                  { label: "Email Us", value: data.businessEmail, key: "email" },
                  { label: "Address", value: data.businessAddress || data.locationAddress, key: "address" },
                ].map((row) => (
                  <div key={row.label} className="grid grid-cols-[96px_1fr] gap-2 items-start">
                    <span className="font-montserrat font-bold text-gray-900">{row.label}</span>
                    {row.key === null ? (
                      <span className="font-montserrat font-medium text-gray-700">{row.value || "N/A"}</span>
                    ) : row.value ? (
                      revealed[row.key] ? (
                        row.key === "address" ? (
                          <a
                            href={mapUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="font-montserrat font-medium text-gray-700 underline break-all"
                          >
                            View on Maps
                          </a>
                        ) : (
                          <span className="font-montserrat font-medium text-gray-700 break-all">{row.value}</span>
                        )
                      ) : (
                        <button
                          onClick={() => reveal(row.key)}
                          className="text-left text-[#1A1F71] underline hover:text-[#0d1150]"
                        >
                          Click to reveal
                        </button>
                      )
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden border border-[#e2c46a] bg-[#fff8e8]">
              <div className="border-b border-[#e6d3a3] px-5 py-4">
                <h3 className="text-[14px] font-bold uppercase tracking-wide text-[#1A1F71]">
                  Book A Table
                </h3>
              </div>

              <div className="space-y-3 p-5">
                <div className="space-y-1">
                  <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">
                    Name
                  </label>
                  <input
                    value={bookForm.name}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter Name"
                    className="h-8 w-full border border-[#d8d0ba] bg-[#fff8e8] px-2.5 text-[11px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">
                    Email
                  </label>
                  <input
                    value={bookForm.email}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter Email"
                    className="h-8 w-full border border-[#d8d0ba] bg-[#fff8e8] px-2.5 text-[11px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">
                    Phone Number
                  </label>
                  <input
                    value={bookForm.phone}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter Phone Number"
                    className="h-8 w-full border border-[#d8d0ba] bg-[#fff8e8] px-2.5 text-[11px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">
                      Reservation Date
                    </label>
                    <input
                      value={bookForm.date}
                      onChange={(e) => setBookForm((prev) => ({ ...prev, date: e.target.value }))}
                      placeholder="MM/DD/YYYY"
                      className="h-8 w-full border border-[#d8d0ba] bg-[#fff8e8] px-2.5 text-[11px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">
                      Select Time
                    </label>
                    <select
                      value={bookForm.timeSlot}
                      onChange={(e) => setBookForm((prev) => ({ ...prev, timeSlot: e.target.value }))}
                      className="h-8 w-full border border-[#d8d0ba] bg-[#fff8e8] px-2.5 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                    >
                      <option value="">09 - 6AM</option>
                      {data.bookingTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">
                    Number Of People
                  </label>
                  <select
                    value={bookForm.tableType}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, tableType: e.target.value }))}
                    className="h-8 w-full border border-[#d8d0ba] bg-[#fff8e8] px-2.5 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                  >
                    <option value="">Select Seat Count</option>
                    {data.tableTypes.map((table) => (
                      <option key={`${table.type}-${table.count}`} value={table.type || ""}>
                        {table.type} ({table.count ?? 0} Available)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">
                    Message
                  </label>
                  <textarea
                    value={bookForm.message}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Add Message"
                    rows={3}
                    className="w-full resize-none border border-[#d8d0ba] bg-[#fff8e8] px-2.5 py-2 text-[11px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                  />
                </div>

                <button
                  className="h-9 w-full bg-[#C7A040] text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#a88432]"
                  onClick={() => {
                    if (data.bookingToolLink) {
                      window.open(data.bookingToolLink, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  Book Table
                </button>
              </div>
            </div>

            <div className="overflow-hidden bg-white">
              <h3 className="mb-2 text-sm font-semibold text-[#c79b44]">Location And Hours</h3>

              <div className="h-40 w-full overflow-hidden border border-[#ece6d8] bg-gray-200">
                {mapUrl ? (
                  <iframe
                    src={mapUrl}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                    Map unavailable
                  </div>
                )}
              </div>

              <div className="space-y-1.5 px-1 py-4">
                {data.businessHours.map((hour, index) => (
                  <div
                    key={`${hour.day}-${index}`}
                    className={`grid grid-cols-[90px_1fr] text-[10px] ${
                      hour.day === new Date().toLocaleDateString("en-US", { weekday: "long" })
                        ? "font-bold text-[#1d1d1d]"
                        : "text-[#6d6d6d]"
                    }`}
                  >
                    <span className="uppercase tracking-[0.14em]">{hour.day}</span>
                    <span className={hour.closed ? "text-red-500" : ""}>
                      {hour.closed ? "Closed" : (hour.hours || "").toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
