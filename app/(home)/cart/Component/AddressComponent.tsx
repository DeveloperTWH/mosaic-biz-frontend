import { LocateFixed } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
};

type AddressComponentProps = {
  addresses: Address[];
  selectedAddressId?: string;
  onSelect: (id: string) => void;
  onAdd: (addr: Address) => void;
};

const emptyNew: Omit<Address, "id"> = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

declare global {
  interface Window {
    google?: any;
  }
}



const COUNTRIES = [
  { code: "US", name: "United States" }
];


// States for India (sample); extend per country as needed.
const STATES_BY_COUNTRY: Record<string, string[]> = {
  US: [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
    "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
    "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ]
};




const AddressComponent = ({
  addresses,
  selectedAddressId,
  onSelect,
  onAdd,
}: AddressComponentProps) => {
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>(emptyNew);
  const addr2Ref = useRef<HTMLInputElement | null>(null);
  const [countryCode, setCountryCode] = useState<string>("US");



  // Lightweight loader (no extra deps)
  const loadGooglePlaces = (): Promise<void> => {
    if (window.google?.maps?.places) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.getElementById("gmaps-places");
      if (existing) return resolve();
      const s = document.createElement("script");
      s.id = "gmaps-places";
      s.async = true;
      s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load Google Maps Places"));
      document.head.appendChild(s);
    });
  };

  const getComponent = (components: any[], type: string) =>
    components.find((c: any) => c.types.includes(type))?.long_name || "";

  const getComponentShort = (components: any[], type: string) =>
    components.find((c: any) => c.types.includes(type))?.short_name || "";

  // Build Address Line 2 = street/locality, without house/apt no.
  const composeAddressLine2 = (components: any[]) => {
    const route = getComponent(components, "route"); // e.g., "Main St"
    const neighborhood = getComponent(components, "neighborhood"); // e.g., "Downtown"
    const sublocality =
      getComponent(components, "sublocality") ||
      getComponent(components, "sublocality_level_1"); // e.g., "Midtown"
    const adminLvl3 = getComponent(components, "administrative_area_level_3"); // sometimes township

    const parts = [route, neighborhood, sublocality, adminLvl3]
      .filter(Boolean);

    // de-duplicate while preserving order
    return Array.from(new Set(parts)).join(", ");
  };

  // Reverse-geocode for "Use my current location" near Postal Code
  const fillFromLatLng = async (lat: number, lng: number) => {
    await loadGooglePlaces();
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
      if (status !== "OK" || !results?.length) return;
      const place = results[0];
      const comps = place.address_components || [];

      const countryShort = getComponentShort(comps, "country");
      if (countryShort && countryShort !== "US") {
        alert("Sorry, we currently deliver only within the United States.");
        setNewAddress((prev) => ({
          ...prev,
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "United States",
        }));
        setCountryCode("US");
        return;
      }

      const postalCode = getComponent(comps, "postal_code");
      const city =
        getComponent(comps, "locality") ||
        getComponent(comps, "administrative_area_level_2");
      const state = getComponent(comps, "administrative_area_level_1");

      // Build street/locality for addr2 (keep addr1 manual for house/apt)
      const addr2 = composeAddressLine2(comps);

      setNewAddress((prev) => ({
        ...prev,
        postalCode: postalCode || prev.postalCode || "",
        city: city || prev.city || "",
        state: state || prev.state || "",
        country: "United States",
        addressLine2: addr2 || prev.addressLine2 || "",
      }));
      setCountryCode("US");
    });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => fillFromLatLng(pos.coords.latitude, pos.coords.longitude),
      () => {/* ignore errors silently */ }
    );
  };


  useEffect(() => {
    if (!showModal) return;
    let ac: any;

    loadGooglePlaces()
      .then(() => {
        if (!addr2Ref.current || !window.google?.maps?.places) return;
        ac = new window.google.maps.places.Autocomplete(addr2Ref.current, {
          types: ["address"],
          componentRestrictions: { country: ["US"] }, // ← force US only
          fields: ["address_components", "formatted_address", "name"],
        });

        ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          if (!place?.address_components) return;
          const comps = place.address_components;

          const countryShort = getComponentShort(comps, "country");
          if (countryShort && countryShort !== "US") {
            alert("Sorry, we currently deliver only within the United States.");
            // Clear non-US address pieces and keep country fixed to US
            setNewAddress((prev) => ({
              ...prev,
              addressLine2: "",
              city: "",
              state: "",
              postalCode: "",
              country: "United States",
            }));
            setCountryCode("US");
            return;
          }

          const city =
            getComponent(comps, "locality") ||
            getComponent(comps, "administrative_area_level_2");
          const state = getComponent(comps, "administrative_area_level_1");
          const postalCode = getComponent(comps, "postal_code");
          const addr2 = composeAddressLine2(comps) || place.name || "";

          setNewAddress((prev) => ({
            ...prev,
            addressLine2: addr2 || prev.addressLine2 || "",
            city: city || prev.city || "",
            state: state || prev.state || "",
            postalCode: postalCode || prev.postalCode || "",
            country: "United States",
          }));

          setCountryCode("US");
        });
      })
      .catch(() => { });

    return () => {
      ac = null;
    };
  }, [showModal, countryCode]);



  const selected = useMemo(
    () => addresses.find(a => a.id === selectedAddressId) || addresses.find(a => a.isDefault) || addresses[0],
    [addresses, selectedAddressId]
  );

  const displayLine = (a?: Address) =>
    a
      ? `${a.fullName}, ${a.addressLine1}${a.addressLine2 ? ", " + a.addressLine2 : ""}${a.city ? ", " + a.city : ""}${a.state ? ", " + a.state : ""}${a.postalCode ? " " + a.postalCode : ""}${a.country ? ", " + a.country : ""} — ${a.phone}`
      : "No address selected";

  const handleAddNewAddress = () => {
    const { fullName, phone, addressLine1 , addressLine2, city, postalCode, country, state } = newAddress;
    if (!fullName || !phone || !addressLine2 || !addressLine1 || !city || !postalCode || !country || !state) {
      alert("Please fill in all required fields.");
      return;
    }
    if (newAddress.country && newAddress.country !== "United States") {
      alert("Sorry, we only deliver within the United States.");
      return;
    }
    const newAddr: Address = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      ...newAddress,
    };
    onAdd(newAddr);
    setShowModal(false);
    setNewAddress(emptyNew);
  };

  useEffect(() => {
    if (!showModal) return;
    setNewAddress((prev) => ({ ...prev, country: "United States" }));
  }, [showModal]);

