"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface ShippingSettingsTabProps {
  businessId?: string;
  isActive: boolean;
}

type ShippingMethod = "flat_rate" | "quantity_based";

interface ShippingSpeedRates {
  standard: string;
  express: string;
  local: string;
}

interface QuantityTierForm {
  id: string;
  minQuantity: string;
  maxQuantity: string;
  rates: ShippingSpeedRates;
}

interface ShippingSettingsResponse {
  method?: ShippingMethod;
  flatRate?: {
    standard?: number;
    express?: number;
    local?: number;
  } | null;
  freeShipping?: {
    enabled?: boolean;
    threshold?: number | null;
  };
  quantityTiers?: Array<{
    _id?: string;
    minQuantity?: number | null;
    maxQuantity?: number | null;
    rates?: {
      standard?: number;
      express?: number;
      local?: number;
    };
  }>;
}

const defaultRates = (): ShippingSpeedRates => ({
  standard: "",
  express: "",
  local: "",
});

const createEmptyTier = (): QuantityTierForm => ({
  id: `tier-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  minQuantity: "",
  maxQuantity: "",
  rates: defaultRates(),
});

const createDefaultState = (): {
  method: ShippingMethod;
  flatRate: ShippingSpeedRates;
  quantityTiers: QuantityTierForm[];
  freeShippingEnabled: boolean;
  freeShippingThreshold: string;
} => ({
  method: "flat_rate" as ShippingMethod,
  flatRate: defaultRates(),
  quantityTiers: [createEmptyTier()],
  freeShippingEnabled: false,
  freeShippingThreshold: "",
});

function stringifySettings(state: ReturnType<typeof createDefaultState>) {
  return JSON.stringify(state);
}

function mapRates(
  source?: { standard?: number; express?: number; local?: number } | null
): ShippingSpeedRates {
  return {
    standard:
      source?.standard === undefined || source?.standard === null
        ? ""
        : String(source.standard),
    express:
      source?.express === undefined || source?.express === null
        ? ""
        : String(source.express),
    local:
      source?.local === undefined || source?.local === null ? "" : String(source.local),
  };
}

function normalizeSettings(
  settings?: ShippingSettingsResponse | null
): ReturnType<typeof createDefaultState> {
  const fallback = createDefaultState();

  if (!settings) {
    return fallback;
  }

  const quantityTiers =
    Array.isArray(settings.quantityTiers) && settings.quantityTiers.length > 0
      ? settings.quantityTiers.map((tier, index) => ({
          id: tier._id || `tier-${index}`,
          minQuantity:
            tier.minQuantity === undefined || tier.minQuantity === null
              ? ""
              : String(tier.minQuantity),
          maxQuantity:
            tier.maxQuantity === undefined || tier.maxQuantity === null
              ? ""
              : String(tier.maxQuantity),
          rates: mapRates(tier.rates),
        }))
      : fallback.quantityTiers;

  return {
    method: settings.method === "quantity_based" ? "quantity_based" : "flat_rate",
    flatRate: mapRates(settings.flatRate),
    quantityTiers,
    freeShippingEnabled: Boolean(settings.freeShipping?.enabled),
    freeShippingThreshold:
      settings.freeShipping?.threshold === undefined ||
      settings.freeShipping?.threshold === null
        ? ""
        : String(settings.freeShipping.threshold),
  };
}

function parseCurrency(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function parseQuantity(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default function ShippingSettingsTab({
  businessId,
  isActive,
}: ShippingSettingsTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<ShippingMethod>("flat_rate");
  const [flatRate, setFlatRate] = useState<ShippingSpeedRates>(defaultRates());
  const [quantityTiers, setQuantityTiers] = useState<QuantityTierForm[]>([createEmptyTier()]);
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("");
  const [initialSnapshot, setInitialSnapshot] = useState(stringifySettings(createDefaultState()));
  const [confirmSwitchTo, setConfirmSwitchTo] = useState<ShippingMethod | null>(null);

  const currentState = useMemo(
    () => ({
      method,
      flatRate,
      quantityTiers,
      freeShippingEnabled,
      freeShippingThreshold,
    }),
    [flatRate, freeShippingEnabled, freeShippingThreshold, method, quantityTiers]
  );

  const isDirty = useMemo(
    () => stringifySettings(currentState) !== initialSnapshot,
    [currentState, initialSnapshot]
  );

  const applyNormalizedSettings = (
    normalized: ReturnType<typeof normalizeSettings>,
    shouldResetSnapshot = true
  ) => {
    setMethod(normalized.method);
    setFlatRate(normalized.flatRate);
    setQuantityTiers(normalized.quantityTiers);
    setFreeShippingEnabled(normalized.freeShippingEnabled);
    setFreeShippingThreshold(normalized.freeShippingThreshold);

    if (shouldResetSnapshot) {
      setInitialSnapshot(stringifySettings(normalized));
    }
  };

  const loadSettings = async () => {
    if (!businessId) {
      const fallback = createDefaultState();
      applyNormalizedSettings(fallback);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/${businessId}/shipping-settings`,
        { withCredentials: true }
      );

      const normalized = normalizeSettings(response.data?.shippingSettings);
      applyNormalizedSettings(normalized);
    } catch (loadError: any) {
      console.error("Error fetching shipping settings:", loadError);
      const message =
        loadError?.response?.data?.message || "Failed to load shipping settings.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }

    loadSettings();
  }, [businessId, isActive]);

  const handleFlatRateChange = (speed: keyof ShippingSpeedRates, value: string) => {
    setFlatRate((prev) => ({ ...prev, [speed]: value }));
  };

  const handleTierChange = (
    tierId: string,
    field: "minQuantity" | "maxQuantity",
    value: string
  ) => {
    setQuantityTiers((prev) =>
      prev.map((tier) => (tier.id === tierId ? { ...tier, [field]: value } : tier))
    );
  };

  const handleTierRateChange = (
    tierId: string,
    speed: keyof ShippingSpeedRates,
    value: string
  ) => {
    setQuantityTiers((prev) =>
      prev.map((tier) =>
        tier.id === tierId
          ? { ...tier, rates: { ...tier.rates, [speed]: value } }
          : tier
      )
    );
  };

  const addTier = () => {
    setQuantityTiers((prev) => [...prev, createEmptyTier()]);
  };

  const removeTier = (tierId: string) => {
    setQuantityTiers((prev) =>
      prev.length === 1 ? prev : prev.filter((tier) => tier.id !== tierId)
    );
  };

  const canSwitchWithoutConfirm = (nextMethod: ShippingMethod) => {
    if (nextMethod === method) {
      return true;
    }

    if (method === "quantity_based" && nextMethod === "flat_rate") {
      return quantityTiers.every(
        (tier) =>
          !tier.minQuantity.trim() &&
          !tier.maxQuantity.trim() &&
          !tier.rates.standard.trim() &&
          !tier.rates.express.trim() &&
          !tier.rates.local.trim()
      );
    }

    if (method === "flat_rate" && nextMethod === "quantity_based") {
      return (
        !flatRate.standard.trim() &&
        !flatRate.express.trim() &&
        !flatRate.local.trim()
      );
    }

    return true;
  };

  const switchMethod = (nextMethod: ShippingMethod) => {
    if (canSwitchWithoutConfirm(nextMethod)) {
      setMethod(nextMethod);
      return;
    }

    setConfirmSwitchTo(nextMethod);
  };

  const confirmSwitch = () => {
    if (!confirmSwitchTo) {
      return;
    }

    if (confirmSwitchTo === "flat_rate") {
      setQuantityTiers([createEmptyTier()]);
    } else {
      setFlatRate(defaultRates());
    }

    setMethod(confirmSwitchTo);
    setConfirmSwitchTo(null);
  };

  const discardChanges = () => {
    const snapshot = JSON.parse(initialSnapshot) as ReturnType<typeof createDefaultState>;
    applyNormalizedSettings(snapshot, false);
  };

  const validateForm = () => {
    if (method === "flat_rate") {
      const standard = parseCurrency(flatRate.standard);
      const express = parseCurrency(flatRate.express);
      const local = parseCurrency(flatRate.local);

      if (standard === null || express === null || local === null) {
        return "Please enter valid flat-rate amounts for all delivery speeds.";
      }
    }

    if (method === "quantity_based") {
      if (quantityTiers.length === 0) {
        return "Add at least one quantity tier.";
      }

      for (let index = 0; index < quantityTiers.length; index += 1) {
        const tier = quantityTiers[index];
        const minQuantity = parseQuantity(tier.minQuantity);
        const maxQuantity = tier.maxQuantity.trim()
          ? parseQuantity(tier.maxQuantity)
          : null;
        const standard = parseCurrency(tier.rates.standard);
        const express = parseCurrency(tier.rates.express);
        const local = parseCurrency(tier.rates.local);

        if (minQuantity === null) {
          return `Tier ${index + 1}: minimum quantity must be a whole number above 0.`;
        }

        if (tier.maxQuantity.trim() && maxQuantity === null) {
          return `Tier ${index + 1}: maximum quantity must be blank or a whole number above 0.`;
        }

        if (maxQuantity !== null && maxQuantity < minQuantity) {
          return `Tier ${index + 1}: maximum quantity must be greater than or equal to minimum quantity.`;
        }

        if (standard === null || express === null || local === null) {
          return `Tier ${index + 1}: enter valid rates for standard, express, and local delivery.`;
        }

        if (index > 0) {
          const previousTier = quantityTiers[index - 1];
          const previousMax = previousTier.maxQuantity.trim()
            ? parseQuantity(previousTier.maxQuantity)
            : null;

          if (previousMax === null) {
            return "Only the last tier can have an open-ended quantity range.";
          }

          if (minQuantity !== previousMax + 1) {
            return "Quantity tiers should be continuous without gaps or overlaps.";
          }
        }
      }
    }

    if (freeShippingEnabled) {
      const threshold = parseCurrency(freeShippingThreshold);

      if (threshold === null || threshold <= 0) {
        return "Please enter a valid free shipping threshold above 0.";
      }
    }

    return null;
  };

  const handleSave = async () => {
    if (!businessId) {
      toast.error("Business not found.");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    const payload =
      method === "flat_rate"
        ? {
            method,
            flatRate: {
              standard: Number(flatRate.standard),
              express: Number(flatRate.express),
              local: Number(flatRate.local),
            },
            freeShipping: freeShippingEnabled
              ? {
                  enabled: true,
                  threshold: Number(freeShippingThreshold),
                }
              : { enabled: false },
          }
        : {
            method,
            quantityTiers: quantityTiers.map((tier) => ({
              minQuantity: Number(tier.minQuantity),
              maxQuantity: tier.maxQuantity.trim() ? Number(tier.maxQuantity) : null,
              rates: {
                standard: Number(tier.rates.standard),
                express: Number(tier.rates.express),
                local: Number(tier.rates.local),
              },
            })),
            freeShipping: freeShippingEnabled
              ? {
                  enabled: true,
                  threshold: Number(freeShippingThreshold),
                }
              : { enabled: false },
          };

    try {
      setSaving(true);
      setError(null);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/business/${businessId}/shipping-settings`,
        payload,
        { withCredentials: true }
      );

      const normalized = normalizeSettings(response.data?.shippingSettings);
      applyNormalizedSettings(normalized);
      toast.success(response.data?.message || "Shipping settings saved successfully.");
    } catch (saveError: any) {
      console.error("Error saving shipping settings:", saveError);
      const message =
        saveError?.response?.data?.message || "Failed to save shipping settings.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[28px] border border-[#e3d7c7] bg-[#fbf7f0] p-8 text-center shadow-[6px_6px_0_0_#2b241f]">
        <p className="font-montserrat text-sm font-medium text-[#5f5a53]">
          Loading shipping settings...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-[28px] border-2 border-[#2b241f] bg-[#f9f4eb] p-5 shadow-[8px_8px_0_0_#2b241f] sm:p-7">
        <div className="border-b-2 border-[#2b241f] pb-4">
          <h2 className="font-poppins text-[26px] font-semibold text-[#2b241f]">
            Shipping Settings
          </h2>
          <p className="mt-1 font-montserrat text-sm text-[#6d675f]">
            Choose how shipping is calculated for your store and save rates for each
            delivery speed.
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-[20px] border border-[#e4b2a8] bg-[#fff3f0] px-4 py-3 font-montserrat text-sm text-[#9f4332]">
            {error}
          </div>
        )}

        <div className="mt-6">
          <p className="font-montserrat text-xs uppercase tracking-[0.22em] text-[#928572]">
            Shipping Method
          </p>

          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            {[
              {
                key: "flat_rate" as const,
                title: "Flat Rate",
                description:
                  "One fixed rate per delivery speed. Same price regardless of order size.",
              },
              {
                key: "quantity_based" as const,
                title: "Quantity Based",
                description:
                  "Different rates per quantity tier. Great when shipping changes with item count.",
              },
            ].map((option) => {
              const selected = method === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => switchMethod(option.key)}
                  className={`rounded-[24px] border-2 p-5 text-left transition ${
                    selected
                      ? "border-[#2b241f] bg-[#2f2923] text-white shadow-[6px_6px_0_0_#c7b79e]"
                      : "border-dashed border-[#b6ab98] bg-[#fffdf8] text-[#2b241f] hover:border-[#2b241f]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`mt-1 h-5 w-5 rounded-full border-2 ${
                          selected
                            ? "border-white bg-white/15 ring-4 ring-white/15"
                            : "border-[#2b241f] bg-transparent"
                        }`}
                      >
                        <span
                          className={`mx-auto mt-[3px] block h-2.5 w-2.5 rounded-full ${
                            selected ? "bg-white" : "bg-transparent"
                          }`}
                        />
                      </span>
                      <h3 className="font-poppins text-2xl font-semibold">{option.title}</h3>
                    </div>

                    {selected && (
                      <span className="rounded-full border border-white/30 px-3 py-1 font-montserrat text-[11px] uppercase tracking-[0.18em] text-white/90">
                        Selected
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-4 max-w-md font-montserrat text-sm leading-6 ${
                      selected ? "text-white/80" : "text-[#6d675f]"
                    }`}
                  >
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {method === "flat_rate" ? (
          <div className="mt-6">
            <p className="font-montserrat text-xs uppercase tracking-[0.22em] text-[#928572]">
              Delivery Speed Rates
            </p>

            <div className="mt-3 overflow-hidden rounded-[24px] border-2 border-[#2b241f] bg-[#fffdf8]">
              {[
                {
                  key: "standard" as const,
                  label: "Standard",
                  description: "5-7 working days",
                },
                {
                  key: "express" as const,
                  label: "Express",
                  description: "2-3 working days",
                },
                {
                  key: "local" as const,
                  label: "Local",
                  description: "1-2 working days",
                },
              ].map((speed, index) => (
                <div
                  key={speed.key}
                  className={`grid gap-4 px-4 py-4 sm:grid-cols-[1.2fr_1fr] sm:items-center sm:px-6 ${
                    index !== 2 ? "border-b border-[#e8dfd2]" : ""
                  }`}
                >
                  <div>
                    <h3 className="font-poppins text-xl font-semibold text-[#2b241f]">
                      {speed.label}
                    </h3>
                    <p className="font-montserrat text-sm text-[#8a8175]">
                      {speed.description}
                    </p>
                  </div>

                  <label className="flex items-center gap-3">
                    <span className="font-poppins text-xl text-[#5c544a]">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={flatRate[speed.key]}
                      onChange={(event) =>
                        handleFlatRateChange(speed.key, event.target.value)
                      }
                      placeholder="0.00"
                      className="h-12 w-full rounded-[16px] border border-[#d6cbbb] bg-[#f1ede6] px-4 font-montserrat text-sm text-[#2b241f] outline-none transition focus:border-[#2b241f]"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-montserrat text-xs uppercase tracking-[0.22em] text-[#928572]">
                  Quantity Tiers
                </p>
                <p className="mt-1 font-montserrat text-sm text-[#6d675f]">
                  Create continuous quantity ranges and assign rates for each delivery
                  speed.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="hidden grid-cols-[1.3fr_1fr_1fr_1fr_52px] gap-3 px-2 lg:grid">
                {["Qty Range", "Standard", "Express", "Local", ""].map((label) => (
                  <p
                    key={label || "action"}
                    className="font-montserrat text-xs uppercase tracking-[0.2em] text-[#928572]"
                  >
                    {label}
                  </p>
                ))}
              </div>

              {quantityTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="grid gap-3 rounded-[22px] border border-[#dfd4c5] bg-[#fffdf8] p-4 lg:grid-cols-[1.3fr_1fr_1fr_1fr_52px] lg:items-center"
                >
                  <div>
                    <p className="mb-2 font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#928572] lg:hidden">
                      Qty Range
                    </p>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={tier.minQuantity}
                        onChange={(event) =>
                          handleTierChange(tier.id, "minQuantity", event.target.value)
                        }
                        placeholder="1"
                        className="h-11 rounded-[14px] border border-[#d6cbbb] bg-[#f1ede6] px-3 font-montserrat text-sm text-[#2b241f] outline-none transition focus:border-[#2b241f]"
                      />
                      <span className="font-poppins text-lg text-[#5c544a]">-</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={tier.maxQuantity}
                        onChange={(event) =>
                          handleTierChange(tier.id, "maxQuantity", event.target.value)
                        }
                        placeholder="No max"
                        className="h-11 rounded-[14px] border border-[#d6cbbb] bg-[#f1ede6] px-3 font-montserrat text-sm text-[#2b241f] outline-none transition focus:border-[#2b241f]"
                      />
                    </div>
                  </div>

                  {(["standard", "express", "local"] as const).map((speed) => (
                    <label key={speed} className="flex items-center gap-3">
                      <span className="font-poppins text-xl text-[#5c544a]">$</span>
                      <div className="w-full">
                        <p className="mb-2 font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#928572] lg:hidden">
                          {speed}
                        </p>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={tier.rates[speed]}
                          onChange={(event) =>
                            handleTierRateChange(tier.id, speed, event.target.value)
                          }
                          placeholder="0.00"
                          className="h-11 w-full rounded-[14px] border border-[#d6cbbb] bg-[#f1ede6] px-3 font-montserrat text-sm text-[#2b241f] outline-none transition focus:border-[#2b241f]"
                        />
                      </div>
                    </label>
                  ))}

                  <button
                    type="button"
                    onClick={() => removeTier(tier.id)}
                    disabled={quantityTiers.length === 1}
                    className="h-11 rounded-[14px] border border-transparent font-poppins text-2xl text-[#b54e3b] transition hover:border-[#e7d4cf] hover:bg-[#fff5f2] disabled:cursor-not-allowed disabled:text-[#d9c4bf]"
                    aria-label="Remove tier"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addTier}
                className="w-full rounded-[20px] border-2 border-dashed border-[#2b241f] bg-[#fff9ef] px-4 py-3 font-poppins text-lg font-semibold text-[#2b241f] transition hover:bg-[#f5ecdc]"
              >
                + Add Tier
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-[22px] border border-dashed border-[#d8cbb5] bg-[#fffaf2] p-4 sm:p-5">
          <label className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={freeShippingEnabled}
                onChange={(event) => setFreeShippingEnabled(event.target.checked)}
                className="h-5 w-5 rounded border-[#a28e70] text-[#2b241f] focus:ring-[#2b241f]"
              />
              <span className="font-poppins text-xl font-medium text-[#2b241f]">
                Free shipping over
              </span>
            </div>

            <div className="flex flex-1 items-center gap-3">
              <span className="font-poppins text-xl text-[#5c544a]">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={freeShippingThreshold}
                onChange={(event) => setFreeShippingThreshold(event.target.value)}
                disabled={!freeShippingEnabled}
                placeholder="0.00"
                className="h-11 w-full max-w-[220px] rounded-[14px] border border-[#d6cbbb] bg-[#f1ede6] px-3 font-montserrat text-sm text-[#2b241f] outline-none transition focus:border-[#2b241f] disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="font-montserrat text-sm text-[#8a8175]">(cart subtotal)</span>
            </div>
          </label>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={discardChanges}
            disabled={!isDirty || saving}
            className="rounded-[16px] border-2 border-[#2b241f] bg-white px-5 py-3 font-poppins text-lg font-medium text-[#2b241f] transition hover:bg-[#f7f1e7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-[16px] border-2 border-[#2b241f] bg-[#2f2923] px-5 py-3 font-poppins text-lg font-medium text-white shadow-[4px_4px_0_0_#c7b79e] transition hover:bg-[#433b33] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Shipping Settings"}
          </button>
        </div>
      </div>

      {confirmSwitchTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b241f]/45 px-4">
          <div className="w-full max-w-xl rounded-[20px] border-2 border-[#2b241f] bg-[#fffdf8] p-5 shadow-[8px_8px_0_0_#2b241f] sm:p-6">
            <h3 className="font-poppins text-[28px] font-semibold text-[#2b241f]">
              Switch to {confirmSwitchTo === "flat_rate" ? "Flat Rate" : "Quantity Based"}?
            </h3>
            <p className="mt-3 font-montserrat text-sm leading-7 text-[#5f5a53]">
              {confirmSwitchTo === "flat_rate"
                ? `You have ${quantityTiers.length} quantity ${
                    quantityTiers.length === 1 ? "tier" : "tiers"
                  } configured. Switching methods will clear those rates permanently.`
                : "You already entered flat-rate values. Switching methods will clear those rates permanently."}
            </p>

            <div className="mt-5 border-t border-dashed border-[#d7ccbe] pt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmSwitchTo(null)}
                  className="rounded-[14px] border-2 border-[#2b241f] bg-white px-5 py-2.5 font-poppins text-lg font-medium text-[#2b241f] transition hover:bg-[#f7f1e7]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmSwitch}
                  className="rounded-[14px] border-2 border-[#9e3729] bg-[#b54331] px-5 py-2.5 font-poppins text-lg font-medium text-white transition hover:bg-[#9f3729]"
                >
                  Yes, Switch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
