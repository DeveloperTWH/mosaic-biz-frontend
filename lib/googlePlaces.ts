// /lib/googlePlaces.ts
// zero external imports; dynamic script loader; caches readiness + session token

declare global {
  interface Window {
    google?: any;
  }
}

let readyPromise: Promise<void> | null = null;
let sessionToken: google.maps.places.AutocompleteSessionToken | null = null;

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function loadGooglePlaces(): Promise<void> {
  if (!isBrowser()) return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();
  if (readyPromise) return readyPromise;

  readyPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('gmaps-places');
    if (existing) return resolve();

    const s = document.createElement('script');
    s.id = 'gmaps-places';
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Google Maps Places'));
    document.head.appendChild(s);
  });

  return readyPromise;
}

function ensureSession() {
  if (!sessionToken) sessionToken = new google.maps.places.AutocompleteSessionToken();
  return sessionToken;
}

const getLong = (comps: any[], type: string) =>
  comps.find(c => c.types?.includes(type))?.long_name || '';

const getShort = (comps: any[], type: string) =>
  comps.find(c => c.types?.includes(type))?.short_name || '';

/** Compose a street/locality string like your component’s Address Line 2 builder */
export function composeAddressLine2(components: any[]) {
  const route = getLong(components, 'route');
  const neighborhood = getLong(components, 'neighborhood');
  const sublocality =
    getLong(components, 'sublocality') || getLong(components, 'sublocality_level_1');
  const adminLvl3 = getLong(components, 'administrative_area_level_3');

  const parts = [route, neighborhood, sublocality, adminLvl3].filter(Boolean);
  return Array.from(new Set(parts)).join(', ');
}

/** Normalize a PlaceResult into your field shape */
export function parsePlaceToAddress(place: google.maps.places.PlaceResult) {
  const comps = place.address_components || [];

  const countryShort = getShort(comps, 'country');
  const country = getLong(comps, 'country');
  const state = getLong(comps, 'administrative_area_level_1');
  const city =
    getLong(comps, 'locality') ||
    getLong(comps, 'administrative_area_level_2') ||
    getLong(comps, 'sublocality') ||
    getLong(comps, 'sublocality_level_1');
  const postalCode = getLong(comps, 'postal_code');

  // Your pattern: keep addr1 manual; derive addr2 from street/locality
  const addressLine2 = composeAddressLine2(comps) || (place as any).name || '';

  return {
    addressLine1: '', // user types house/apt
    addressLine2,
    city: city || '',
    state: state || '',
    postalCode: postalCode || '',
    country: country || '',
    countryShort: countryShort || '',
    formatted: place.formatted_address || '',
    lat: place.geometry?.location?.lat?.(),
    lng: place.geometry?.location?.lng?.(),
  };
}

interface AutocompletePrediction {
  description: string;
  placeId: string;
  matched_substrings: { length: number; offset: number }[];
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: { value: string; offset: number }[];
  types: string[];
}

/** Get suggestions (like your Autocomplete bound to addr2 input) */
/** Get suggestions (like your Autocomplete bound to addr2 input) */
export async function getPlaceSuggestions(input: string, opts?: {
  country?: string | string[]; // e.g. 'US' or ['US']
  types?: string[];            // default ['address']
}) {
  if (!input?.trim()) return [];
  await loadGooglePlaces();
  if (!window.google?.maps?.places) return [];

  const svc = new google.maps.places.AutocompleteService();
  const token = ensureSession();

  return new Promise<google.maps.places.AutocompletePrediction[]>((resolve) => {
    svc.getPlacePredictions(
      {
        input,
        sessionToken: token,
        types: opts?.types ?? ['address'],
        componentRestrictions: opts?.country
          ? { country: Array.isArray(opts.country) ? opts.country : [opts.country] }
          : undefined,
      },
      (preds, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !preds) return resolve([]);

        // Map the predictions to the expected structure
        const mappedPredictions = preds.map((pred: any) => ({
          description: pred.description,
          placeId: pred.place_id,
          matched_substrings: pred.matched_substrings || [], // Provide an empty array if it's missing
          place_id: pred.place_id,
          structured_formatting: {
            main_text: pred.structured_formatting.main_text,
            secondary_text: pred.structured_formatting.secondary_text,
            main_text_matched_substrings: pred.structured_formatting.main_text_matched_substrings || [], // Add main_text_matched_substrings here
          },
          terms: pred.terms || [],
          types: pred.types || [],
        }));

        resolve(mappedPredictions);
      }
    );
  });
}





/** Fetch details for a picked suggestion and normalize */
export async function getPlaceDetails(placeId: string) {
  if (!placeId) return null;
  await loadGooglePlaces();
  if (!window.google?.maps?.places) return null;

  const svc = new google.maps.places.PlacesService(document.createElement('div'));
  const token = ensureSession();

  return new Promise<ReturnType<typeof parsePlaceToAddress> | null>((resolve) => {
    svc.getDetails(
      {
        placeId,
        sessionToken: token,
        fields: ['address_components', 'formatted_address', 'name', 'geometry'],
      },
      (place, status) => {
        // reset token per Google best practice after selection
        sessionToken = null;
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return resolve(null);
        resolve(parsePlaceToAddress(place));
      }
    );
  });
}

/** Reverse geocode lat/lng (for “Use my location”) */
export async function reverseGeocode(lat: number, lng: number) {
  await loadGooglePlaces();
  if (!window.google?.maps) return null;

  const geocoder = new google.maps.Geocoder();
  return new Promise<ReturnType<typeof parsePlaceToAddress> | null>((resolve) => {
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
      if (status !== 'OK' || !results?.length) return resolve(null);
      resolve(parsePlaceToAddress(results[0]));
    });
  });
}

/** Fill city/state/country from a postal code (zip-first UX) */
export async function geocodeByPostalCode(postalCode: string) {
  if (!postalCode?.trim()) return null;
  await loadGooglePlaces();
  if (!window.google?.maps) return null;

  const geocoder = new google.maps.Geocoder();
  return new Promise<{ city: string; state: string; country: string; countryShort: string } | null>((resolve) => {
    geocoder.geocode(
      { componentRestrictions: { postalCode } as any }, // Google accepts this shape in JS SDK
      (results: any, status: string) => {
        if (status !== 'OK' || !results?.length) return resolve(null);
        const comps = results[0].address_components || [];
        resolve({
          city:
            getLong(comps, 'locality') ||
            getLong(comps, 'administrative_area_level_2') || '',
          state: getLong(comps, 'administrative_area_level_1') || '',
          country: getLong(comps, 'country') || '',
          countryShort: getShort(comps, 'country') || '',
        });
      }
    );
  });
}
