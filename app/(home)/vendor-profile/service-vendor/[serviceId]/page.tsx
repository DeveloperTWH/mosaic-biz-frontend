"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import ClientTestimonials from "../../../Components/ClientTestimonials";
import PublicSearchFilterBar from "../../../Components/PublicSearchFilterBar";
import { buildSearchPageUrl, PublicSearchFilters } from "../../../Components/publicSearch";

/* ─────────────── Types based on actual API response ─────────────── */
type ServiceContact = {
  phone: string;
  email: string;
  address: string;
  website: string;
};

type ServiceItem = {
  _id: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  durationMinutes: number;
  price: number;
};

type BusinessHour = {
  day: string;
  hours: string;
  closed: boolean;
  _id: string;
};

type Category = {
  _id: string;
  name: string;
};

type Business = {
  _id: string;
  businessName: string;
  description: string;
  logo: string;
  email: string;
  phone: string;
  slug: string;
  coverImage: string;
  badge: string; // ✅ ADD THIS
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
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
};

type ServiceData = {
  service: {
    contact: ServiceContact;
    _id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    services: ServiceItem[];
    categoryId: Category;
    subcategoryId: Category;
    ownerId: string;
    isPublished: boolean;
    coverImage: string;
    images: string[];
    maxBookingsPerSlot: number;
    bookingToolLink: string;
    videos: string[];
    features: string[];
    amenities: string[];
    businessHours: BusinessHour[];
    location: string;
    faq: any[];
    totalReviews: number;
    averageRating: number;
    createdAt: string;
    updatedAt: string;
    slug: string;
    __v: number;
  };
  business: Business;
};

type ApiResponse = {
  success: boolean;
  data: ServiceData;
};

