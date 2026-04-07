"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import ClientTestimonials from "../../../Components/ClientTestimonials";
import PublicSearchFilterBar from "../../../Components/PublicSearchFilterBar";
import { buildSearchPageUrl, PublicSearchFilters } from "../../../Components/publicSearch";

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
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  website?: string;
  socialLinks?: {
    website?: string;
  };
  googleReviewLink?: string | null;
  communityServiceLink?: string | null;
  refundPolicyDocument?: {
    url?: string;
    verified?: boolean;
  };
  termsDocument?: {
    url?: string;
    verified?: boolean;
  };
  badge?: string;
};

type FoodProfileResponse = {
  success: boolean;
  data?: {
    food?: Food;
    business?: Business;
  };
};

type RevealFieldKey = "call" | "email" | "address" | "website";

function cleanText(value?: string): string {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim() : "";
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const SEAT_OPTIONS = [
  "No of Seats - Up to 2",
  "No of Seats - Up to 4",
  "No of Seats - Up to 8",
  "Large Group (More than 10)",
] as const;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatCalendarDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function parseTimeToMinutes(raw: string) {
  const value = raw.trim().toUpperCase();
  const match = value.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] || "0");
  const meridiem = match[3];

  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || minutes > 59) {
    return null;
  }

  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (hours === 12) hours = 0;
    if (meridiem === "PM") hours += 12;
  } else if (hours > 23) {
    return null;
  }

  return hours * 60 + minutes;
}

function parseBusinessHourRange(hours: string) {
  const [openRaw = "", closeRaw = ""] = hours.split("-").map(part => part.trim());
  const openMinutes = parseTimeToMinutes(openRaw);
  const closeMinutes = parseTimeToMinutes(closeRaw);

  if (openMinutes === null || closeMinutes === null || closeMinutes <= openMinutes) {
    return null;
  }

  return { openMinutes, closeMinutes };
}

