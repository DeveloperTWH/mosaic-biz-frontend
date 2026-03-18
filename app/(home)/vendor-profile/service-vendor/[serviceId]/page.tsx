"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ClientTestimonials from "../../../Components/ClientTestimonials";

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
function normalizeData(payload: ApiResponse) {
  const service = payload?.data?.service;
  const business = payload?.data?.business;
  
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
    contact: service?.contact || { phone: "", email: "", address: "", website: "" },
    coverImage: service?.coverImage || business?.coverImage || "",
    galleryImages: service?.images || [],
    businessHours: service?.businessHours || [],
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

function getBadgeImage(badge?: string): string | null {
  if (!badge) return null;
  const key = badge.trim().toLowerCase();
  const badgeMap: Record<string, string> = {
    silver: "/badge/silver.png",
    gold: "/badge/gold.png",
    platinum: "/badge/platinum.png",
    diamond: "/badge/diamond.png",
  };
  return badgeMap[key] ?? null;
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
  const serviceId = typeof params.serviceId === "string" ? params.serviceId : params.serviceId?.[0];

  const [data, setData] = useState<ReturnType<typeof normalizeData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* filter / sort */
  const [serviceType, setServiceType] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [duration, setDuration] = useState("");
  const [sort, setSort] = useState("price_asc");
  

  /* reveal contact */
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const reveal = (k: string) => setRevealed(p => ({ ...p, [k]: true }));

  /* book-service form */
  const [bookForm, setBookForm] = useState({ name: "", email: "", phone: "", date: "", note: "", serviceType: "" });

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

  const sortedServices = useMemo(() => {
    if (!data) return [];
    let list = data.services.filter(s => {
      const mtName = !serviceType || s.name.toLowerCase().includes(serviceType.toLowerCase());
      const mtLoc = !locationFilter || (data.contact.address || "").toLowerCase().includes(locationFilter.toLowerCase());
      const mtDur = !duration || s.durationMinutes.toString().includes(duration);
      return mtName && mtLoc && mtDur;
    });
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "duration_asc") list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    else if (sort === "duration_desc") list.sort((a, b) => b.durationMinutes - a.durationMinutes);
    return list;
  }, [data, serviceType, locationFilter, duration, sort]);

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
    businessName, businessLogo, businessDescription, category, subcategory
  } = data;

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = businessHours.find(h => h.day === todayName);

  const badgeImage = getBadgeImage(data?.businessBadge);
  const heroTitle = businessName || title || "Vendor Profile";
  const heroSection = subcategory || category || "Services";
  const galleryItems = galleryImages.slice(0, 6);



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
    <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-white uppercase">
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
      <div className="w-full bg-[#1A1F71] py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-[12px] font-semibold text-white mb-1 font-poppins">Filter By Service Type</label>
              <input value={serviceType} onChange={e => setServiceType(e.target.value)}
                placeholder="Type Here" className="w-full h-9 px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#c79b44]" />
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-semibold text-white mb-1 font-poppins">Filter By Location</label>
              <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
                className="w-full h-9 px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#c79b44]">
                <option value="">Choose Location</option>
                <option value="new york">New York</option>
                <option value="los angeles">Los Angeles</option>
                <option value="chicago">Chicago</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-semibold text-white mb-1 font-poppins">Filter By Duration</label>
              <select value={duration} onChange={e => setDuration(e.target.value)}
                className="w-full h-9 px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#c79b44]">
                <option value="">Select Duration</option>
                <option value="30">30 Min</option>
                <option value="60">60 Min</option>
                <option value="90">90 Min</option>
                <option value="120">2 Hours</option>
              </select>
            </div>
            <button className="h-9 px-8 bg-[#c79b44] text-white text-sm font-semibold hover:bg-[#a87c30] transition-colors whitespace-nowrap">
              Search Now
            </button>
          </div>
        </div>
      </div>

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
              {badgeImage && (
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
                    <div className="absolute inset-0 flex items-center justify-center p-3">
                      <img
                        src={badgeImage ?? undefined}
                        alt={`${data?.businessBadge || "Business"} badge`}
                        className="w-full h-full object-contain scale-110"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Business Name & Info */}
            <div className="mt-7 border-b border-[#ece6d9] pb-5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-[32px] font-semibold leading-none text-[#1b1b1b]">{heroTitle}</h2>
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
                <p className="mt-3 max-w-[760px] text-[11px] leading-5 text-[#7b7b7b]">{businessDescription || description}</p>
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
  <h3 className="mb-3 text-sm font-semibold text-[#c79b44]">
    Offered Services
  </h3>

  {sortedServices.length === 0 ? (
    <p className="text-sm text-gray-500">No services found.</p>
  ) : (
    <div className="space-y-2.5">
      {sortedServices.map(svc => (
        <div
          key={svc._id}
          className="group flex gap-3 border border-[#ece6d8] bg-[#f8f8f8] p-2.5 transition-shadow hover:shadow-sm"
        >
          <div className="h-16 w-16 shrink-0 overflow-hidden bg-gray-100">
            <img
              src={svc.image}
              alt={svc.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[13px] font-semibold text-[#1d1d1d]">{svc.name}</h4>
            <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#7f7f7f]">
              {svc.description || "Professional service offered by our experts."}
            </p>
            <div className="mt-1.5 flex items-center gap-4 text-[10px] text-[#7f7f7f]">
              <span>Duration: {formatDuration(svc.durationMinutes)}</span>
              <span className="text-[11px] font-semibold text-[#1d1d1d]">${svc.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

            {/* Photo Gallery */}
{/* Photo Gallery */}
  <div className="mt-6">
    <h3 className="mb-3 text-sm font-semibold text-[#c79b44]">
      Photo Gallery
    </h3>

    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
      {Array.from({ length: Math.max(galleryItems.length, 6) }).map((_, i) => {
        const img = galleryItems[i];
        return (
          <div
            key={i}
            className="h-[78px] overflow-hidden bg-[#dfdfdf]"
          >
            {img ? (
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  </div>

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

              <div className="mt-3 space-y-1.5 text-[12px]">
                {[
                  { label: "Business Name", value: data.businessName, key: null },
                  { label: "Category", value: category, key: null },
                  { label: "Established In", value: estYear?.toString() || "N/A", key: null },
                  { label: "Call Us", value: contact.phone || data.businessPhone, key: "call" },
                  { label: "Email Us", value: contact.email || data.businessEmail, key: "email" },
                  { label: "Address", value: contact.address, key: "address" },
                  { label: "Website", value: contact.website, key: "website" },
                ].map(row => (
                  <div key={row.label} className="grid grid-cols-[96px_1fr] gap-2 items-start">
                    <span className="font-montserrat font-bold text-gray-900">{row.label}</span>
                    {row.key === null ? (
                      <span className="font-montserrat font-medium text-gray-700">{row.value || "N/A"}</span>
                    ) : row.value ? (
                      revealed[row.key] ? (
                        row.key === "address" ? (
                          <a href={row.value.startsWith("http") ? row.value : `https://${row.value}`}
                            target="_blank" rel="noreferrer" className="font-montserrat font-medium text-gray-700 underline break-all">
                            View on Maps
                          </a>
                        ) : row.key === "website" ? (
                          <a href={row.value.startsWith("http") ? row.value : `https://${row.value}`}
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
              </div>
            </div>

            {/* Book Service Form */}
<div className="overflow-hidden border border-[#e2c46a] bg-[#fff8e8]">
  
  {/* Header */}
  <div className="border-b border-[#e6d3a3] px-5 py-4">
    <h3 className="text-[14px] font-bold tracking-wide text-[#1A1F71] uppercase">
      Book Service
    </h3>
  </div>

  <div className="space-y-3 p-5">

    <div className="space-y-1">
      <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">Name</label>
      <input
        value={bookForm.name}
        onChange={e => setBookForm(p => ({ ...p, name: e.target.value }))}
        placeholder="Enter Name"
        className="h-8 w-full border border-[#d8d0ba] bg-[#fff8e8] px-2.5 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C7A040] placeholder:text-gray-400"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">Email</label>
      <input
        value={bookForm.email}
        onChange={e => setBookForm(p => ({ ...p, email: e.target.value }))}
        placeholder="Enter Email"
        type="email"
        className="h-8 w-full border border-[#d8d0ba] bg-[#fff8e8] px-2.5 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C7A040] placeholder:text-gray-400"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">Phone Number</label>
      <input
        value={bookForm.phone}
        onChange={e => setBookForm(p => ({ ...p, phone: e.target.value }))}
        placeholder="Enter Phone Number"
        type="tel"
        className="h-8 w-full border border-[#d8d0ba] bg-[#fff8e8] px-2.5 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C7A040] placeholder:text-gray-400"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-[10px] font-medium uppercase tracking-wide text-[#6f6f6f]">Date</label>
      <input
        value={bookForm.date}
        onChange={e => setBookForm(p => ({ ...p, date: e.target.value }))}
        placeholder="MM/DD/YYYY"
        type="text"
        className="h-8 w-full border border-[#d8d0ba] bg-[#fff8e8] px-2.5 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#C7A040] placeholder:text-gray-400"
      />
    </div>

    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6f6f6f]">
      Which Type Of Service Do You Need?
    </p>

    <div className="overflow-hidden border border-[#eadcb7] bg-[#fff8e8]">
      <table className="w-full text-[11px]">
        <thead className="bg-[#f8f1dd]">
          <tr>
            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Service Name</th>
            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Duration</th>
            <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Price</th>
          </tr>
        </thead>
        <tbody>
          {data.services.slice(0, 4).map((svc, i) => (
            <tr key={svc._id} className={i % 2 === 0 ? "bg-[#fff8e8]" : "bg-[#fcf4df]"}>
              <td className="px-2 py-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="bookSvc"
                    value={svc._id}
                    checked={bookForm.serviceType === svc._id}
                    onChange={() => setBookForm(p => ({ ...p, serviceType: svc._id }))}
                    className="accent-[#C7A040]"
                  />
                  <span className="capitalize text-[10px]">{svc.name}</span>
                </label>
              </td>
              <td className="px-2 py-1.5 text-[10px] text-gray-500">
                {formatDuration(svc.durationMinutes)}
              </td>
              <td className="px-2 py-1.5 text-[10px] font-medium text-gray-700">
                ${svc.price.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <button className="h-9 w-full bg-[#C7A040] text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#a88432]">
      Request An Appointment
    </button>
  </div>
</div>

            {/* Locations & Hours */}
            <div className="overflow-hidden bg-white">
              <div className="px-0 py-0">
                <h3 className="mb-2 text-sm font-semibold text-[#c79b44]">Location And Hours</h3>
              </div>

              <div className="h-40 w-full overflow-hidden border border-[#ece6d8] bg-gray-200">
                {mapUrl ? (
                  <iframe
                  src={
  mapUrl
    ? mapUrl.includes("maps.google.com") && !mapUrl.includes("/maps/embed")
      ? `https://maps.google.com/maps?q=${encodeURIComponent("Default Location")}&output=embed`
      : mapUrl
    : undefined
}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                    Map unavailable
                  </div>
                )}
              </div>

              <div className="space-y-1.5 px-1 py-4">
                {businessHours.map(h => (
                  <div key={h._id} className={`grid grid-cols-[90px_1fr] text-[10px] ${h.day === todayName ? "font-bold text-[#1d1d1d]" : "text-[#6d6d6d]"}`}>
                    <span className="uppercase tracking-[0.14em]">{h.day}</span>
                    <span className={h.closed ? "text-red-500" : ""}>
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