useEffect(() => {
  const zip = (newAddress.postalCode || "").trim();
  if (!showModal || zip.length < 5) return; // wait until user typed enough

  let cancelled = false;

  (async () => {
    await loadGooglePlaces();
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      { componentRestrictions: { postalCode: zip } }, // no country → detect actual country
      (results: any, status: string) => {
        if (cancelled) return;
        if (status !== "OK" || !results?.length) return;

        const comps = results[0].address_components || [];
        const countryShort = getComponentShort(comps, "country");

        if (countryShort !== "US") {
          alert("Sorry, we only deliver within the United States.");
          setNewAddress((prev) => ({
            ...prev,
            postalCode: "",
            city: "",
            state: "",
            country: "United States",
          }));
          setCountryCode("US");
          return;
        }

        const state = getComponent(comps, "administrative_area_level_1");
        const city =
          getComponent(comps, "locality") ||
          getComponent(comps, "administrative_area_level_2");

        setNewAddress((prev) => ({
          ...prev,
          state: state || prev.state || "",
          city: city || prev.city || "",
          country: "United States",
        }));
        setCountryCode("US");
      }
    );
  })();

  return () => { cancelled = true; };
}, [newAddress.postalCode, showModal]);



  return (
    <div>
      {/* Delivery Address Card */}
      <div className="flex items-center justify-between p-4 mt-6 bg-white border border-gray-200 rounded-md">
        <div>
          <div className="text-gray-600">Deliver to:</div>
          <div className="mt-2 text-sm text-gray-800">
            {displayLine(selected)}
          </div>
        </div>
        <div>
          <button
            className="px-5 py-2 bg-[#FFC400] font-semibold"
            onClick={() => setShowModal(true)}
          >
            {addresses.length > 0 ? "Change" : "Add Address"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-full sm:w-96 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold">Select or Add Address</h3>

            {/* Existing Addresses */}
            {addresses.length > 0 ? (
              <div className="mb-6 space-y-3">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <span className="text-sm text-gray-700">
                      {displayLine(a)}
                      {a.isDefault ? " • Default" : ""}
                    </span>
                    <button
                      className="text-xs text-blue-600"
                      onClick={() => {
                        onSelect(a.id);
                        setShowModal(false);
                      }}
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-600">
                No saved addresses yet.
              </div>
            )}

            {/* New Address */}
            <div className="mt-2">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Or, add a new address
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {/* POSTAL CODE FIRST + GEO BUTTON */}
                <div className="flex gap-2 sm:col-span-2">
                  <input
                    className="flex-1 p-2 border"
                    placeholder="Postal code *"
                    value={newAddress.postalCode ?? ""}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    autoComplete="postal-code"
                  />
                  <button
                    type="button"
                    onClick={useMyLocation}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-white border rounded-md bg-custom-blue"
                    title="Use my current location"
                  >
                    <LocateFixed/> Use my location
                  </button>
                </div>

                {/* COUNTRY DROPDOWN */}
                <select
                  className="p-2 border"
                  value={countryCode}
                  onChange={(e) => {
                    const cc = e.target.value;
                    setCountryCode(cc);
                    const selected = COUNTRIES.find(c => c.code === cc);
                    setNewAddress((prev) => ({ ...prev, country: selected?.name || "", state: "" }));
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>

                {/* STATE DROPDOWN (depends on country) */}
                <select
                  required
                  className="p-2 border"
                  value={newAddress.state ?? ""}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                >
                  <option value="">Select state/region</option>
                  {(STATES_BY_COUNTRY[countryCode] || []).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {/* CITY */}
                <input
                  className="p-2 border"
                  placeholder="City *"
                  value={newAddress.city ?? ""}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  autoComplete="address-level2"
                />

                {/* ADDRESS LINE 2 WITH AUTOCOMPLETE (searchable street/locality) */}
                <input
                  ref={addr2Ref}
                  className="p-2 border sm:col-span-2"
                  placeholder="Address line 2 (search & select street/locality)"
                  value={newAddress.addressLine2 ?? ""}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                />

                {/* ADDRESS LINE 1 (manual: house/flat no., building, etc.) */}
                <input
                  className="p-2 border sm:col-span-2"
                  placeholder="Address line 1 (House/Flat No., Building) *"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                />

                {/* FULL NAME & PHONE */}
                <input
                  className="p-2 border"
                  placeholder="Full name *"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  autoComplete="name"
                />
                <input
                  className="p-2 border"
                  placeholder="Phone *"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  autoComplete="tel"
                />

                <label className="flex items-center gap-2 mt-1 text-sm sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={!!newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  />
                  Set as default
                </label>
              </div>

              <button
                onClick={handleAddNewAddress}
                className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md"
              >
                Add Address
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressComponent;
