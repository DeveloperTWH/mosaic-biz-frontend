import { LocateFixed, Pencil, Trash2 } from "lucide-react";
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
  onAddressesChange?: (addresses: Address[]) => void;
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

const COUNTRIES = [{ code: "US", name: "United States" }];

const STATES_BY_COUNTRY: Record<string, string[]> = {
  US: [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
    "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
    "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  ],
};

const STORAGE_KEY = "mosaic_addresses";

const AddressComponent = ({
  addresses: propAddresses,
  selectedAddressId,
  onSelect: propOnSelect,
  onAdd: propOnAdd,
  onAddressesChange,
}: AddressComponentProps) => {
  const [addresses, setAddresses] = useState<Address[]>(propAddresses);
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>(emptyNew);
  const [editingId, setEditingId] = useState<string | null>(null);
  // addr2Ref intentionally left unattached — kept so geocode logic compiles
  const addr2Ref = useRef<HTMLInputElement | null>(null);
  const [countryCode, setCountryCode] = useState<string>("US");

  // ── localStorage helpers ───────────────────────────────────────────────────

  const persist = (list: Address[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch { /* ignore */ }
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Address[];
        setAddresses(parsed);
        onAddressesChange?.(parsed);
      }
    } catch { /* ignore */ }
    // Load saved addresses only once on mount.
    // Parent sync is handled through explicit add/update/delete callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAddresses(propAddresses);
  }, [propAddresses]);

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const onAdd = (addr: Address) => {
    const updated = [...addresses, addr];
    setAddresses(updated);
    persist(updated);
    onAddressesChange?.(updated);
    propOnAdd(addr);
  };

  const onUpdate = (addr: Address) => {
    const updated = addresses.map((a) => (a.id === addr.id ? addr : a));
    setAddresses(updated);
    persist(updated);
    onAddressesChange?.(updated);
  };

  const onDelete = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    persist(updated);
    onAddressesChange?.(updated);
  };

  const onSelect = (id: string) => {
    propOnSelect(id);
  };

  // ── Google Places helpers ──────────────────────────────────────────────────

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

  const composeAddressLine2 = (components: any[]) => {
    const route = getComponent(components, "route");
    const neighborhood = getComponent(components, "neighborhood");
    const sublocality =
      getComponent(components, "sublocality") ||
      getComponent(components, "sublocality_level_1");
    const adminLvl3 = getComponent(components, "administrative_area_level_3");
    const parts = [route, neighborhood, sublocality, adminLvl3].filter(Boolean);
    return Array.from(new Set(parts)).join(", ");
  };

  const fillFromLatLng = async (lat: number, lng: number) => {
    await loadGooglePlaces();
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
      if (status !== "OK" || !results?.length) return;
      const comps = results[0].address_components || [];

      const countryShort = getComponentShort(comps, "country");
      if (countryShort && countryShort !== "US") {
        alert("Sorry, we currently deliver only within the United States.");
        setNewAddress((prev) => ({ ...prev, addressLine2: "", city: "", state: "", postalCode: "", country: "United States" }));
        setCountryCode("US");
        return;
      }

      const postalCode = getComponent(comps, "postal_code");
      const city = getComponent(comps, "locality") || getComponent(comps, "administrative_area_level_2");
      const state = getComponent(comps, "administrative_area_level_1");
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
      () => { }
    );
  };

  // addr2Ref is intentionally not attached — this effect is a no-op
  useEffect(() => {
    if (!showModal) return;
    if (!addr2Ref.current || !window.google?.maps?.places) return;
  }, [showModal, countryCode]);

  // Auto-fill city/state from postal code
  useEffect(() => {
    const zip = (newAddress.postalCode || "").trim();
    if (!showModal || zip.length < 5) return;

    let cancelled = false;

    (async () => {
      await loadGooglePlaces();
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode(
        { componentRestrictions: { postalCode: zip } },
        (results: any, status: string) => {
          if (cancelled) return;
          if (status !== "OK" || !results?.length) return;

          const comps = results[0].address_components || [];
          const countryShort = getComponentShort(comps, "country");

          if (countryShort !== "US") {
            alert("Sorry, we only deliver within the United States.");
            setNewAddress((prev) => ({ ...prev, postalCode: "", city: "", state: "", country: "United States" }));
            setCountryCode("US");
            return;
          }

          const state = getComponent(comps, "administrative_area_level_1");
          const city = getComponent(comps, "locality") || getComponent(comps, "administrative_area_level_2");

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

  // Set country to US when modal opens
  useEffect(() => {
    if (!showModal) return;
    setNewAddress((prev) => ({ ...prev, country: "United States" }));
  }, [showModal]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const selected = useMemo(
    () =>
      addresses.find((a) => a.id === selectedAddressId) ||
      addresses.find((a) => a.isDefault) ||
      addresses[0],
    [addresses, selectedAddressId]
  );

  const displayLine = (a?: Address) =>
    a
      ? `${a.fullName}, ${a.addressLine1 ? a.addressLine1 + ", " : ""}${a.addressLine2 ? a.addressLine2 + ", " : ""}${a.city ? a.city + ", " : ""}${a.state ? a.state + " " : ""}${a.postalCode ?? ""}${a.country ? ", " + a.country : ""} — ${a.phone}`
      : "No address selected";

  // ── Form submit ────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    const { fullName, phone, postalCode, country, state } = newAddress;
    if (!fullName || !phone || !postalCode || !country || !state) {
      alert("Please fill in all required fields (Name, Mobile, Postal Code, Country, State).");
      return;
    }
    if (newAddress.country && newAddress.country !== "United States") {
      alert("Sorry, we only deliver within the United States.");
      return;
    }

    if (editingId) {
      // Update existing address
      onUpdate({ id: editingId, ...newAddress });
    } else {
      // Add new address
      const newAddr: Address = {
        id: crypto?.randomUUID?.() ?? String(Date.now()),
        ...newAddress,
      };
      onAdd(newAddr);
    }

    setShowModal(false);
    setNewAddress(emptyNew);
    setEditingId(null);
  };

  const openEdit = (addr: Address) => {
    const { id, ...rest } = addr;
    setEditingId(id);
    setNewAddress(rest);
    setCountryCode(COUNTRIES.find((c) => c.name === addr.country)?.code ?? "US");
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this address?")) return;
    onDelete(id);
  };

  const handleCancel = () => {
    setShowModal(false);
    setNewAddress(emptyNew);
    setEditingId(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Hide Google Places "Powered by Google" badge */}
      <style>{`
        .pac-container::after { display: none !important; }
        .pac-logo::after { display: none !important; }
      `}</style>

      {/* Delivery Address Card */}
      <div className="mt-6 flex items-center justify-between rounded-md border border-gray-200 bg-white p-4 text-brand-navy">
        <div>
          <div className="font-medium text-brand-muted">Deliver to:</div>
          <div className="mt-2 text-sm text-brand-navy">{displayLine(selected)}</div>
        </div>
        <div>
          <button
            type="button"
            className="bg-[#FFC400] px-5 py-2 font-semibold text-brand-navy"
            onClick={() => { setEditingId(null); setNewAddress(emptyNew); setShowModal(true); }}
          >
            {addresses.length > 0 ? "Change" : "Add Address"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-full sm:w-96 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold">
              {editingId ? "Edit Address" : "Select or Add Address"}
            </h3>

            {/* Existing Addresses (only shown when not editing) */}
            {!editingId && addresses.length > 0 && (
              <div className="mb-6 space-y-3">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start justify-between gap-2 p-3 border rounded"
                  >
                    <span className="flex-1 text-sm text-brand-navy">
                      {displayLine(a)}
                      {a.isDefault ? " • Default" : ""}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Select */}
                      <button
                        className="text-xs font-medium text-blue-600 hover:underline"
                        onClick={() => { onSelect(a.id); setShowModal(false); }}
                      >
                        Select
                      </button>
                      {/* Edit */}
                      <button
                        className="rounded p-1 text-brand-muted hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                        title="Edit address"
                        onClick={() => openEdit(a)}
                      >
                        <Pencil size={14} />
                      </button>
                      {/* Delete */}
                      <button
                        className="rounded p-1 text-brand-muted hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                        title="Delete address"
                        onClick={() => handleDelete(a.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!editingId && addresses.length === 0 && (
              <div className="mb-4 text-sm text-brand-muted">No saved addresses yet.</div>
            )}

            {/* Add / Edit Form */}
            <div className="mt-2">
              <div className="mb-2 text-sm font-medium text-brand-navy">
                {editingId ? "Update address details" : "Or, add a new address"}
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {/* ── Full Name & Mobile — top ── */}
                <input
                  className="p-2 border sm:col-span-2"
                  placeholder="Full name *"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  autoComplete="name"
                />
                <input
                  className="p-2 border sm:col-span-2"
                  placeholder="Mobile number *"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  autoComplete="tel"
                />

                {/* ── Postal Code + Location button ── */}
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
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-white border rounded-md bg-blue-600"
                    title="Use my current location"
                  >
                    <LocateFixed size={16} /> Use my location
                  </button>
                </div>

                {/* ── Country ── */}
                <select
                  className="p-2 border"
                  value={countryCode}
                  onChange={(e) => {
                    const cc = e.target.value;
                    setCountryCode(cc);
                    const sel = COUNTRIES.find((c) => c.code === cc);
                    setNewAddress((prev) => ({ ...prev, country: sel?.name || "", state: "" }));
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>

                {/* ── State ── */}
                <select
                  required
                  className="p-2 border"
                  value={newAddress.state ?? ""}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                >
                  <option value="">Select state/region *</option>
                  {(STATES_BY_COUNTRY[countryCode] || []).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {/* ── City ── */}
                <input
                  className="p-2 border sm:col-span-2"
                  placeholder="City *"
                  value={newAddress.city ?? ""}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  autoComplete="address-level2"
                />

                {/* ── Address Line 1 (optional) ── */}
                <input
                  className="p-2 border sm:col-span-2"
                  placeholder="Address line 1 (House / Flat No., Building)"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                  autoComplete="off"
                />

                {/* ── Address Line 2 (optional, NO Google autocomplete) ── */}
                <input
                  className="p-2 border sm:col-span-2"
                  placeholder="Address line 2 (Landmark / Street / Locality)"
                  value={newAddress.addressLine2 ?? ""}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                  autoComplete="off"
                />

                {/* ── Default checkbox ── */}
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
                onClick={handleSubmit}
                className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md"
              >
                {editingId ? "Save Changes" : "Add Address"}
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={handleCancel}
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
