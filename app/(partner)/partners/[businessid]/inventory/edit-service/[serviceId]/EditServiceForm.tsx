'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Service } from '@/types/service'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { uploadToS3, GalleryLimitError } from '@/utils/s3Uploader';
import ChildServiceFields from '../../components/ChildServiceFields';
import { ApiClientError, getUserSafeMessage } from '@/lib/api/errors';
import {
    createEmptyChildService,
    extractFieldErrorsFromError,
    getPublicationSuccessMessage,
    getServiceById,
    mapServiceToFormState,
    serializeServicePayload,
    updateService,
    validateServiceForPublish,
    verifyPublicListing,
    type ServiceChildInput,
} from '@/lib/api/services';

interface UpdateServiceFormProps {
    businessId: string;
    businessSlug: string;
    serviceId: string;
}

type CategorySelection = {
    categoryId: {
        _id: string;
        name: string;
    };
};

type GeoPoint = { type: 'Point'; coordinates: [number, number] } | null;

const noComma = (s = '') =>
    s.replace(/[,\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();

const buildFormattedAddress = (f: {
    addressLine1?: string; addressLine2?: string;
    city?: string; state?: string; zip?: string; country?: string;
}) => [f.addressLine1, f.addressLine2, f.city, f.state, f.zip, f.country]
    .map(noComma).filter(Boolean).join(', ');



type Amenity = {
    label: string;
    available: boolean;
    isDefault?: boolean;
};

type FAQ = {
    question: string;
    answer: string;
};


type GeocodeAddressComponent = { long_name: string; short_name: string; types: string[] };
type GeocodeLocation = { lat: number | (() => number); lng: number | (() => number) };
type GeocodeResult = {
    address_components: GeocodeAddressComponent[];
    formatted_address?: string;
    geometry: {
        location: GeocodeLocation;
        location_type?: 'ROOFTOP' | 'RANGE_INTERPOLATED' | 'GEOMETRIC_CENTER' | 'APPROXIMATE';
    };
    types?: string[];
};

type AddressParts = {
    // Keep BOTH new and old names to avoid TS2339 errors
    line1: string;
    line2: string;
    addressLine1: string;   // alias of line1
    addressLine2: string;   // alias of line2
    city: string;
    state: string;
    zip: string;
    country: string;
    fullFormatted: string;
    formattedAddress: string; // alias of fullFormatted
    shortFormatted: string;
    latitude: number;
    longitude: number;
};



function parseStoredAddress(addr?: string) {
    const parts = (addr ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean); // remove empties

    const country = parts.pop() ?? '';
    const zip = parts.pop() ?? '';
    const state = parts.pop() ?? '';
    const city = parts.pop() ?? '';

    const addressLine1 = parts.shift() ?? '';
    const addressLine2 = parts.join(' '); // join remaining as line2

    return {
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
        country,
    };
}


const stripCommas = (s = '') => s.replace(/,/g, '');




// ---- Best-result picker (same as before or your improved scorer) ----
// ---- Priority (defensive against missing location_type) ----
const LT_PRIORITY = ['ROOFTOP', 'RANGE_INTERPOLATED', 'GEOMETRIC_CENTER', 'APPROXIMATE'] as const;

function pickBestResult(results: GeocodeResult[], _srcLat?: number, _srcLng?: number): GeocodeResult | null {
    if (!results?.length) return null;
    return [...results].sort((a, b) => {
        const ai = LT_PRIORITY.indexOf((a?.geometry?.location_type as any) ?? '') ?? -1;
        const bi = LT_PRIORITY.indexOf((b?.geometry?.location_type as any) ?? '') ?? -1;
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    })[0];
}

// ---- Small sanitizer: remove commas/newlines; collapse spaces ----
const clean = (s?: string) =>
    (s ?? '')
        .replace(/[,\r\n]+/g, ' ')   // no commas/newlines inside fields
        .replace(/\s+/g, ' ')
        .trim();

// Keep getComponent as-is but we'll clean the output later
const getComponent = (components: GeocodeAddressComponent[], types: string[]): string =>
    components?.find((c) => types.every((t: string) => c.types?.includes(t)))?.long_name || '';

// ---- Extractor: produce comma-free parts + a safe formattedAddress ----
function extractAddressParts(result: GeocodeResult): AddressParts {
    const comps = result?.address_components || [];
    const get = (t: string[]) => getComponent(comps, t);

    // Prefer house/building → street → sublocality
    let line1 =
        ((get(['street_number']) || get(['route'])) ? [get(['street_number']), get(['route'])].filter(Boolean).join(' ') : '') ||
        get(['premise']) ||
        get(['subpremise']) ||
        get(['route']) ||
        get(['sublocality', 'sublocality_level_3']) ||
        '';

    let line2 =
        get(['neighborhood']) ||
        get(['sublocality', 'sublocality_level_2']) ||
        get(['sublocality']) ||
        '';

    let city = get(['locality']) || get(['administrative_area_level_3']) || '';
    let state = get(['administrative_area_level_1']) || '';
    let zip = get(['postal_code']) || '';
    let country = get(['country']) || '';

    // Clean every field so none contains commas/newlines
    line1 = clean(line1);
    line2 = clean(line2);
    city = clean(city);
    state = clean(state);
    zip = clean(zip);
    country = clean(country);

    // Build formattedAddress ONLY from cleaned fields, with EXACT separators
    const fields = [line1, line2, city, state, zip, country].filter(Boolean);
    const formattedAddress = fields.join(', ');  // <- safe to split later

    // Coordinates
    const { lat, lng } = result?.geometry?.location || {};
    const latitude = typeof lat === 'function' ? lat() : (lat as number);
    const longitude = typeof lng === 'function' ? lng() : (lng as number);

    return {
        line1,
        line2,
        addressLine1: line1,
        addressLine2: line2,
        city,
        state,
        zip,
        country,
        fullFormatted: formattedAddress,     // keep alias, but now guaranteed comma-safe
        formattedAddress,                    // <- use this downstream
        shortFormatted: [line1, line2 || city, state].filter(Boolean).map(clean).join(', '),
        latitude,
        longitude,
    };
}



const _debounce = (fn: (...a: any[]) => void, ms = 250) => {
    let t: any; return (...a: any[]) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};
const _newSession = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
type _Sug = { description: string; placeId: string };




// Map Google Places v1 addressComponents to your fields (works globally)
const mapAddressComponents = (components: any[]) => {
    const pick = (types: string[]) =>
        components.find(c => (c.types || []).some((t: string) => types.includes(t)));

    const by = (t: string, short = false) => {
        const c = pick([t]);
        if (!c) return "";
        return short ? (c.shortText ?? c.short_name ?? "") : (c.longText ?? c.long_name ?? "");
    };

    // Core parts (multiple fallbacks by region)
    const streetNumber = by("street_number");
    const route = by("route");                       // street name
    const subpremise = by("subpremise");                  // apt/suite no.
    const neighborhood = by("neighborhood");
    const sublocality = by("sublocality") || by("sublocality_level_1");
    const admin3 = by("administrative_area_level_3");
    const admin2 = by("administrative_area_level_2"); // county/district
    const city =
        by("locality") ||
        by("postal_town") ||        // UK
        by("administrative_area_level_2"); // fallback

    const state =
        by("administrative_area_level_1") ||
        by("region");                // fallback if present in some countries

    const zip = by("postal_code");
    const country = by("country");              // full name
    const countryCode = by("country", true);    // ISO code

    // Address lines
    const addressLine1 = [streetNumber, route].filter(Boolean).join(" ");
    const line2Parts = [subpremise, neighborhood, sublocality, admin3].filter(Boolean);
    const addressLine2 = Array.from(new Set(line2Parts)).join(", ");

    return {
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
        country,        // keep if you add it to state
        countryCode,    // optional if you need 2-letter ISO
    };
};





const UpdateServiceForm: React.FC<UpdateServiceFormProps> = ({ businessId, businessSlug, serviceId }) => {

    const router = useRouter()

    const days: string[] = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];


    const defaultBusinessHours = days.map(day => ({
        day,
        hours: '', // or 'Closed'
    }));
    const defaultAmenities = [
        { label: 'Home Visit Available', available: false, isDefault: true },
        { label: 'Waiting Area', available: false, isDefault: true },
        { label: 'Free Wi-Fi', available: false, isDefault: true },
        { label: 'Parking Available', available: false, isDefault: true },
        { label: 'Wheelchair Accessible', available: false, isDefault: true },
        { label: 'Appointment Booking', available: false, isDefault: true },
    ];


    const [serviceData, setServiceData] = useState<{
        title: string;
        description: string;
        price: number;
        duration: string;
        services: ServiceChildInput[];
        categories: CategorySelection[];
        coverImage: string;
        images: string[];
        videos: string[];
        features: string[];
        amenities: Amenity[];
        businessHours: { day: string; hours: string }[];
        location: { type: 'Point'; coordinates: [number, number] };
        contact: { phone: string; email: string; address: string; website: string };
        faq: FAQ[];
        maxBookingsPerSlot: number;
        isPublished: boolean;
    }>({
        title: '',
        description: '',
        price: 0,
        duration: '',
        services: [createEmptyChildService()],
        categories: [],
        coverImage: '',
        images: [],
        videos: [],
        features: [''],
        amenities: defaultAmenities,
        businessHours: defaultBusinessHours,
        location: { type: 'Point', coordinates: [0, 0] },
        contact: { phone: '', email: '', address: '', website: '' },
        faq: [{ question: '', answer: '' }],
        maxBookingsPerSlot: 1,
        isPublished: false,
    });

    const [originalServiceData, setOriginalServiceData] = useState<typeof serviceData | null>(null);


    const [serviceCategories, setServiceCategories] = useState<{ _id: string; name: string }[]>([]);
    const [categories, setCategories] = useState<{ categoryId: string }[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);




    const [bulkStartTime, setBulkStartTime] = useState('');
    const [bulkEndTime, setBulkEndTime] = useState('');
    const [selectedDays, setSelectedDays] = useState<number[]>([]);


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [publishIntent, setPublishIntent] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loadedIsPublished, setLoadedIsPublished] = useState(false);
    // State to track structured fields
    const [addressFields, setAddressFields] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    });



    // ✅ ADD (inside the same component, above your JSX)
    const [streetQuery, setStreetQuery] = useState(addressFields.addressLine1 || "");
    const [streetOpen, setStreetOpen] = useState(false);
    const [streetSugs, setStreetSugs] = useState<_Sug[]>([]);
    const streetSessionRef = useRef<string>(_newSession());

    const fetchStreetAutocomplete = async (input: string) => {
        if (!input.trim()) { setStreetSugs([]); setStreetOpen(false); return; }
        const resp = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
                "X-Goog-FieldMask": "suggestions.placePrediction.text,suggestions.placePrediction.placeId",
            },
            body: JSON.stringify({
                input,
                sessionToken: streetSessionRef.current,
                includedPrimaryTypes: ["street_address", "premise", "subpremise"],
            }),
        });
        const data = await resp.json();
        const list: _Sug[] = (data?.suggestions ?? [])
            .map((s: any) => ({ description: s?.placePrediction?.text?.text ?? "", placeId: s?.placePrediction?.placeId }))
            .filter((x: _Sug) => x.description && x.placeId);
        setStreetSugs(list);
        setStreetOpen(list.length > 0);
    };
    const debouncedStreetAuto = useMemo(() => _debounce(fetchStreetAutocomplete, 250), []);

    // replace your function body with this (same signature)
    const pickStreetSuggestion = async (s: _Sug) => {
        const resp = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(s.placeId)}`, {
            headers: {
                "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
                "X-Goog-FieldMask": "formattedAddress,addressComponents",
            },
        });
        const data = await resp.json();

        const comps: any[] = data?.addressComponents ?? [];
        const get = (t: string) => comps.find(c => (c.types || []).includes(t))?.longText ?? "";

        const streetNumber = get("street_number");
        const route = get("route");
        const neighborhood = get("neighborhood");
        const sublocality2 = get("sublocality_level_2");
        const sublocality = get("sublocality");

        const city = get("locality") || sublocality || get("administrative_area_level_2");
        const state = get("administrative_area_level_1");
        const zip = get("postal_code");
        const country = get("country");
        const premise = get("premise") || get("subpremise") || get("establishment") || "";

        const partsL1 = [premise, streetNumber, route].filter(Boolean);
        const line1Raw = partsL1.length ? partsL1.join(' ') : (route || '');
        const line2Raw = neighborhood || sublocality2 || sublocality || "";

        // NEW: strip commas only (preserve spaces as typed)
        const line1 = stripCommas(line1Raw);
        const line2 = stripCommas(line2Raw);
        const _city = stripCommas(city);
        const _state = stripCommas(state);
        const _zip = stripCommas(zip);
        const _country = stripCommas(country);

        setAddressFields(prev => ({
            ...prev,
            addressLine1: line1,
            addressLine2: line2 || prev.addressLine2,  // NEW
            city: _city || prev.city,
            state: _state || prev.state,
            zip: _zip || prev.zip,
            country: _country || prev.country,
        }));

        // NEW: persist clean single-string address; DO NOT set coords
        const formatted = [line1, line2, _city, _state, _zip, _country]
            .filter(Boolean)
            .join(', ');
        setServiceData((prev: any) => ({
            ...prev,
            contact: { ...prev.contact, address: formatted },
            location: null,              // let backend geocode
        }));

        setStreetQuery(line1);
        setStreetSugs([]); setStreetOpen(false);
        streetSessionRef.current = _newSession();
    };




    useEffect(() => {

        if (!serviceId || typeof serviceId !== 'string') {
            console.log('Invalid or missing serviceId:', serviceId);
            toast.error('Invalid Service ID');
            return;
        }

        const fetchInitialService = async () => {
            try {
                const data = await getServiceById(serviceId);
                const mapped = {
                    ...mapServiceToFormState(data),
                    categories: data.categories?.length ? data.categories : [],
                    amenities: data.amenities?.length ? data.amenities : defaultAmenities,
                    businessHours: data.businessHours?.length ? data.businessHours : defaultBusinessHours,
                    features: data.features?.length ? data.features : [''],
                } as unknown as typeof serviceData;

                setServiceData(mapped);
                setOriginalServiceData(mapped);
                setLoadedIsPublished(Boolean(data.isPublished));

                const parsed = parseStoredAddress(data.contact?.address);
                setAddressFields({
                    addressLine1: parsed.addressLine1,
                    addressLine2: parsed.addressLine2,
                    city: parsed.city,
                    state: parsed.state,
                    zip: parsed.zip,
                    country: parsed.country,
                });
                setDataLoaded(true);
            } catch (err) {
                console.error('Failed to fetch service:', err);
                toast.error('Failed to load service details.');
            }
        };

        fetchInitialService();
    }, [serviceId]);


    function deepEqual(a: any, b: any): boolean {
        return JSON.stringify(a) === JSON.stringify(b);
    }



    // Updates structured fields and combines into single address
    const updateAddressField = (key: string, value: string) => {
        const updatedFields = { ...addressFields, [key]: stripCommas(value) };

        const fullAddress = [
            updatedFields.addressLine1,
            updatedFields.addressLine2,
            updatedFields.city,
            updatedFields.state,
            updatedFields.zip,
        ]
            .filter(Boolean)
            .join(', ');

        setAddressFields(updatedFields);
        setServiceData((prev: any) => ({
            ...prev,
            contact: {
                ...prev.contact,
                address: fullAddress,
            },
        }));
    };


    const toggleSelectedDay = (index: number) => {
        setSelectedDays(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const applyBulkHours = () => {
        const updated = [...serviceData.businessHours];
        selectedDays.forEach(index => {
            updated[index].hours = `${bulkStartTime} - ${bulkEndTime}`;
        });
        setServiceData(prev => ({ ...prev, businessHours: updated }));
    };

    const handleChange = (key: string, value: any) => {
        setServiceData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleUseCurrentLocation = async () => {
        if (!navigator.geolocation) { alert('Geolocation is not supported by your browser.'); return; }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
                    if (!API_KEY) { alert('Google Maps key is missing.'); return; }

                    const controller = new AbortController();
                    const t = setTimeout(() => controller.abort(), 12000);
                    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;
                    const res = await fetch(url, { signal: controller.signal });
                    clearTimeout(t);
                    const data = await res.json();

                    if (data.status !== 'OK' || !data.results?.length) {
                        alert(data.error_message || data.status || 'No address found'); return;
                    }

                    const best = pickBestResult(data.results as GeocodeResult[]);
                    if (!best) { alert('No address found for this location.'); return; }

                    const parts = extractAddressParts(best); // your helper (already no-commas)

                    // Update visible fields (sanitized)
                    const cleaned = {
                        addressLine1: noComma(parts.addressLine1),
                        addressLine2: noComma(parts.addressLine2),
                        city: noComma(parts.city),
                        state: noComma(parts.state),
                        zip: noComma(parts.zip),
                        country: noComma(parts.country),
                    };
                    setAddressFields(cleaned);

                    // Persist ONLY the single-string address; DO NOT set coords here
                    const formatted = buildFormattedAddress(cleaned);
                    setServiceData((prev: any) => ({
                        ...prev,
                        contact: { ...prev.contact, address: formatted },
                        location: { type: 'Point', coordinates: [0, 0] },      // <- explicitly clear
                    }));

                    console.log(serviceData);
                    console.log(serviceData.location);
                    
                } catch (e) {
                    console.error('Reverse geocoding failed:', e);
                    alert('Reverse geocoding failed. Check API key & billing.');
                }
            },
            (error) => {
                const map: Record<number, string> = {
                    1: 'Permission denied. Please allow location access.',
                    2: 'Position unavailable. Try again.',
                    3: 'Timed out. Please try again.',
                };
                alert(map[error.code] ?? 'Failed to get current location.');
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    };





    const handleFileUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const urls = Array.from(files).map(file => URL.createObjectURL(file));
        if (key === 'coverImage') setServiceData((prev: any) => ({ ...prev, coverImage: urls[0] }));
        else setServiceData((prev: any) => ({ ...prev, [key]: [...prev[key], ...urls] }));
    };

    const removeImage = (key: string | number) => {
        if (key === 'coverImage') {
            setServiceData((prev: any) => ({ ...prev, coverImage: '' }));
        } else {
            setServiceData((prev: any) => ({
                ...prev,
                images: prev.images.filter((_: string, i: number) => i !== key),
            }));
        }
    };

    const removeVideo = (index: number) => {
        setServiceData((prev: any) => ({
            ...prev,
            videos: prev.videos.filter((_: string, i: number) => i !== index),
        }));
    };
    const handleBusinessHourChange = (
        index: number,
        key: 'day' | 'hours',
        value: string
    ) => {
        const updated = [...serviceData.businessHours];
        updated[index][key] = value;
        setServiceData((prev: any) => ({ ...prev, businessHours: updated }));
    };


    const handleContactChange = (key: string, value: string) => {
        setServiceData((prev: any) => ({
            ...prev,
            contact: { ...prev.contact, [key]: value },
        }));
    };



    const updateCategory = (
        index: number,
        key: keyof CategorySelection,
        value: string | string[]
    ) => {
        const updated = [...serviceData.categories];
        updated[index][key] = value as never;
        setServiceData((prev) => ({ ...prev, categories: updated }));
    };


    const removeCategory = (index: number) => {
        const updated = [...serviceData.categories];
        updated.splice(index, 1);
        setServiceData((prev) => ({ ...prev, categories: updated }));
    };

    const addFeature = () => setServiceData((prev) => ({ ...prev, features: [...prev.features, ''] }));
    const updateFeature = (index: number, value: string) => {
        const updated = [...serviceData.features];
        updated[index] = value;
        setServiceData((prev) => ({ ...prev, features: updated }));
    };
    const removeFeature = (index: number) => {
        const updated = [...serviceData.features];
        updated.splice(index, 1);
        setServiceData((prev) => ({ ...prev, features: updated }));
    };

    const toggleAmenity = (idx: number) => {
        setServiceData(prev => ({
            ...prev,
            amenities: prev.amenities.map((am, i) =>
                i === idx ? { ...am, available: !am.available } : am
            ),
        }));
    };

    const updateAmenity = (idx: number, value: string) => {
        setServiceData(prev => ({
            ...prev,
            amenities: prev.amenities.map((am, i) =>
                i === idx ? { ...am, label: value } : am
            ),
        }));
    };

    const addAmenity = () => {
        setServiceData(prev => ({
            ...prev,
            amenities: [...prev.amenities, { label: '', available: true, isDefault: false }],
        }));
    };

    const removeAmenity = (idx: number) => {
        const amenity = serviceData.amenities[idx];
        if (amenity.isDefault) return; // prevent removing default ones
        setServiceData(prev => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== idx),
        }));
    };


    const addFaq = () => {
        setServiceData((prev) => ({
            ...prev,
            faq: [...prev.faq, { question: '', answer: '' }],
        }));
    };

    const updateFaq = (
        index: number,
        key: keyof FAQ,
        value: string
    ) => {
        const updated = [...serviceData.faq];
        updated[index][key] = value;
        setServiceData((prev) => ({ ...prev, faq: updated }));
    };


    const removeFaq = (index: number) => {
        const updated = [...serviceData.faq];
        updated.splice(index, 1);
        setServiceData((prev) => ({ ...prev, faq: updated }));
    };



    const validateServiceData = (serviceData: any): boolean => {
        if (!serviceData.title?.trim()) {
            toast.error('Title is required');
            return false;
        }

        if (!serviceData.description?.trim()) {
            toast.error('Description is required');
            return false;
        }

        if (!serviceData.price || isNaN(Number(serviceData.price))) {
            toast.error('Valid price is required');
            return false;
        }

        if (!serviceData.duration?.trim()) {
            toast.error('Please enter the duration');
            return false;
        }

        if (!serviceData.coverImage) {
            toast.error('Please upload at least one image');
            return false;
        }

        if (!serviceData.contact?.phone?.trim()) {
            toast.error('Please enter a valid phone number');
            return false;
        }

        if (!serviceData.contact?.email?.trim()) {
            toast.error('Please enter a valid email');
            return false;
        }

        if (!serviceData.contact?.website?.trim()) {
            toast.error('Please enter a website');
            return false;
        }

        if (!serviceData.contact?.address?.trim()) {
            toast.error('We are unable to get your location');
            return false;
        }

        // ✅ Business Hours Validation
        for (const entry of serviceData.businessHours) {
            if (entry.hours !== 'Closed') {
                const [start, end] = entry.hours?.split(' - ') || [];
                if (!start || !end) {
                    toast.error(`Please enter both start and end time or mark "${entry.day}" as Closed`);
                    return false;
                }
            }
        }

        // ✅ Services Offered
        if (!serviceData.services || serviceData.services.length === 0) {
            toast.error('Please add at least one service offered');
            return false;
        }

        for (const entry of serviceData.services) {
            if (!entry.name?.trim()) {
                toast.error('Please enter a name for each service offered');
                return false;
            }
        }

        // ✅ Features
        if (!serviceData.features || serviceData.features.length === 0) {
            toast.error('Please add at least one feature');
            return false;
        }

        for (const feature of serviceData.features) {
            if (!feature?.trim()) {
                toast.error('Feature cannot be empty');
                return false;
            }
        }

        // ✅ Categories
        if (!serviceData.categories || serviceData.categories.length === 0) {
            toast.error('Please select at least one category');
            return false;
        }

        for (const cat of serviceData.categories) {
            console.log(cat);

            if (!cat.categoryId) {
                toast.error('Category ID cannot be empty');
                return false;
            }
        }

        // ✅ FAQ
        for (const faq of serviceData.faq || []) {
            if (!faq.question?.trim() || !faq.answer?.trim()) {
                toast.error('Please fill all FAQ questions and answers');
                return false;
            }
        }

        return true;
    };


    const submitService = async (publish: boolean) => {
        if (!validateServiceData(serviceData)) return;

        if (!businessId) {
            alert("Business ID is missing.");
            return;
        }

        const publishErrors = publish ? validateServiceForPublish(serviceData) : {};
        if (Object.keys(publishErrors).length > 0) {
            setFieldErrors(publishErrors);
            toast.error("Fix the highlighted fields before publishing.");
            return;
        }

        setPublishIntent(publish);
        setIsSubmitting(true);
        setFieldErrors({});

        try {
            let coverImageUrl = serviceData.coverImage;
            if (coverImageUrl?.startsWith("blob:")) {
                const blob = await fetch(coverImageUrl).then((r) => r.blob());
                const fileObj = new File([blob], `service-cover-${Date.now()}.jpg`, {
                    type: blob.type || "image/jpeg",
                });
                coverImageUrl = await uploadToS3(fileObj);
            }

            const alreadyUploadedImageCount = (serviceData.images || []).filter(
                (url) => !url.startsWith("blob:")
            ).length;

            const uploadedImages = await Promise.all(
                (serviceData.images || []).map(async (imgUrl, i) => {
                    if (imgUrl.startsWith("blob:")) {
                        const blob = await fetch(imgUrl).then((r) => r.blob());
                        const fileObj = new File([blob], `service-img-${Date.now()}-${i}.jpg`, {
                            type: blob.type || "image/jpeg",
                        });
                        return await uploadToS3(fileObj, {
                            galleryType: "service-gallery",
                            currentImageCount: alreadyUploadedImageCount,
                        });
                    }
                    return imgUrl;
                })
            );

            const uploadedVideos = await Promise.all(
                (serviceData.videos || []).map(async (vidUrl, i) => {
                    if (vidUrl.startsWith("blob:")) {
                        const blob = await fetch(vidUrl).then((r) => r.blob());
                        const fileObj = new File([blob], `service-vid-${Date.now()}-${i}.mp4`, {
                            type: blob.type || "video/mp4",
                        });
                        return await uploadToS3(fileObj);
                    }
                    return vidUrl;
                })
            );

            const preparedForm = {
                ...serviceData,
                coverImage: coverImageUrl,
                images: uploadedImages,
                videos: uploadedVideos,
            };

            const payload = serializeServicePayload(preparedForm, { businessId, publish });
            const result = await updateService(serviceId, payload);

            let publicVisible: boolean | undefined;
            if (publish && result.service._id) {
                const verification = await verifyPublicListing(result.service._id);
                publicVisible = verification.visible;
            }

            const successMessage = getPublicationSuccessMessage(result, { publish, publicVisible });
            toast.success(successMessage.toast);
            if (successMessage.detail) {
                toast.info(successMessage.detail);
            }

            setLoadedIsPublished(Boolean(result.service.isPublished));
            router.push(`/partners/${businessSlug}/inventory?updated=1`);
        } catch (err) {
            console.error("Submission error:", err);
            if (err instanceof GalleryLimitError) {
                toast.error(err.message);
                return;
            }

            const apiFieldErrors = extractFieldErrorsFromError(err);
            if (Object.keys(apiFieldErrors).length > 0) {
                setFieldErrors(apiFieldErrors);
            }

            toast.error(
                getUserSafeMessage(
                    err,
                    publish ? "Publication failed. Please try again." : "Draft save failed. Please try again."
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnpublish = async () => {
        await submitService(false);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`);
                const data = await response.json();

                if (response.ok && data?.success && data?.data) {
                    setServiceCategories(data.data.serviceCategories || []);
                    setCategories([]); // Clear selected category if needed
                    console.log(data.data.serviceCategories);

                } else {
                    console.error('Invalid category response:', data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        console.log(serviceData.location.coordinates, serviceData.location.type);


        fetchCategories();
    }, []);

    if (!dataLoaded) {
        return (
            <div className="flex items-center justify-center p-10">
                <p className="text-gray-500">Loading service data...</p>
            </div>
        );
    }


    return (
        <div className="flex flex-col lg:flex-row lg:gap-6">
            <div className="flex-1 space-y-6">
                <h1 className="text-xl font-semibold roboto">Update Service</h1>

                <div className="p-5 space-y-4 bg-white rounded-md shadow">
                    <h2 className="pb-2 text-base font-semibold border-b roboto">Service Details</h2>

                    <input type="text" placeholder="Title" value={serviceData.title} required onChange={(e) => handleChange('title', e.target.value)} className="w-full p-2 border rounded" />
                    <textarea placeholder="Description" value={serviceData.description} required onChange={(e) => handleChange('description', e.target.value)} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Price" required value={serviceData.price || ''} onChange={(e) => handleChange('price', Number(e.target.value))} className="w-full p-2 border rounded" />
                    <input type="text" placeholder="Duration (e.g., 30 min)" required value={serviceData.duration} onChange={(e) => handleChange('duration', e.target.value)} className="w-full p-2 border rounded" />

                    <div className="mb-6">
                        <ChildServiceFields
                            children={serviceData.services}
                            fieldErrors={fieldErrors}
                            onAdd={() =>
                                setServiceData((prev) => ({
                                    ...prev,
                                    services: [...prev.services, createEmptyChildService()],
                                }))
                            }
                            onRemove={(index) => {
                                if (serviceData.services.length === 1) return;
                                setServiceData((prev) => ({
                                    ...prev,
                                    services: prev.services.filter((_, i) => i !== index),
                                }));
                            }}
                            onUpdate={(index, field, value) => {
                                const updated = [...serviceData.services];
                                updated[index] = { ...updated[index], [field]: value };
                                setServiceData((prev) => ({ ...prev, services: updated }));
                            }}
                        />
                    </div>


                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Business Hours</h3>

                        {/* 🔁 Bulk Apply Section */}
                        <div className="p-4 space-y-3 border rounded-md bg-gray-50">
                            <p className="text-sm font-medium text-gray-800">Apply hours to multiple days</p>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <input
                                    type="time"
                                    value={bulkStartTime}
                                    onChange={(e) => setBulkStartTime(e.target.value)}
                                    className="w-full p-2 text-sm border rounded sm:w-40"
                                />
                                <span className="text-sm text-gray-500">to</span>
                                <input
                                    type="time"
                                    value={bulkEndTime}
                                    onChange={(e) => setBulkEndTime(e.target.value)}
                                    className="w-full p-2 text-sm border rounded sm:w-40"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3 pt-1">
                                {days.map((day: string, i: number) => (
                                    <label key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={selectedDays.includes(i)}
                                            onChange={() => toggleSelectedDay(i)}
                                            className="accent-blue-600"
                                        />
                                        {day}
                                    </label>
                                ))}
                            </div>

                            <button
                                onClick={applyBulkHours}
                                className="px-4 py-1 mt-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                Apply to Selected Days
                            </button>
                        </div>

                        {/* 🧾 Daily View */}
                        <div className="space-y-4">
                            {serviceData.businessHours.map((entry, index) => (
                                <div key={index} className="flex flex-wrap items-center gap-3">
                                    <div className="text-sm font-medium text-gray-800 w-28">{entry.day}</div>

                                    <select
                                        value={entry.hours === 'Closed' ? 'Closed' : 'Open'}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            handleBusinessHourChange(index, 'hours', value === 'Closed' ? 'Closed' : '');
                                        }}
                                        className="p-2 text-sm border rounded w-28"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                    </select>

                                    {entry.hours !== 'Closed' && (
                                        <>
                                            <input
                                                type="time"
                                                value={entry.hours?.split(' - ')[0] || ''}
                                                required
                                                onChange={(e) => {
                                                    const end = entry.hours?.split(' - ')[1] || '';
                                                    handleBusinessHourChange(index, 'hours', `${e.target.value} - ${end}`);
                                                }}
                                                className="p-2 text-sm border rounded w-36"
                                            />
                                            <span className="text-sm text-gray-600">to</span>
                                            <input
                                                type="time"
                                                value={entry.hours?.split(' - ')[1] || ''}
                                                required
                                                onChange={(e) => {
                                                    const start = entry.hours?.split(' - ')[0] || '';
                                                    handleBusinessHourChange(index, 'hours', `${start} - ${e.target.value}`);
                                                }}
                                                className="p-2 text-sm border rounded w-36"
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="lg:hidden">
                        <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Cover Image</h3>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload('coverImage', e)} className="w-full p-2 border rounded" />
                        {serviceData.coverImage && (
                            <div className="relative w-full mt-2">
                                <img src={serviceData.coverImage} alt="Cover" className="object-cover w-auto h-auto rounded" />
                                <button onClick={() => removeImage('coverImage')} className="absolute px-1 text-xs text-white bg-red-500 rounded top-1 right-1">✕</button>
                            </div>
                        )}
                    </div>

                    <div className="lg:hidden">
                        <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Gallery Images</h3>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileUpload('images', e)}
                            className="w-full p-2 border rounded"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {serviceData.images.map((img: string, i: number) => (
                                <div key={i} className="relative">
                                    <img
                                        src={img}
                                        alt={`img-${i}`}
                                        className="object-cover w-24 h-24 rounded"
                                    />
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Videos */}
                    <div className="lg:hidden">
                        <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Promo Videos</h3>
                        <input
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={(e) => handleFileUpload('videos', e)}
                            className="w-full p-2 border rounded"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {serviceData.videos.map((vid: string, i: number) => (
                                <div key={i} className="relative">
                                    <video
                                        src={vid}
                                        controls
                                        className="object-cover w-40 h-24 rounded"
                                    />
                                    <button
                                        onClick={() => removeVideo(i)}
                                        className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Contact Info</h3>
                        <input type="text" placeholder="Phone" value={serviceData.contact.phone} required onChange={(e) => handleContactChange('phone', e.target.value)} className="w-full p-2 border rounded" />
                        <input type="email" placeholder="Email" value={serviceData.contact.email} required onChange={(e) => handleContactChange('email', e.target.value)} className="w-full p-2 border rounded" />
                        <input type="text" placeholder="Website" value={serviceData.contact.website || ''} onChange={(e) => handleContactChange('website', e.target.value)} className="w-full p-2 border rounded" />
                        <div className="p-4 space-y-3 border rounded-md">
                            <h3 className="text-base font-semibold roboto">Business Address</h3>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={addressFields.addressLine1}
                                    required
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setStreetQuery(v);
                                        updateAddressField('addressLine1', v);
                                        debouncedStreetAuto(v);
                                    }}
                                    onFocus={() => { if (streetSugs.length) setStreetOpen(true); }}
                                    onBlur={() => setTimeout(() => setStreetOpen(false), 150)}  // allow click on menu
                                    className="w-full p-2 text-sm border rounded"
                                    autoComplete="off"
                                />
                                {streetOpen && streetSugs.length > 0 && (
                                    <ul className="absolute z-50 w-full mt-1 overflow-auto bg-white border rounded shadow max-h-64">
                                        {streetSugs.map((s) => (
                                            <li
                                                key={s.placeId}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => pickStreetSuggestion(s)}
                                                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                            >
                                                {s.description}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <input
                                type="text"
                                placeholder="Apartment, Suite, etc. (optional)"
                                value={addressFields.addressLine2}
                                required
                                onChange={(e) => updateAddressField('addressLine2', e.target.value)}
                                className="w-full p-2 text-sm border rounded"
                            />

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={addressFields.city}
                                    required
                                    onChange={(e) => updateAddressField('city', e.target.value)}
                                    className="w-full p-2 text-sm border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={addressFields.state}
                                    required
                                    onChange={(e) => updateAddressField('state', e.target.value)}
                                    className="w-full p-2 text-sm border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="ZIP Code"
                                    value={addressFields.zip}
                                    required
                                    onChange={(e) => updateAddressField('zip', e.target.value)}
                                    className="w-full p-2 text-sm border rounded"
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Country"
                                value={addressFields.country}
                                required
                                onChange={(e) => updateAddressField('country', e.target.value)}
                                className="w-full p-2 text-sm border rounded"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleUseCurrentLocation}
                                    className="px-4 py-1 mt-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                >
                                    Use Current Location
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* 🏷️ Category */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Category</h3>

                        {/* Single Dropdown to Add Categories */}
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value=""
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const matched = serviceCategories.find(c => c._id === selectedId);

                                    if (matched) {
                                        const alreadyAdded = serviceData.categories.some(
                                            (cat) => cat.categoryId._id === matched._id
                                        );

                                        if (!alreadyAdded) {
                                            const newCategory = {
                                                categoryId: { _id: matched._id, name: matched.name }
                                            };
                                            setServiceData(prev => ({
                                                ...prev,
                                                categories: [...prev.categories, newCategory],
                                            }));
                                        }
                                    }
                                }}
                                className="w-full p-2 border rounded sm:w-60"
                            >
                                <option value="">Select Category</option>
                                {serviceCategories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>

                        </div>

                        {/* Display Selected Categories as Blue Pills */}
                        {serviceData.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {serviceData.categories.map((cat) => {
                                    const matched = serviceCategories.find(c => c._id === cat.categoryId._id);

                                    if (!matched) return null;

                                    return (
                                        <div
                                            key={cat.categoryId._id}
                                            className="flex items-center gap-2 px-3 py-1 text-sm text-blue-700 border-2 border-blue-600 rounded-full bg-blue-50"
                                        >
                                            {matched.name}
                                            <button
                                                onClick={() => {
                                                    const newList = serviceData.categories.filter(
                                                        (c) => c.categoryId !== cat.categoryId
                                                    );
                                                    setServiceData((prev) => ({ ...prev, categories: newList }));
                                                }}
                                                className="text-blue-600 hover:text-red-500"
                                                title="Remove"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>


                    {/* 🌟 Features */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Features</h3>
                        <div className="flex flex-wrap gap-2">
                            {serviceData.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => updateFeature(idx, e.target.value)}
                                        className="w-full p-2 border rounded"
                                        placeholder={`Feature ${idx + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(idx)}
                                        className="px-2 text-white bg-red-500 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addFeature}
                            className="px-3 py-1 text-sm text-white bg-blue-600 rounded"
                        >
                            + Add Feature
                        </button>
                    </div>

                    {/* 🏨 Amenities */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Amenities</h3>

                        <div className="flex flex-wrap gap-3">
                            {serviceData.amenities.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => toggleAmenity(idx)}
                                    className={`cursor-pointer px-4 py-2 rounded-full border text-sm transition 
          ${item.available ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-700'} 
          flex items-center gap-2`}
                                >
                                    {item.isDefault ? (
                                        item.label
                                    ) : (
                                        <>
                                            <input
                                                type="text"
                                                value={item.label}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => updateAmenity(idx, e.target.value)}
                                                className="w-40 px-2 py-1 text-sm border rounded"
                                                placeholder="Custom Amenity"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeAmenity(idx);
                                                }}
                                                className="text-red-500"
                                            >
                                                ✕
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addAmenity}
                            className="px-3 py-1 mt-2 text-sm text-white bg-blue-600 rounded"
                        >
                            + Add Amenity
                        </button>
                    </div>


                    {/* ❓ FAQ Section */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">FAQ</h3>
                        {serviceData.faq.map((faqItem, idx) => (
                            <div key={idx} className="space-y-2">
                                <input
                                    type="text"
                                    value={faqItem.question}
                                    onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Question"
                                />
                                <textarea
                                    value={faqItem.answer}
                                    onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Answer"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFaq(idx)}
                                    className="px-2 text-white bg-red-500 rounded"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addFaq}
                            className="px-3 py-1 text-sm text-white bg-blue-600 rounded"
                        >
                            + Add FAQ
                        </button>
                    </div>

                    {/* 📌 Max Bookings Per Slot */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Max Bookings per Slot</h3>
                        <input
                            type="number"
                            value={serviceData.maxBookingsPerSlot}
                            onChange={(e) =>
                                setServiceData((prev) => ({
                                    ...prev,
                                    maxBookingsPerSlot: parseInt(e.target.value, 10) || 1,
                                }))
                            }
                            min={1}
                            className="w-full p-2 border rounded sm:w-60"
                        />
                    </div>

                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => submitService(false)}
                        className="min-h-11 rounded px-4 py-2 text-white bg-yellow-600 disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => submitService(true)}
                        className="min-h-11 rounded px-4 py-2 text-white bg-green-600 disabled:opacity-50"
                    >
                        Publish Service
                    </button>
                    {loadedIsPublished ? (
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleUnpublish}
                            className="min-h-11 rounded px-4 py-2 text-white bg-red-600 disabled:opacity-50"
                        >
                            Unpublish
                        </button>
                    ) : null}

                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                            if (originalServiceData) {
                                setServiceData(originalServiceData);
                                const [line1, line2, city, state, zip, country] =
                                    (originalServiceData.contact.address?.split(',').map((s: string) => s.trim())) || [];
                                setAddressFields({
                                    addressLine1: line1 || '',
                                    addressLine2: line2 || '',
                                    city: city || '',
                                    state: state || '',
                                    zip: zip || '',
                                    country: country || ''
                                });
                                toast.success('Form reset to original');
                            }
                        }}
                        className="min-h-11 rounded px-4 py-2 text-white bg-gray-600 disabled:opacity-50"
                    >
                        Reset
                    </button>
                </div>

            </div>

            <div className="hidden space-y-6 lg:block lg:w-80">
                <div className="p-5 bg-white rounded-md shadow">
                    <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Cover Image</h3>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload('coverImage', e)} className="w-full p-2 border rounded" />
                    {serviceData.coverImage && (
                        <div className="relative w-full mt-2">
                            <img src={serviceData.coverImage} alt="Cover" className="object-cover w-auto h-auto rounded" />
                            <button onClick={() => removeImage('coverImage')} className="absolute px-1 text-xs text-white bg-red-500 rounded top-1 right-1">✕</button>
                        </div>
                    )}
                </div>

                <div className="p-5 bg-white rounded-md shadow">
                    <h3 className="pb-2 mb-2 text-base font-semibold border-b roboto">Media</h3>
                    <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload('images', e)} className="w-full p-2 border rounded" />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {serviceData.images.map((img: string, i: number) => (
                            <div key={i} className="relative">
                                <img src={img} alt="Service" className="object-cover w-20 h-20 rounded" />
                                <button onClick={() => removeImage(i)} className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded">✕</button>
                            </div>
                        ))}
                    </div>

                    <input type="file" accept="video/*" multiple onChange={(e) => handleFileUpload('videos', e)} className="w-full p-2 mt-4 border rounded" />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {serviceData.videos.map((vid: string, i: number) => (
                            <div key={i} className="relative">
                                <video src={vid} className="object-cover w-32 h-20 rounded" controls />
                                <button onClick={() => removeVideo(i)} className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isSubmitting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-4 bg-white rounded shadow-md">
                        <div className="w-10 h-10 mx-auto border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                        <p className="mt-2 text-sm font-medium text-center text-gray-700">
                            {publishIntent ? 'Publishing...' : 'Saving Draft...'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateServiceForm;