function formatTimeLabel(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${normalizedHours}:${`${minutes}`.padStart(2, "0")} ${suffix}`;
}

function generateHourlyTimeSlots(hours: string) {
  const parsed = parseBusinessHourRange(hours);
  if (!parsed) return [];

  const { openMinutes, closeMinutes } = parsed;
  const slots: string[] = [];

  for (let current = openMinutes; current + 60 <= closeMinutes; current += 60) {
    slots.push(formatTimeLabel(current));
  }

  return slots;
}

function buildCalendarDays(month: Date) {
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = firstDayOfMonth.getDay();
  const gridStart = addDays(firstDayOfMonth, -startOffset);

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
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

function getSafeExternalUrl(url?: string): string {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
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

function formatBusinessAddress(address?: Business["address"]): string {
  if (!address) return "";

  return [
    address.street,
    address.city,
    address.state,
    address.country,
    address.zipCode,
  ]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean)
    .join(", ");
}

function normalizeData(payload: FoodProfileResponse) {
  const food = payload?.data?.food;
  const business = payload?.data?.business;
  const businessAddress = formatBusinessAddress(business?.address);
  const businessWebsite = business?.website || business?.socialLinks?.website || "";

  const galleryItems = [food?.coverImage, ...(food?.images ?? [])]
    .filter((item): item is string => Boolean(item))
    .filter((item, index, list) => list.indexOf(item) === index);

  return {
    title: food?.businessName || business?.businessName || food?.brand || "Food Vendor",
    category: food?.categoryId?.name || "",
    subcategory: food?.subcategoryId?.name || "",
    foodType: food?.foodType || "",
    brand: food?.brand || "",
    coverImage: food?.coverImage || business?.coverImage || "",
    menuImage: food?.menuImage || "",
    galleryImages: galleryItems,
    businessHours: food?.businessHours || [],
    bookingToolLink: food?.bookingToolLink || "",
    tableTypes: food?.tableTypes || [],
    bookingTimeSlots: food?.bookingTimeSlots || [],
    averageRating: Number(food?.averageRating) || 0,
    totalReviews: Number(food?.totalReviews) || 0,
    createdAt: food?.createdAt || "",
    locationAddress: food?.location?.address || businessAddress || "",
    coordinates: food?.location?.coordinates,
    businessId: business?._id || "",
    businessName: business?.businessName || food?.businessName || "",
    businessDescription: cleanText(business?.description),
    businessLogo: business?.logo || "",
    businessEmail: business?.email || "",
    businessPhone: business?.phone || "",
    businessAddress: businessAddress || food?.location?.address || "",
    businessWebsite,
    googleReviewLink: business?.googleReviewLink || "",
    communityServiceLink: business?.communityServiceLink || "",
    refundPolicyDocumentUrl: business?.refundPolicyDocument?.url || "",
    termsDocumentUrl: business?.termsDocument?.url || "",
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
          <h3 className="text-lg font-poppins font-semibold text-[#1A1F71]">
            {isSignIn ? "Sign in to view contact details." : "Confirm contact permission"}
          </h3>
        </div>
        <div className="space-y-4 px-6 py-5">
          <p className="text-sm font-montserrat leading-6 text-[#4b5563]">
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
              className="h-11 min-w-[140px] border border-[#d6cfba] px-5 text-sm font-semibold uppercase tracking-wide text-[#4b5563] transition-colors hover:bg-[#f7f4ea] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="h-11 min-w-[180px] bg-[#C7A040] px-5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#a88432] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Please wait..." : isSignIn ? "Sign In & Continue" : "I Agree"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FoodVendorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const foodId = typeof params.foodId === "string" ? params.foodId : params.foodId?.[0];

  const [data, setData] = useState<ReturnType<typeof normalizeData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PublicSearchFilters>({
    keyword: "",
    location: "",
    minorityType: "",
  });
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [revealModal, setRevealModal] = useState<"signin" | "consent" | null>(null);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealError, setRevealError] = useState<string | null>(null);
  const [badgeSrc, setBadgeSrc] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    tableType: "",
    timeSlot: "",
    message: "",
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

 const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const badgeImage = getBadgeImage(data?.businessBadge);

  useEffect(() => {
    setBadgeSrc(badgeImage);
  }, [badgeImage]);

  const normalizedBusinessHours = useMemo(
    () => (data?.businessHours || []).map(hour => ({
      ...hour,
      closed: Boolean(hour.closed),
    })),
    [data?.businessHours]
  );

  const workingDays = useMemo(
    () => new Set(normalizedBusinessHours.filter(hour => !hour.closed).map(hour => hour.day || "")),
    [normalizedBusinessHours]
  );

  const selectedDateObject = useMemo(() => {
    if (!bookForm.date) return null;
    const [year, month, day] = bookForm.date.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  }, [bookForm.date]);

  const selectedBusinessHour = useMemo(() => {
    if (!selectedDateObject) return null;
    const dayName = DAY_NAMES[selectedDateObject.getDay()];
    return normalizedBusinessHours.find(hour => hour.day === dayName && !hour.closed) || null;
  }, [normalizedBusinessHours, selectedDateObject]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedBusinessHour?.hours) {
      return data?.bookingTimeSlots || [];
    }
    const slots = generateHourlyTimeSlots(selectedBusinessHour.hours);
    return slots.length > 0 ? slots : data?.bookingTimeSlots || [];
  }, [data?.bookingTimeSlots, selectedBusinessHour]);

  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);

  useEffect(() => {
    if (!bookForm.timeSlot) return;
    if (!availableTimeSlots.includes(bookForm.timeSlot)) {
      setBookForm(prev => ({ ...prev, timeSlot: "" }));
    }
  }, [availableTimeSlots, bookForm.timeSlot]);

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

  const heroTitle = data.businessName || data.title || "Food Vendor";
  const heroSection = data.category || "Food And Grocery";
  const galleryItems = data.galleryImages.slice(0, 6);
  const hasMenuImage = Boolean(data.menuImage);
  const estYear = data.createdAt ? new Date(data.createdAt).getFullYear() : null;
  const mapUrl = getMapEmbedUrl(data.locationAddress, data.coordinates);
  const hasDirectBookingLink = /^https?:\/\//i.test(data.bookingToolLink);
  const today = startOfDay(new Date());
  const isDateAvailable = (date: Date) => {
    const normalizedDate = startOfDay(date);
    if (normalizedDate < today) return false;
    return workingDays.has(DAY_NAMES[normalizedDate.getDay()]);
  };
  const bookingReady =
    Boolean(bookForm.name.trim()) &&
    Boolean(bookForm.email.trim()) &&
    Boolean(bookForm.phone.trim()) &&
    Boolean(bookForm.date) &&
    Boolean(bookForm.timeSlot) &&
    Boolean(bookForm.tableType);

  const openRevealFlow = (key: RevealFieldKey) => {
    if (revealed[key]) return;

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
          : `/vendor-profile/food-vendor/${foodId}`;
      router.push(`/login?type=customer&redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    if (!data.businessId) {
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
        body: JSON.stringify({ businessId: data.businessId }),
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

      setRevealed(buildRevealState());
      setRevealModal(null);
    } catch (err: any) {
      setRevealError(err?.message || "Unable to reveal contact details right now.");
    } finally {
      setRevealLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="relative h-[180px] w-full overflow-hidden bg-gray-800">
        <img
          src="/products/19099 1.png"
          alt="vendor header"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 px-4 text-center">
          <h1 className="text-3xl font-poppins font-semibold uppercase tracking-wide text-white md:text-4xl">
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

      <PublicSearchFilterBar
        filters={filters}
        onChange={setFilters}
        onSubmit={() => router.push(buildSearchPageUrl(filters))}
      />

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
              {badgeSrc && (
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
                    <div
                      className="absolute inset-[10px] overflow-hidden"
                      style={{
                        clipPath: "polygon(25% 6%, 75% 6%, 98% 50%, 75% 94%, 25% 94%, 2% 50%)",
                      }}
                    >
                      <img
                        src={badgeSrc ?? undefined}
                        alt={`${data.businessBadge || "Business"} badge`}
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

            <div className="mt-7 border-b border-[#ece6d9] pb-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-[32px] font-poppins font-semibold leading-none text-[#1b1b1b]">{heroTitle}</h2>
                {[data.category, data.foodType].filter(Boolean).slice(0, 2).map((item) => (
                  <span
                    key={item}
                    className="border border-[#d7cfbb] bg-[#f7f3e7] px-2 py-0.5 text-[10px] font-montserrat uppercase tracking-[0.14em] text-[#8a7b52]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={data.averageRating} />
                {data.totalReviews > 0 && (
                    <span className="text-[11px] font-montserrat font-medium text-[#8c8c8c]">
                      {data.averageRating.toFixed(1)} Ratings And {data.totalReviews} Reviews
                    </span>
                  )}
              </div>
              {data.businessDescription && (
                <p className="mt-3 max-w-[760px] text-[11px] font-montserrat font-medium leading-5 text-[#7b7b7b]">
                  {data.businessDescription}
                </p>
              )}
              <button className="mt-4 flex h-8 items-center gap-2 border border-[#c79b44] px-3 text-[11px] font-poppins font-semibold uppercase tracking-wide text-[#c79b44] transition-colors hover:bg-[#c79b44] hover:text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Review
              </button>
            </div>

            {galleryItems.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-montserrat font-semibold text-[#c79b44]">Photo Gallery</h3>
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
      {galleryItems.map((img, i) => (
  <div
    key={`${img}-${i}`}
    className="h-[78px] overflow-hidden bg-[#dfdfdf] cursor-pointer"
    onClick={() => setSelectedImage(img)} // ✅ ADD THIS
  >
    <img
      src={img}
      alt={`Gallery ${i + 1}`}
      className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
    />
  </div>
))}

                {/* {galleryItems.map((image, i) => (
                  <div key={`${image}-${i}`} className="h-[78px] overflow-hidden bg-[#dfdfdf]">
                    <img
                      src={image}
                      alt={`Gallery ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                ))} */}
              </div>
            </div>
            )}

            {hasMenuImage && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-montserrat font-semibold text-[#c79b44]">Menu</h3>
                  <a
                    href={data.menuImage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-montserrat font-semibold uppercase tracking-[0.14em] text-[#1A1F71] underline"
                  >
                    View Full Menu
                  </a>
                </div>
                <div className="mx-auto max-w-[720px] overflow-hidden border border-[#ece6d9] bg-[#fffdf7]">
                  <img
                    src={data.menuImage}
                    alt={`${heroTitle} menu`}
                    className="max-h-[420px] w-full object-contain bg-white"
                  />
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="mb-4 text-sm font-montserrat font-semibold text-[#c79b44]">Testimonials</h3>
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
                  // { label: "Food Type", value: data.foodType || "N/A", key: null },
                  // { label: "Brand", value: data.brand || "N/A", key: null },
                  { label: "Established In", value: estYear?.toString() || "N/A", key: null },
                  { label: "Call Us", value: data.businessPhone, key: "call" },
                  { label: "Email Us", value: data.businessEmail, key: "email" },
                  { label: "Address", value: data.businessAddress || data.locationAddress, key: "address" },
                  { label: "Website", value: data.businessWebsite, key: "website" },
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
                        ) : row.key === "website" ? (
                          <a
                            href={getSafeExternalUrl(row.value)}
                            target="_blank"
                            rel="noreferrer"
                            className="font-montserrat font-medium text-gray-700 underline break-all"
                          >
                            {row.value.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <span className="font-montserrat font-medium text-gray-700 break-all">{row.value}</span>
                        )
                      ) : (
                        <button
                          onClick={() => openRevealFlow(row.key as RevealFieldKey)}
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
                {data.googleReviewLink ? (
                  <div className="grid grid-cols-[96px_1fr] gap-2 items-start">
                    <span className="font-montserrat font-bold text-gray-900">Reviews</span>
                    <a
                      href={getSafeExternalUrl(data.googleReviewLink)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-montserrat font-medium text-[#1A1F71] underline break-all"
                    >
                      Google Review
                    </a>
                  </div>
                ) : null}
                {data.communityServiceLink ? (
                  <div className="grid grid-cols-[96px_1fr] gap-2 items-start">
                    <span className="font-montserrat font-bold text-gray-900">Community</span>
                    <a
                      href={getSafeExternalUrl(data.communityServiceLink)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-montserrat font-medium text-[#1A1F71] underline break-all"
                    >
                      Community Service
                    </a>
                  </div>
                ) : null}
                {data.refundPolicyDocumentUrl ? (
                  <div className="grid grid-cols-[96px_1fr] gap-2 items-center">
                    <span className="font-montserrat font-bold text-gray-900">Refund</span>
                    <a
                      href={data.refundPolicyDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded border border-gray-200 px-2.5 py-1.5 text-[#1A1F71] hover:bg-gray-50"
                      aria-label="View refund policy document"
                      title="View refund policy document"
                    >
                      <Eye size={16} />
                      <span className="font-montserrat font-medium">Policy Doc</span>
                    </a>
                  </div>
                ) : null}
                {data.termsDocumentUrl ? (
                  <div className="grid grid-cols-[96px_1fr] gap-2 items-center">
                    <span className="font-montserrat font-bold text-gray-900">Terms</span>
                    <a
                      href={data.termsDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded border border-gray-200 px-2.5 py-1.5 text-[#1A1F71] hover:bg-gray-50"
                      aria-label="View terms document"
                      title="View terms document"
                    >
                      <Eye size={16} />
                      <span className="font-montserrat font-medium">Terms Doc</span>
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="overflow-hidden border border-[#e2c46a] bg-[#fff8e8] mt-6">
              <div className="border-b border-[#e6d3a3] px-5 py-4">
                <h3 className="text-[14px] font-poppins font-bold uppercase tracking-wide text-[#1A1F71]">
                  {hasDirectBookingLink ? "Book Now" : "Book A Table"}
                </h3>
              </div>

              {hasDirectBookingLink ? (
                <div className="p-5">
                  <button
                    className="h-10 w-full bg-[#C7A040] text-[11px] font-poppins font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#a88432]"
                    onClick={() => {
                      window.open(data.bookingToolLink, "_blank", "noopener,noreferrer");
                    }}
                  >
                    Book Now
                  </button>
                </div>
              ) : (
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-montserrat font-medium uppercase tracking-wide text-[#6f6f6f]">
                      Name
                    </label>
                    <input
                      value={bookForm.name}
                      onChange={(e) => setBookForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter Name"
                      className="h-9 w-full border border-[#d8d0ba] bg-[#fff8e8] px-3 text-[11px] font-montserrat font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-montserrat font-medium uppercase tracking-wide text-[#6f6f6f]">
                      Phone Number
                    </label>
                    <input
                      value={bookForm.phone}
                      onChange={(e) => setBookForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter Phone Number"
                      className="h-9 w-full border border-[#d8d0ba] bg-[#fff8e8] px-3 text-[11px] font-montserrat font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-montserrat font-medium uppercase tracking-wide text-[#6f6f6f]">
                    Email
                  </label>
                  <input
                    value={bookForm.email}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter Email"
                    className="h-9 w-full border border-[#d8d0ba] bg-[#fff8e8] px-3 text-[11px] font-montserrat font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6f6f6f]">
                      Pick A Reservation Date
                    </p>
                    <span className="text-[10px] font-medium text-[#8a7b52]">
                      Closed days are blocked
                    </span>
                  </div>

                  <div className="border border-[#eadcb7] bg-[#fffdf4] p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                        className="h-8 w-8 border border-[#d7c796] text-[#7b5e19] transition-colors hover:bg-[#f8edd0]"
                      >
                        ‹
                      </button>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1F71]">
                        {formatMonthLabel(calendarMonth)}
                      </p>
                      <button
                        type="button"
                        onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                        className="h-8 w-8 border border-[#d7c796] text-[#7b5e19] transition-colors hover:bg-[#f8edd0]"
                      >
                        ›
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                      {DAY_NAMES.map((day) => (
                        <span key={day} className="pb-1 text-[10px] font-semibold uppercase tracking-wide text-[#8a7b52]">
                          {day.slice(0, 3)}
                        </span>
                      ))}
                      {calendarDays.map((day) => {
                        const isCurrentMonth = day.getMonth() === calendarMonth.getMonth();
                        const dateKey = formatDateKey(day);
                        const isSelected = bookForm.date === dateKey;
                        const available = isDateAvailable(day);

                        return (
                          <button
                            key={dateKey}
                            type="button"
                            disabled={!available}
                            onClick={() => setBookForm((prev) => ({ ...prev, date: dateKey }))}
                            className={`h-10 border text-[11px] transition-colors ${
                              isSelected
                                ? "border-[#C7A040] bg-[#C7A040] font-semibold text-white"
                                : available
                                  ? "border-[#eadcb7] bg-white text-[#1d1d1d] hover:border-[#C7A040] hover:bg-[#fff2cc]"
                                  : "border-[#f0e6c8] bg-[#fbf6e8] text-gray-300"
                            } ${!isCurrentMonth ? "opacity-50" : ""}`}
                          >
                            {day.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6f6f6f]">
                    Available Time Slots
                  </p>
                  {bookForm.date ? (
                    availableTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookForm((prev) => ({ ...prev, timeSlot: slot }))}
                            className={`h-9 border px-2 text-[11px] font-medium transition-colors ${
                              bookForm.timeSlot === slot
                                ? "border-[#C7A040] bg-[#C7A040] text-white"
                                : "border-[#d8d0ba] bg-white text-[#1d1d1d] hover:border-[#C7A040] hover:bg-[#fff2cc]"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="border border-dashed border-[#d8d0ba] bg-[#fffdf4] px-3 py-3 text-[11px] text-gray-500">
                        No valid one-hour reservation slots are available for the selected day.
                      </p>
                    )
                  ) : (
                    <p className="border border-dashed border-[#d8d0ba] bg-[#fffdf4] px-3 py-3 text-[11px] text-gray-500">
                      Choose a working day to unlock time slots.
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-montserrat font-medium uppercase tracking-wide text-[#6f6f6f]">
                    Select Seat
                  </label>
                  <select
                    value={bookForm.tableType}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, tableType: e.target.value }))}
                    className="h-9 w-full border border-[#d8d0ba] bg-[#fff8e8] px-3 text-[11px] font-montserrat font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                  >
                    <option value="">Select Seat Count</option>
                    {SEAT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* <div className="space-y-1">
                  <label className="block text-[10px] font-montserrat font-medium uppercase tracking-wide text-[#6f6f6f]">
                    Message
                  </label>
                  <textarea
                    value={bookForm.message}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Add Message"
                    rows={3}
                    className="w-full resize-none border border-[#d8d0ba] bg-[#fff8e8] px-3 py-2 text-[11px] font-montserrat font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C7A040]"
                  />
                </div> */}

                <div className="border border-[#eadcb7] bg-[#fff3d3] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6f6f6f]">
                    Reservation Summary
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-wide text-[#8a7b52]">
                    <span>{bookForm.date && selectedDateObject ? formatCalendarDate(selectedDateObject) : "Date not selected"}</span>
                    <span>{bookForm.timeSlot || "Time not selected"}</span>
                    <span>{bookForm.tableType || "Seat size not selected"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!bookingReady}
                  className={`h-10 w-full text-[11px] font-poppins font-semibold uppercase tracking-wide text-white transition-colors ${
                    bookingReady ? "bg-[#C7A040] hover:bg-[#a88432]" : "cursor-not-allowed bg-[#d7c796]"
                  }`}
                >
                  Book Table
                </button>
                <p className="border border-dashed border-[#d8d0ba] bg-[#fffdf4] px-3 py-2 text-[11px] text-gray-500 leading-relaxed mt-3">
  On submission of this form, your booking request will be shared with the business. 
  They will <span className="font-medium text-[#1d1d1d]">confirm or decline</span> it based on availability. 
  We’ll keep you updated.
</p>
              </div>
              )}
            </div>

            <div className="overflow-hidden bg-white">
              <h3 className="mb-2 text-sm font-montserrat font-semibold text-[#c79b44]">Location And Hours</h3>

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
                      <span className="font-montserrat font-semibold uppercase tracking-[0.14em]">{hour.day}</span>
                    <span className={`${hour.closed ? "text-red-500" : ""} font-montserrat font-semibold`}>
                      {hour.closed ? "Closed" : (hour.hours || "").toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
            {/* 🔥 IMAGE MODAL */}
      <RevealConsentModal
        variant={revealModal ?? "consent"}
        open={revealModal !== null}
        loading={revealLoading}
        error={revealError}
        onClose={closeRevealModal}
        onConfirm={handleRevealConfirm}
      />
{selectedImage && (
  <div
    className="fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center p-4"
    onClick={() => setSelectedImage(null)} // close on outside click
  >
    <div
      className="relative max-w-4xl w-full"
      onClick={(e) => e.stopPropagation()} // prevent close when clicking image
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-2 right-2 bg-white text-black px-3 py-1 text-sm font-semibold rounded"
      >
        ✕
      </button>

      {/* Image */}
      <img
        src={selectedImage}
        alt="Preview"
        className="w-full max-h-[80vh] object-contain rounded"
      />
    </div>
  </div>
)}
    </div>
  );
}