/* ─────────────── Helpers ─────────────── */
function formatBusinessAddress(address?: Business["address"]) {
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

function normalizeData(payload: ApiResponse) {
  const service = payload?.data?.service;
  const business = payload?.data?.business;
  const businessAddress = formatBusinessAddress(business?.address);
  const businessWebsite = business?.website || business?.socialLinks?.website || "";

  return {
    // Service info
    title: service?.title || service?.slug || "Service Provider",
    description: typeof service?.description === "string"
      ? service.description.replace(/<[^>]*>/g, "") : "",
    services: (service?.services || []).map(s => ({
      _id: String(s._id ?? ""),
      name: String(s.name ?? "Service"),
      description: typeof s.description === "string" ? s.description.replace(/<[^>]*>/g, "") : "",
      image: s.image || "/ShopProduct/Aria-SK6-Helmet 1.png",
      durationMinutes: s.durationMinutes || 0,
      price: Number(s.price) || 0,
    })),
    contact: {
      phone: service?.contact?.phone || business?.phone || "",
      email: service?.contact?.email || business?.email || "",
      address: service?.contact?.address || businessAddress,
      website: service?.contact?.website || businessWebsite,
    },
    coverImage: service?.coverImage || business?.coverImage || "",
    galleryImages: service?.images || [],
    businessHours: service?.businessHours || [],
    bookingToolLink: service?.bookingToolLink || "",
    averageRating: service?.averageRating || 0,
    totalReviews: service?.totalReviews || 0,
    slug: service?.slug || "",
    location: service?.location || "",
    features: service?.features || [],
    amenities: service?.amenities || [],
    createdAt: service?.createdAt || "",
    
    // ✅ Business info (UPDATED)
    businessName: business?.businessName || "",
    businessDescription: business?.description || "",
    businessLogo: business?.logo || "",
    businessEmail: business?.email || "",
    businessPhone: business?.phone || "",
    businessSlug: business?.slug || "",
    businessBadge: business?.badge || "", // ✅ ADD THIS
    businessAddress,
    businessWebsite,
    googleReviewLink: business?.googleReviewLink || "",
    communityServiceLink: business?.communityServiceLink || "",
    refundPolicyDocumentUrl: business?.refundPolicyDocument?.url || "",
    termsDocumentUrl: business?.termsDocument?.url || "",
    
    // Categories
    category: service?.categoryId?.name || "",
    subcategory: service?.subcategoryId?.name || "",
  };
}

function formatDuration(min: number) {
  if (!min) return "—";
  if (min < 60) return `${min} Min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}m` : `${h} Hour${h > 1 ? "s" : ""}`;
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

function formatCalendarDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
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

function generateTimeSlots(hours: string, appointmentMinutes: number, stepMinutes = 30) {
  const parsed = parseBusinessHourRange(hours);
  if (!parsed) return [];

  const { openMinutes, closeMinutes } = parsed;
  const duration = Math.max(appointmentMinutes, stepMinutes);
  const latestStart = closeMinutes - duration;
  const slots: string[] = [];

  for (let current = openMinutes; current <= latestStart; current += stepMinutes) {
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

function getSafeExternalUrl(url?: string) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function getMapUrls(location?: string, address?: string) {
  const rawLocation = (location || "").trim();
  const rawAddress = (address || "").trim();
  const hasHttpLocation = /^https?:\/\//i.test(rawLocation);
  const isEmbeddableMap =
    /\/maps\/embed/i.test(rawLocation) || /[?&]output=embed/i.test(rawLocation);

  if (isEmbeddableMap) {
    return {
      embedUrl: rawLocation,
      externalUrl: rawLocation,
    };
  }

  if (hasHttpLocation) {
    try {
      const parsedUrl = new URL(rawLocation);
      const atMatch = parsedUrl.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(\d+(?:\.\d+)?)z/i);

      if (atMatch) {
        const [, lat, lng, zoom] = atMatch;
        return {
          embedUrl: `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`,
          externalUrl: rawLocation,
        };
      }

      const query = parsedUrl.searchParams.get("q") || parsedUrl.searchParams.get("query");
      if (query) {
        return {
          embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`,
          externalUrl: rawLocation,
        };
      }
    } catch {
      return {
        embedUrl: undefined,
        externalUrl: rawLocation,
      };
    }

    return {
      embedUrl: undefined,
      externalUrl: rawLocation,
    };
  }

  if (rawLocation) {
    return {
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(rawLocation)}&output=embed`,
      externalUrl: `https://maps.google.com/maps?q=${encodeURIComponent(rawLocation)}`,
    };
  }

  if (rawAddress) {
    return {
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(rawAddress)}&output=embed`,
      externalUrl: `https://maps.google.com/maps?q=${encodeURIComponent(rawAddress)}`,
    };
  }

  return {
    embedUrl: undefined,
    externalUrl: undefined,
  };
}

function isShortGoogleMapsUrl(location?: string) {
  if (!location) return false;

  try {
    const parsed = new URL(location);
    return parsed.hostname.toLowerCase() === "maps.app.goo.gl";
  } catch {
    return false;
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? "text-[#c79b44]" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

/* ─────────────── Main Page ─────────────── */
export default function ServiceVendorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = typeof params.serviceId === "string" ? params.serviceId : params.serviceId?.[0];

  const [data, setData] = useState<ReturnType<typeof normalizeData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* filter / sort */
  const [filters, setFilters] = useState<PublicSearchFilters>({
    keyword: "",
    location: "",
    minorityType: "",
  });
  const [duration, setDuration] = useState("");
  const [sort, setSort] = useState("price_asc");
  const [badgeSrc, setBadgeSrc] = useState<string | null>(null);
  

  /* reveal contact */
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const reveal = (k: string) => setRevealed(p => ({ ...p, [k]: true }));

  /* book-service form */
  const [bookForm, setBookForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    note: "",
    serviceTypes: [] as string[],
    timeSlot: "",
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    if (!serviceId) { setError("Invalid service id."); setLoading(false); return; }
    (async () => {
      try {
        const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
        const res = await fetch(`${base}/api/public/services/${serviceId}`, {
          headers: { Accept: "application/json" }, cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load profile.");
        const json = await res.json() as ApiResponse;
        if (!json.success || !json.data) throw new Error("Profile unavailable.");
        setData(normalizeData(json));
      } catch (e: any) { setError(e?.message || "Error loading profile."); }
      finally { setLoading(false); }
    })();
  }, [serviceId]);

  const badgeImage = getBadgeImage(data?.businessBadge);

  useEffect(() => {
    setBadgeSrc(badgeImage);
  }, [badgeImage]);

  const sortedServices = useMemo(() => {
    if (!data) return [];
    let list = data.services.filter(s => {
      const mtName = !filters.keyword || s.name.toLowerCase().includes(filters.keyword.toLowerCase());
      const mtLoc = !filters.location || (data.businessAddress || data.contact.address || "").toLowerCase().includes(filters.location.toLowerCase());
      const mtDur = !duration || s.durationMinutes.toString().includes(duration);
      return mtName && mtLoc && mtDur;
    });
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "duration_asc") list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    else if (sort === "duration_desc") list.sort((a, b) => b.durationMinutes - a.durationMinutes);
    return list;
  }, [data, filters, duration, sort]);

  const normalizedBusinessHours = useMemo(
    () => (data?.businessHours || []).map(hour => ({
      ...hour,
      closed: Boolean(hour.closed),
      day: DAY_NAMES.includes(hour.day as (typeof DAY_NAMES)[number]) ? hour.day : hour.day,
    })),
    [data?.businessHours]
  );

  const workingDays = useMemo(
    () => new Set(normalizedBusinessHours.filter(hour => !hour.closed).map(hour => hour.day)),
    [normalizedBusinessHours]
  );

  const selectedServices = useMemo(
    () => (data?.services || []).filter(service => bookForm.serviceTypes.includes(service._id)),
    [data?.services, bookForm.serviceTypes]
  );

  const totalDurationMinutes = useMemo(
    () => selectedServices.reduce((sum, service) => sum + (service.durationMinutes || 0), 0),
    [selectedServices]
  );

  const totalPrice = useMemo(
    () => selectedServices.reduce((sum, service) => sum + (service.price || 0), 0),
    [selectedServices]
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
    if (!selectedBusinessHour?.hours) return [];
    return generateTimeSlots(selectedBusinessHour.hours, totalDurationMinutes || 30);
  }, [selectedBusinessHour, totalDurationMinutes]);

  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);

  useEffect(() => {
    if (!bookForm.timeSlot) return;
    if (!availableTimeSlots.includes(bookForm.timeSlot)) {
      setBookForm(prev => ({ ...prev, timeSlot: "" }));
    }
  }, [availableTimeSlots, bookForm.timeSlot]);

  const estYear = data?.createdAt ? new Date(data.createdAt).getFullYear() : null;

  /* ─── Loading / Error states ─── */
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#c79b44] rounded-full border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading profile…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-red-600 font-medium">{error}</p>
    </div>
  );

  if (!data) return null;

  const { 
    title, description, contact, coverImage, galleryImages, businessHours,
    averageRating, totalReviews, slug, location: mapUrl, amenities, features,
    businessName, businessLogo, businessDescription, businessAddress, businessWebsite,
    googleReviewLink, communityServiceLink, refundPolicyDocumentUrl, termsDocumentUrl,
    category, subcategory
  } = data;

  const toggleServiceSelection = (serviceIdToToggle: string) => {
    setBookForm(prev => {
      const exists = prev.serviceTypes.includes(serviceIdToToggle);
      return {
        ...prev,
        serviceTypes: exists
          ? prev.serviceTypes.filter(id => id !== serviceIdToToggle)
          : [...prev.serviceTypes, serviceIdToToggle],
      };
    });
  };

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
    bookForm.serviceTypes.length > 0;

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = businessHours.find(h => h.day === todayName);
  const heroTitle = businessName || title || "Vendor Profile";
  const heroSection = subcategory || category || "Services";
  const galleryItems = galleryImages.slice(0, 6);
  const bookingToolLink = data.bookingToolLink || "";
  const hasDirectBookingLink = /^https?:\/\//i.test(bookingToolLink);
  const { embedUrl: mapEmbedUrl, externalUrl: mapExternalUrl } = getMapUrls(
    mapUrl,
    businessAddress || contact.address
  );
  const usesShortGoogleMapsLink = isShortGoogleMapsUrl(mapUrl);



  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Hero Banner ── */}
<div className="relative w-full h-[180px] bg-gray-800 overflow-hidden">

  {/* Background Image */}
  <img
    src="/products/19099 1.png"
    alt="vendor header"
    className="absolute inset-0 object-cover w-full h-full opacity-40"
  />

  {/* Center Content */}
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center px-4">
<h1 className="text-3xl md:text-4xl font-poppins font-semibold tracking-wide text-white uppercase">
  {heroTitle}
</h1>

    <nav className="mt-2 text-sm text-gray-300">
      <Link href="/" className="hover:text-white">Home</Link>
      <span className="mx-2">//</span>
      <Link href="/services" className="hover:text-white">
        {heroSection}
      </Link>
      <span className="mx-2">//</span>
      <span className="text-[#c79b44]">{heroTitle}</span>
    </nav>
  </div>

  {/* 🔥 BADGE (NEW) */}
{false && badgeImage && (
  <div className="absolute right-6 -bottom-10 z-20">
    <div className="relative w-20 h-20 md:w-24 md:h-24 drop-shadow-[0_10px_12px_rgba(0,0,0,0.25)]">

      {/* Outer Hex */}
      <div
        className="absolute inset-0 bg-white border border-gray-200"
        style={{
          clipPath: "polygon(25% 6%, 75% 6%, 98% 50%, 75% 94%, 25% 94%, 2% 50%)",
        }}
      />

      {/* Inner Hex */}
      <div
        className="absolute inset-[8px] bg-[#f8f9fb]"
        style={{
          clipPath: "polygon(25% 6%, 75% 6%, 98% 50%, 75% 94%, 25% 94%, 2% 50%)",
        }}
      />

      {/* Image */}
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <img
          src={badgeImage ?? undefined}
          alt={`${data?.businessBadge || "Business"} badge`}
          className="w-full h-full object-contain scale-110"
        />
      </div>

      {/* Label */}
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-gray-700 bg-white px-2 py-0.5 rounded shadow">
        {data?.businessBadge}
      </span>
    </div>
  </div>
)}
</div>

      {/* ── Filter Bar ── */}
      <PublicSearchFilterBar
        filters={filters}
        onChange={setFilters}
        onSubmit={() => router.push(buildSearchPageUrl(filters))}
      />

      {/* ── Main Content ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Cover Image */}
            <div className="relative w-full h-[280px] md:h-[340px] overflow-visible border border-[#e8e1cf] bg-gray-100">
              {coverImage
                ? <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-gray-300">S</div>
              }
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
                        alt={`${data?.businessBadge || "Business"} badge`}
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

            {/* Business Name & Info */}
            <div className="mt-7 border-b border-[#ece6d9] pb-5">
              <div className="flex items-center gap-2.5 flex-wrap">
               <h2 className="text-[32px] font-poppins font-semibold leading-none text-[#1b1b1b]">
  {heroTitle}
</h2>
                {amenities?.slice(0, 2).map(a => (
                  <span key={a} className="border border-[#d7cfbb] bg-[#f7f3e7] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#8a7b52]">{a}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={averageRating} />
                {totalReviews > 0 && (
                  <span className="text-[11px] text-[#8c8c8c]">{averageRating.toFixed(1)} Ratings And {totalReviews} Reviews</span>
                )}
              </div>
              {(businessDescription || description) && (
               <p className="mt-3 max-w-[760px] text-[11px] font-montserrat font-medium leading-5 text-[#7b7b7b]">
  {businessDescription || description}
</p>
              )}
              <button className="mt-4 flex h-8 items-center gap-2 border border-[#c79b44] px-3 text-[11px] font-semibold uppercase tracking-wide text-[#c79b44] hover:bg-[#c79b44] hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Review
              </button>
            </div>

            {/* Offered Services */}
<div className="mt-6">
<h3 className="mb-3 text-sm font-montserrat font-semibold text-[#c79b44]">
  Offered Services
</h3>

  {sortedServices.length === 0 ? (
    <p className="text-sm text-gray-500">No services found.</p>
  ) : (
    <div className="space-y-2.5">
      {sortedServices.map(svc => (
        <div
          key={svc._id}
          className="group flex gap-3 border border-[#ece6d8] bg-[#F5F5F5] p-2.5 transition-shadow hover:shadow-sm"
        >
          <div className="h-16 w-16 shrink-0 overflow-hidden bg-gray-100">
            <img
              src={svc.image}
              alt={svc.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[15px] font-poppins font-bold text-[#1d1d1d]">
  {svc.name}
</h4>
<p className="mt-1 line-clamp-2 text-[12px] font-montserrat font-medium leading-4 text-[#7f7f7f]">
  {svc.description || "Professional service offered by our experts."}
</p>
<div className="mt-1.5 flex items-center gap-4 text-[10px] text-[#7f7f7f]">
  {/* Duration */}
  <span>
    Duration: <span className="font-medium text-[#1d1d1d]">{formatDuration(svc.durationMinutes)}</span>
  </span>

  {/* Price */}
  <span className="text-[11px] font-semibold text-[#1d1d1d]">
    ${svc.price.toFixed(2)}
  </span>
</div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

            {/* Photo Gallery */}
{/* Photo Gallery */}
  {galleryItems.length > 0 && (
  <div className="mt-6">
    <h3 className="mb-3 text-sm font-semibold text-[#c79b44]">
      Photo Gallery
    </h3>

    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
      {galleryItems.map((img, i) => (
        <div
          key={`${img}-${i}`}
          className="h-[78px] overflow-hidden bg-[#dfdfdf]"
        >
          <img
            src={img}
            alt={`Gallery ${i + 1}`}
            className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  </div>
  )}

            {/* Testimonials */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Testimonials</h3>
              <ClientTestimonials />
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">

            {/* Business Info Card */}
            <div className="p-5 bg-white">
              {/* Logo */}
              <div className="flex items-center gap-2 pb-3">
                <div className="w-[100px] h-[100px] rounded border bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                  {data.businessLogo
                    ? <img src={data.businessLogo} alt={data.businessName} className="w-full h-full object-contain p-1" />
                    : <span className="text-[10px] font-bold text-[#1e3a5f]">{data.businessName?.charAt(0) || "S"}</span>}
                </div>
              </div>

             <div className="mt-3 space-y-1.5 text-[12px] font-montserrat font-medium">
                {[
                  { label: "Business Name", value: data.businessName, key: null },
                  { label: "Category", value: category, key: null },
                  { label: "Established In", value: estYear?.toString() || "N/A", key: null },
                  { label: "Call Us", value: data.businessPhone || contact.phone, key: "call" },
                  { label: "Email Us", value: data.businessEmail || contact.email, key: "email" },
                  { label: "Address", value: businessAddress || contact.address, key: "address" },
                  { label: "Website", value: businessWebsite || contact.website, key: "website" },
                ].map(row => (
                  <div key={row.label} className="grid grid-cols-[96px_1fr] gap-2 items-start">
                    <span className="font-montserrat font-bold text-gray-900">{row.label}</span>
                    {row.key === null ? (
                      <span className="font-montserrat font-medium text-gray-700">{row.value || "N/A"}</span>
                    ) : row.value ? (
                      revealed[row.key] ? (
                        row.key === "address" ? (
                          <a href={mapExternalUrl || row.value}
                            target="_blank" rel="noreferrer" className="font-montserrat font-medium text-gray-700 underline break-all">
                            View on Maps
                          </a>
                        ) : row.key === "website" ? (
                          <a href={getSafeExternalUrl(row.value)}
                            target="_blank" rel="noreferrer" className="font-montserrat font-medium text-gray-700 underline break-all">
                            {row.value.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          <span className="font-montserrat font-medium text-gray-700 break-all">{row.value}</span>
                        )
                      ) : (
                        <button onClick={() => reveal(row.key!)}
                          className="text-left text-[#1A1F71] underline hover:text-[#0d1150]">
                          Click to reveal
                        </button>
                      )
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>
                ))}
                {googleReviewLink ? (
                  <div className="grid grid-cols-[96px_1fr] gap-2 items-start">
                    <span className="font-montserrat font-bold text-gray-900">Reviews</span>
                    <a
                      href={getSafeExternalUrl(googleReviewLink)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-montserrat font-medium text-[#1A1F71] underline break-all"
                    >
                      Google Review
                    </a>
                  </div>
                ) : null}
                {communityServiceLink ? (
                  <div className="grid grid-cols-[96px_1fr] gap-2 items-start">
                    <span className="font-montserrat font-bold text-gray-900">Community</span>
                    <a
                      href={getSafeExternalUrl(communityServiceLink)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-montserrat font-medium text-[#1A1F71] underline break-all"
                    >
                      Community Service
                    </a>
                  </div>
                ) : null}
                {refundPolicyDocumentUrl ? (
                  <div className="grid grid-cols-[96px_1fr] gap-2 items-center">
                    <span className="font-montserrat font-bold text-gray-900">Refund policy</span>
                    <a
                      href={refundPolicyDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded border border-gray-200 px-2.5 py-1.5 text-[#1A1F71] hover:bg-gray-50"
                      aria-label="View refund policy document"
                      title="View refund policy document"
                    >
                      <Eye size={16} />
                    </a>
                  </div>
                ) : null}
                {termsDocumentUrl ? (
                  <div className="grid grid-cols-[96px_1fr] gap-2 items-center">
                    <span className="font-montserrat font-bold text-gray-900">Terms doc</span>
                    <a
                      href={termsDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded border border-gray-200 px-2.5 py-1.5 text-[#1A1F71] hover:bg-gray-50"
                      aria-label="View terms document"
                      title="View terms document"
                    >
                      <Eye size={16} />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Book Service Form */}
<div className="overflow-hidden border border-[#e2c46a] bg-[#fff8e8]">
  
  {/* Header */}
  <div className="border-b border-[#e6d3a3] px-5 py-4">
<h3 className="text-[14px] font-poppins font-bold tracking-wide text-[#1A1F71] uppercase">
  {hasDirectBookingLink ? "Book Now" : "Book Service"}
</h3>
  </div>

  {hasDirectBookingLink ? (
    <div className="p-5">
      <button
        className="h-10 w-full bg-[#C7A040] text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#a88432]"
        onClick={() => {
          window.open(bookingToolLink, "_blank", "noopener,noreferrer");
        }}
      >
        Book Now
      </button>

<p className="border border-dashed border-[#d8d0ba] bg-[#fffdf4] px-3 py-2 text-[11px] text-gray-500 leading-relaxed mt-3">
  On submission of this form, your booking request will be shared with the business. 
  They will <span className="font-medium text-[#1d1d1d]">confirm or decline</span> it based on availability. 
  We’ll keep you updated.
</p>
    </div>
  ) : (
  <div className="space-y-4 p-5">

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="space-y-1">
        <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">Name</label>
        <input
          value={bookForm.name}
          onChange={e => setBookForm(p => ({ ...p, name: e.target.value }))}
          placeholder="Enter Name"
          className="h-9 w-full border border-[#d8d0ba] bg-[#fff8e8] px-3 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C7A040] placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">Phone Number</label>
        <input
          value={bookForm.phone}
          onChange={e => setBookForm(p => ({ ...p, phone: e.target.value }))}
          placeholder="Enter Phone Number"
          type="tel"
          className="h-9 w-full border border-[#d8d0ba] bg-[#fff8e8] px-3 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C7A040] placeholder:text-gray-400"
        />
      </div>
    </div>

    <div className="space-y-1">
      <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">Email</label>
      <input
        value={bookForm.email}
        onChange={e => setBookForm(p => ({ ...p, email: e.target.value }))}
        placeholder="Enter Email"
        type="email"
        className="h-9 w-full border border-[#d8d0ba] bg-[#fff8e8] px-3 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C7A040] placeholder:text-gray-400"
      />
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6f6f6f]">
          Select Services
        </p>
        {selectedServices.length > 0 && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[#1A1F71]">
            {selectedServices.length} Selected
          </span>
        )}
      </div>

      <div className="space-y-2">
        {data.services.map((svc) => {
          const active = bookForm.serviceTypes.includes(svc._id);
          return (
            <label
              key={svc._id}
              className={`flex cursor-pointer items-start gap-3 border px-3 py-3 transition-colors ${
                active
                  ? "border-[#C7A040] bg-[#fff2cc]"
                  : "border-[#eadcb7] bg-[#fff8e8] hover:border-[#d6b35f]"
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggleServiceSelection(svc._id)}
                className="mt-0.5 h-4 w-4 accent-[#C7A040]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[#1A1F71]">
                    {svc.name}
                  </span>
                  <span className="text-[11px] font-semibold text-[#7b5e19]">
                    ${svc.price.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-[#8a7b52]">
                  {formatDuration(svc.durationMinutes)}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6f6f6f]">
          Pick A Date
        </p>
      </div>

      <div className="border border-[#eadcb7] bg-[#fffdf4] p-3">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            className="h-8 w-8 border border-[#d7c796] text-[#7b5e19] transition-colors hover:bg-[#f8edd0]"
          >
            ‹
          </button>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1F71]">
            {formatMonthLabel(calendarMonth)}
          </p>
          <button
            type="button"
            onClick={() => setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            className="h-8 w-8 border border-[#d7c796] text-[#7b5e19] transition-colors hover:bg-[#f8edd0]"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {DAY_NAMES.map(day => (
            <span key={day} className="pb-1 text-[10px] font-semibold uppercase tracking-wide text-[#8a7b52]">
              {day.slice(0, 3)}
            </span>
          ))}
          {calendarDays.map(day => {
            const isCurrentMonth = day.getMonth() === calendarMonth.getMonth();
            const dateKey = formatDateKey(day);
            const isSelected = bookForm.date === dateKey;
            const available = isDateAvailable(day);

            return (
              <button
                key={dateKey}
                type="button"
                disabled={!available}
                onClick={() => setBookForm(prev => ({ ...prev, date: dateKey }))}
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
            {availableTimeSlots.map(slot => (
              <button
                key={slot}
                type="button"
                onClick={() => setBookForm(prev => ({ ...prev, timeSlot: slot }))}
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
            {selectedServices.length === 0
              ? "Select one or more services to calculate valid appointment slots."
              : "No slots fit inside the vendor's working hours for the selected services."}
          </p>
        )
      ) : (
        <p className="border border-dashed border-[#d8d0ba] bg-[#fffdf4] px-3 py-3 text-[11px] text-gray-500">
          Choose a working day to see time slots.
        </p>
      )}
    </div>

    {/* <div className="space-y-1">
      <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">Special Notes</label>
      <textarea
        value={bookForm.note}
        onChange={e => setBookForm(p => ({ ...p, note: e.target.value }))}
        placeholder="Tell the vendor anything important before the appointment"
        rows={3}
        className="w-full resize-none border border-[#d8d0ba] bg-[#fff8e8] px-3 py-2 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C7A040] placeholder:text-gray-400"
      />
    </div> */}

    {/* <div className="border border-[#eadcb7] bg-[#fff3d3] p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6f6f6f]">
          Booking Summary
        </p>
        <span className="text-[12px] font-bold text-[#1A1F71]">
          ${totalPrice.toFixed(2)}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-gray-700">
        {selectedServices.length > 0
          ? selectedServices.map(service => service.name).join(", ")
          : "No services selected yet."}
      </p>
      <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-wide text-[#8a7b52]">
        <span>Total Duration: {formatDuration(totalDurationMinutes)}</span>
        <span>{bookForm.date ? formatCalendarDate(selectedDateObject || new Date()) : "Date not selected"}</span>
        <span>{bookForm.timeSlot || "Time not selected"}</span>
      </div>
    </div> */}

    <button
      type="button"
      disabled={!bookingReady}
      className={`h-10 w-full text-[11px] font-semibold uppercase tracking-wide text-white transition-colors ${
        bookingReady ? "bg-[#C7A040] hover:bg-[#a88432]" : "bg-[#d7c796] cursor-not-allowed"
      }`}
    >
      Request An Appointment
    </button>
<p className="border border-dashed border-[#d8d0ba] bg-[#fffdf4] px-3 py-2 text-[11px] text-gray-500 leading-relaxed mt-3">
  On submission of this form, your booking request will be shared with the business. 
  They will <span className="font-medium text-[#1d1d1d]">confirm or decline</span> it based on availability. 
  We’ll keep you updated.
</p>
  </div>
  )}
</div>

            {/* Locations & Hours */}
            <div className="overflow-hidden bg-white">
              <div className="px-0 py-0">
                <h3 className="mb-2 text-sm font-semibold text-[#c79b44]">Location And Hours</h3>
              </div>

              <div className="h-40 w-full overflow-hidden border border-[#ece6d8] bg-gray-200">
                {mapEmbedUrl ? (
                  <iframe
                  src={mapEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
                    <span className="text-sm text-gray-500">
                      {usesShortGoogleMapsLink
                        ? "Preview is not available for Google short links."
                        : "Map preview unavailable"}
                    </span>
                    {mapExternalUrl ? (
                      <a
                        href={mapExternalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold uppercase tracking-wide text-[#1A1F71] underline"
                      >
                        {usesShortGoogleMapsLink ? "Open Shared Map" : "Open in Google Maps"}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">Map unavailable</span>
                    )}
                  </div>
                )}
              </div>

<div className="space-y-1.5 px-5 py-5">
  {businessHours.map(h => (
    <div
      key={h._id}
      className={`grid grid-cols-[120px_1fr] gap-x-2 items-center text-[12px] ${
        h.day === todayName ? "text-[#1d1d1d]" : "text-[#6d6d6d]"
      }`}
    >
      <span className="uppercase tracking-[0.14em] font-montserrat font-semibold">
        {h.day}
      </span>
      <span className={`${h.closed ? "text-red-500" : ""} font-montserrat font-semibold`}>
        {h.closed ? "Closed" : h.hours.toUpperCase()}
      </span>
    </div>
  ))}
</div>
            </div>

          </div>
          {/* ── End RIGHT SIDEBAR ── */}
        </div>
      </div>
    </div>
  );
}
